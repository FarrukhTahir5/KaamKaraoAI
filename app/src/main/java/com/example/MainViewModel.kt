package com.example

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.BookingDatabase
import com.example.data.BookingEntity
import com.example.data.BookingRepository
import com.example.data.Provider
import com.example.data.ProviderMarketplace
import com.example.service.AgentStep
import com.example.service.AgentTraceLog
import com.example.service.ParsedRequest
import com.example.service.QueryParser
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

enum class AppScreen {
    WELCOME,
    ASK_HOME,
    CLARIFY,
    UNDERSTOOD,
    MATCHES,
    EXPLANATION,
    CONFIRMED,
    FOLLOWUP,
    HISTORY,
    WORKFLOW,
    DIRECTORY,
    PROFILE,
    DEMO_SCENARIOS
}

data class MainUiState(
    val currentScreen: AppScreen = AppScreen.WELCOME,
    val inputQuery: String = "",
    val parsedRequest: ParsedRequest? = null,
    val matchedProviders: List<Provider> = emptyList(),
    val selectedProvider: Provider? = null,
    val backupProvider: Provider? = null,
    val activeBooking: BookingEntity? = null,
    val agentSteps: List<AgentStep> = emptyList(),
    
    // UI Loading & Simulator States
    val isLoading: Boolean = false,
    val isRecordingVoice: Boolean = false,
    val voiceSeconds: Int = 0,
    val isUploadingPhoto: Boolean = false,
    val photoIssueName: String? = null,
    val photoDetectedService: String? = null,
    
    // Clarification triggers
    val showClarificationForm: Boolean = false,
    val missingRegionInput: String = "",
    val missingTimeSelection: String = "Today",
    
    // Google Auth & User Profile State
    val isLoggedIn: Boolean = false,
    val userName: String = "",
    val userEmail: String = "",
    val userAvatarUrl: String = "",
    val showGoogleSignInDialog: Boolean = false,
    
    // Error state
    val errorMessage: String? = null
)

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val bookingDao = BookingDatabase.getDatabase(application).bookingDao()
    private val repository = BookingRepository(bookingDao)

    // Base UI States
    private val _uiState = MutableStateFlow(MainUiState())
    
    // Combined StateFlow combining Database Reactive Flow with view UI attributes
    val uiState: StateFlow<Pair<MainUiState, List<BookingEntity>>> = combine(
        _uiState,
        repository.allBookings
    ) { localUi, historyList ->
        Pair(localUi, historyList)
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = Pair(MainUiState(), emptyList())
    )

    fun navigateTo(screen: AppScreen) {
        _uiState.value = _uiState.value.copy(currentScreen = screen, errorMessage = null)
    }

    fun updateInputQuery(query: String) {
        _uiState.value = _uiState.value.copy(inputQuery = query)
    }

    // Presets Click Handler
    fun selectPreset(query: String) {
        _uiState.value = _uiState.value.copy(inputQuery = query)
        submitQuery(query)
    }

    // Voice simulation
    fun startVoiceSimulation() {
        if (_uiState.value.isRecordingVoice) return
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isRecordingVoice = true, voiceSeconds = 0)
            for (i in 1..3) {
                delay(800)
                _uiState.value = _uiState.value.copy(voiceSeconds = i)
            }
            delay(400)
            _uiState.value = _uiState.value.copy(
                isRecordingVoice = false,
                inputQuery = "Mujhe kal subah G-13 mein AC technician chahiye"
            )
            submitQuery("Mujhe kal subah G-13 mein AC technician chahiye")
        }
    }

    // Photo Issue simulation
    fun simulatePhotoSelection(issueType: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isUploadingPhoto = true)
            delay(1200) // Mock scanning/processing delay
            
            val (detectedService, queryMock) = when (issueType) {
                "pipe_burst" -> Pair("Plumber", "Bahria Town mein washroom pipe leak ho raha hai urgent")
                "ac_ice" -> Pair("AC Technician", "G-11 mein AC cooling nahi kar raha gas refill chahiye")
                "spark_switch" -> Pair("Electrician", "Bahria Town mein bedroom board spark kar raha hai help")
                else -> Pair("Plumber", "Leakage issue found")
            }

            _uiState.value = _uiState.value.copy(
                isUploadingPhoto = false,
                photoIssueName = when (issueType) {
                    "pipe_burst" -> "Bathroom pipe rupture"
                    "ac_ice" -> "AC Compressor ice forming"
                    "spark_switch" -> "Sparking wall outlet socket"
                    else -> "Unknown issue"
                },
                photoDetectedService = detectedService,
                inputQuery = queryMock
            )
            submitQuery(queryMock)
        }
    }

    // Submit Query Process
    fun submitQuery(query: String) {
        if (query.trim().isEmpty()) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            delay(800) // Natural analyzing delay
            
            val parsed = QueryParser.parse(query)
            
            // Check if service type is missing -> Smart Clarification Mode!
            if (parsed.serviceType.isEmpty()) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    parsedRequest = parsed,
                    showClarificationForm = true,
                    currentScreen = AppScreen.CLARIFY
                )
                return@launch
            }

            // Check if location is missing -> ask for clarification
            if (parsed.location.isEmpty()) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    parsedRequest = parsed,
                    showClarificationForm = true,
                    currentScreen = AppScreen.CLARIFY
                )
                return@launch
            }

            processMatching(parsed)
        }
    }

    // Handle Smart Clarification Submit
    fun submitClarification(sector: String, timeDay: String) {
        val currentParsed = _uiState.value.parsedRequest ?: return
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            delay(600)

            val resolvedLocation = if (sector.isNotEmpty()) "$sector Islamabad" else "G-13 Islamabad"
            val updatedParsed = currentParsed.copy(
                serviceType = if (currentParsed.serviceType.isEmpty()) "Plumber" else currentParsed.serviceType, // Default backup
                location = resolvedLocation,
                time = if (timeDay == "Now") "Now / Urgent" else "Tomorrow Morning",
                urgency = if (timeDay == "Now") "High" else "Normal",
                suggestedTime = if (timeDay == "Now") "Available Now" else "10:00 AM"
            )

            _uiState.value = _uiState.value.copy(showClarificationForm = false)
            processMatching(updatedParsed)
        }
    }

    private fun processMatching(parsed: ParsedRequest) {
        // Find providers near the specified location
        val rawList = ProviderMarketplace.getProvidersForService(parsed.serviceType, parsed.location)
        
        // Sort providers by reliability index (calculateScore)
        val isEmergency = parsed.urgency == "High"
        val scoredList = rawList.sortedByDescending { it.calculateScore(isEmergency) }

        if (scoredList.isEmpty()) {
            _uiState.value = _uiState.value.copy(
                isLoading = false,
                errorMessage = "Sorry, no service providers found for '${parsed.serviceType}' in this area.",
                currentScreen = AppScreen.ASK_HOME
            )
            return
        }

        val bestMatch = scoredList.first()
        val backupMatch = if (scoredList.size > 1) scoredList[1] else null

        _uiState.value = _uiState.value.copy(
            isLoading = false,
            parsedRequest = parsed,
            matchedProviders = scoredList,
            selectedProvider = bestMatch,
            backupProvider = backupMatch,
            currentScreen = AppScreen.UNDERSTOOD
        )
    }

    // Trigger confirmation and local booking insertion
    fun confirmAndBook() {
        val parsed = _uiState.value.parsedRequest ?: return
        val provider = _uiState.value.selectedProvider ?: return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            delay(1000) // Simulating network handshake with Ali

            val bookingId = "KK-${1000 + (10..999).random()}"
            val newBooking = BookingEntity(
                bookingId = bookingId,
                serviceType = parsed.serviceType,
                providerName = provider.name,
                location = parsed.location,
                slot = "${parsed.time}, ${parsed.suggestedTime}",
                status = "confirmed",
                estimatedCharges = provider.estimatedCharges,
                isEmergency = parsed.urgency == "High"
            )

            // Save booking in local SQLite (Room) Database
            repository.insertBooking(newBooking)

            // Generate Technical Agent Workflow Trace
            val traceList = AgentTraceLog.generateTrace(
                query = parsed.originalQuery,
                parsed = parsed,
                matchedProviders = _uiState.value.matchedProviders,
                bestProviderName = provider.name,
                bookingId = bookingId
            )

            _uiState.value = _uiState.value.copy(
                isLoading = false,
                activeBooking = newBooking,
                agentSteps = traceList,
                currentScreen = AppScreen.CONFIRMED
            )
        }
    }

    // Select alternative provider instead of recommended Ali
    fun selectAlternativeProvider(provider: Provider) {
        val parsed = _uiState.value.parsedRequest ?: return
        val providersList = _uiState.value.matchedProviders
        val backup = if (provider.id == providersList.firstOrNull()?.id) {
            if (providersList.size > 1) providersList[1] else null
        } else {
            providersList.firstOrNull()
        }

        _uiState.value = _uiState.value.copy(
            selectedProvider = provider,
            backupProvider = backup,
            currentScreen = AppScreen.EXPLANATION
        )
    }

    // Simulate Status Change for Demo Mode (Wow Factor 11)
    fun progressActiveBookingStatus() {
        val active = _uiState.value.activeBooking ?: return
        viewModelScope.launch {
            val nextStatus = when (active.status) {
                "confirmed" -> "reminder_sent"
                "reminder_sent" -> "on_the_way"
                "on_the_way" -> "completed"
                "completed" -> "rating_requested"
                else -> "confirmed"
            }

            val updated = active.copy(status = nextStatus)
            repository.insertBooking(updated) // Overwrites since id is same
            _uiState.value = _uiState.value.copy(activeBooking = updated)
        }
    }

    fun selectHistoryBooking(booking: BookingEntity) {
        // Regenerate trace log when reviewing history item
        val dummyParsed = ParsedRequest(
            serviceType = booking.serviceType,
            location = booking.location,
            time = booking.slot.split(",").firstOrNull() ?: "Tomorrow",
            urgency = if (booking.isEmergency) "High" else "Normal",
            suggestedTime = booking.slot.split(",").lastOrNull()?.trim() ?: "10:00 AM",
            originalQuery = "Review request with ID ${booking.bookingId}",
            isGeminiResolved = false
        )

        val providersList = ProviderMarketplace.getProvidersForService(booking.serviceType, booking.location)
        val traceList = AgentTraceLog.generateTrace(
            query = dummyParsed.originalQuery,
            parsed = dummyParsed,
            matchedProviders = providersList,
            bestProviderName = booking.providerName,
            bookingId = booking.bookingId
        )

        _uiState.value = _uiState.value.copy(
            activeBooking = booking,
            parsedRequest = dummyParsed,
            agentSteps = traceList,
            currentScreen = AppScreen.CONFIRMED
        )
    }

    fun deleteBookingHistoryItem(id: String) {
        viewModelScope.launch {
            repository.deleteBooking(id)
        }
    }

    fun clearAllHistory() {
        viewModelScope.launch {
            repository.clearAllBookings()
        }
    }

    private var pendingScreenAfterLogin: AppScreen? = null

    fun toggleGoogleSignInDialog(show: Boolean, targetScreen: AppScreen? = null) {
        pendingScreenAfterLogin = targetScreen
        _uiState.value = _uiState.value.copy(showGoogleSignInDialog = show)
    }

    fun signInWithGoogle(name: String, email: String, avatarUrl: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, showGoogleSignInDialog = false)
            delay(1200) // realistic authentic Google OAuth background verification delay
            val nextScreen = pendingScreenAfterLogin ?: AppScreen.ASK_HOME
            pendingScreenAfterLogin = null
            _uiState.value = _uiState.value.copy(
                isLoading = false,
                isLoggedIn = true,
                userName = name,
                userEmail = email,
                userAvatarUrl = avatarUrl,
                currentScreen = nextScreen
            )
        }
    }

    fun logoutGoogle() {
        _uiState.value = _uiState.value.copy(
            isLoggedIn = false,
            userName = "",
            userEmail = "",
            userAvatarUrl = "",
            currentScreen = AppScreen.WELCOME
        )
    }

    fun updateProfileName(newName: String) {
        _uiState.value = _uiState.value.copy(userName = newName)
    }
}
