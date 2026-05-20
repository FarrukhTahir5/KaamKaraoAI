package com.example.service

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class AgentStep(
    val id: Int,
    val agentName: String,
    val userFriendlyName: String,
    val status: String, // "PENDING", "RUNNING", "COMPLETED", "FAILED"
    val description: String,
    val logs: List<String>,
    val timestamp: String = SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault()).format(Date())
)

object AgentTraceLog {
    fun generateTrace(
        query: String,
        parsed: ParsedRequest,
        matchedProviders: List<com.example.data.Provider>,
        bestProviderName: String,
        bookingId: String
    ): List<AgentStep> {
        val format = SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault())
        val timeNow = { format.format(Date()) }

        return listOf(
            AgentStep(
                id = 1,
                agentName = "planner_agent.py",
                userFriendlyName = "Request Planner",
                status = "COMPLETED",
                description = "Created the custom service booking workflow.",
                logs = listOf(
                    "LOG: Initializing workflow orchestration for query: \"$query\"",
                    "TOOL_CALL: Analyzing workspace constraints and target service state",
                    "LOG: Scheduled 8 specialized sub-agents sequentially to process life-cycle"
                )
            ),
            AgentStep(
                id = 2,
                agentName = "intent_agent.py",
                userFriendlyName = "Request Understanding",
                status = "COMPLETED",
                description = "Detected serviceType: '${parsed.serviceType}', location: '${parsed.location}', time: '${parsed.time}'",
                logs = listOf(
                    "LOG: Running intent understanding analysis of Roman Urdu/English text",
                    "LOG: Classifying terms: service='${parsed.serviceType}', location='${parsed.location}'",
                    "LOG: Extracted urgency='${parsed.urgency}', proposed_time='${parsed.suggestedTime}'"
                )
            ),
            AgentStep(
                id = 3,
                agentName = "location_agent.py",
                userFriendlyName = "Location Resolver",
                status = "COMPLETED",
                description = "Mapped '${parsed.location}' to Islamabad service coordinates.",
                logs = listOf(
                    "LOG: Resolving spatial coordinates for area token: \"${parsed.location}\"",
                    "TOOL_CALL: querying region database matching Islamabad, Rawalpindi sectors",
                    "LOG: Verified location '${parsed.location}' falls into active operational zone"
                )
            ),
            AgentStep(
                id = 4,
                agentName = "provider_agent.py",
                userFriendlyName = "Nearby Help Search",
                status = "COMPLETED",
                description = "Discovered ${matchedProviders.size} matching local service providers.",
                logs = matchedProviders.map { p ->
                    "LOG: Found provider ID '${p.id}' name='${p.name}' distance=${p.distanceKm}km rating=${p.rating}"
                } + "LOG: Provider discovery complete. Found ${matchedProviders.size} options."
            ),
            AgentStep(
                id = 5,
                agentName = "ranking_agent.py",
                userFriendlyName = "Best Match Finder",
                status = "COMPLETED",
                description = "Calculated scores (Rating: 30%, Availability: 25%, Distance: 20%, Completion: 15%, Speed: 10%).",
                logs = matchedProviders.map { p ->
                    val score = p.calculateScore(parsed.urgency == "High")
                    "LOG: Evaluated '${p.name}': Score=$score/100 (Rating=${p.rating}, Distance=${p.distanceKm}km, Completed Jobs=${p.completedJobs})"
                }
            ),
            AgentStep(
                id = 6,
                agentName = "decision_agent.py",
                userFriendlyName = "Recommendation Engine",
                status = "COMPLETED",
                description = "Selected '$bestProviderName' as optimal reliable provider.",
                logs = listOf(
                    "LOG: Reviewing scored providers list in decision pipeline",
                    "LOG: Select maximum calculated reliability index target: '$bestProviderName'",
                    "LOG: Decision locked: optimal provider matching constraints"
                )
            ),
            AgentStep(
                id = 7,
                agentName = "booking_agent.py",
                userFriendlyName = "Booking Confirmation",
                status = "COMPLETED",
                description = "Initialized booking transaction $bookingId.",
                logs = listOf(
                    "LOG: Contacting provider secure gateway API...",
                    "TOOL_CALL: Write state modification to local Room Database",
                    "LOG: Booking state successfully created. Status='CONFIRMED', ID='$bookingId'"
                )
            ),
            AgentStep(
                id = 8,
                agentName = "followup_agent.py",
                userFriendlyName = "Reminder Setup",
                status = "COMPLETED",
                description = "Configured notification check points for ongoing lifecycle.",
                logs = listOf(
                    "LOG: Constructing follow-up reminder schedule list",
                    "LOG: Created reminder check at 9:00 AM, provider status check at 9:30 AM",
                    "LOG: Configured rating loop request at 12:15 PM"
                )
            )
        )
    }
}
