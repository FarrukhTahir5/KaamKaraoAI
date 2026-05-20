package com.example.ui.screens

import android.content.Context
import android.widget.Toast
import java.util.UUID
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.border
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.horizontalScroll
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.Dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.AppScreen
import com.example.MainUiState
import com.example.MainViewModel
import com.example.data.BookingEntity
import com.example.data.Provider
import com.example.service.AgentStep
import com.example.service.ParsedRequest
import kotlin.math.cos
import kotlin.math.sin

// Theme Colors
val MidnightBg = Color(0xFFFCF8F4)           // Warm light bone cream
val DeepSlateCard = Color(0xFFFFFFFF)         // Clean white for structured cards
val LightSlateCard = Color(0xFFE9E1D8)        // Warm beige for bubbles/secondary panels
val NeonIndigo = Color(0xFF5D6144)            // Forest sage green (Primary brand)
val NeonTeal = Color(0xFF818764)              // Medium sage green (Accent)
val StarGold = Color(0xFFD4A373)              // Warm ochre gold
val DangerRust = Color(0xFFBC5F4E)            // Warm organic brick/rust

@Composable
fun MainAppScreen(viewModel: MainViewModel) {
    val statePair by viewModel.uiState.collectAsState()
    val state = statePair.first
    val history = statePair.second

    Scaffold(
        topBar = { AppToolbar(state, viewModel) },
        containerColor = MidnightBg,
        contentWindowInsets = WindowInsets.safeDrawing
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(MidnightBg, Color(0xFFF1EFE7))
                    )
                )
        ) {
            AnimatedContent(
                targetState = state.currentScreen,
                transitionSpec = {
                    fadeIn(animationSpec = tween(300)) togetherWith fadeOut(animationSpec = tween(300))
                },
                label = "ScreenTransition"
            ) { targetScreen ->
                when (targetScreen) {
                    AppScreen.WELCOME -> WelcomeScreen(state, viewModel, history)
                    AppScreen.ASK_HOME -> AskScreen(state, viewModel)
                    AppScreen.CLARIFY -> ClarifyScreen(state, viewModel)
                    AppScreen.UNDERSTOOD -> UnderstoodScreen(state, viewModel)
                    AppScreen.MATCHES -> MatchesScreen(state, viewModel)
                    AppScreen.EXPLANATION -> ExplanationScreen(state, viewModel)
                    AppScreen.CONFIRMED -> ConfirmedScreen(state, viewModel)
                    AppScreen.FOLLOWUP -> FollowupScreen(state, viewModel)
                    AppScreen.HISTORY -> HistoryScreen(viewModel, history)
                    AppScreen.WORKFLOW -> WorkflowScreen(state, viewModel)
                    AppScreen.DIRECTORY -> ProviderDirectoryScreen(state, viewModel)
                    AppScreen.PROFILE -> UserProfileScreen(state, viewModel)
                    AppScreen.DEMO_SCENARIOS -> DemoScenariosScreen(state, viewModel)
                }
            }

            // Google Auth Account Chooser Dialog Overlay
            if (state.showGoogleSignInDialog) {
                GoogleSignInAccountChooserDialog(
                    onDismiss = { viewModel.toggleGoogleSignInDialog(false) },
                    onAccountChosen = { name, email ->
                        viewModel.signInWithGoogle(name, email, "")
                    }
                )
            }

            // Global Loader
            if (state.isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.65f))
                        .clickable(enabled = false) {},
                    contentAlignment = Alignment.Center
                ) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = DeepSlateCard),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .padding(24.dp)
                            .border(1.dp, NeonIndigo.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                    ) {
                        Column(
                            modifier = Modifier.padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            CircularProgressIndicator(color = NeonTeal)
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "KaamKarao AI Orbiting...",
                                color = Color(0xFF1C1B1F),
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "Analyzing intent, resolving nearby options...",
                                color = Color(0xFF79747E),
                                fontSize = 12.sp,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppToolbar(state: MainUiState, viewModel: MainViewModel) {
    CenterAlignedTopAppBar(
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(Brush.linearGradient(listOf(NeonIndigo, NeonTeal))),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Build,
                        contentDescription = "Kaam",
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "KaamKarao",
                    color = Color(0xFF1C1B1F),
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp,
                    fontFamily = FontFamily.SansSerif
                )
                Text(
                    text = " AI",
                    color = NeonIndigo,
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp
                )
            }
        },
        navigationIcon = {
            if (state.currentScreen != AppScreen.WELCOME) {
                IconButton(onClick = {
                    when (state.currentScreen) {
                        AppScreen.ASK_HOME -> viewModel.navigateTo(AppScreen.WELCOME)
                        AppScreen.CLARIFY -> viewModel.navigateTo(AppScreen.ASK_HOME)
                        AppScreen.UNDERSTOOD -> viewModel.navigateTo(AppScreen.ASK_HOME)
                        AppScreen.MATCHES -> viewModel.navigateTo(AppScreen.UNDERSTOOD)
                        AppScreen.EXPLANATION -> viewModel.navigateTo(AppScreen.MATCHES)
                        AppScreen.CONFIRMED -> viewModel.navigateTo(AppScreen.ASK_HOME)
                        AppScreen.FOLLOWUP -> viewModel.navigateTo(AppScreen.CONFIRMED)
                        AppScreen.HISTORY -> viewModel.navigateTo(AppScreen.WELCOME)
                        AppScreen.DIRECTORY -> viewModel.navigateTo(AppScreen.WELCOME)
                        AppScreen.PROFILE -> viewModel.navigateTo(AppScreen.WELCOME)
                        AppScreen.DEMO_SCENARIOS -> viewModel.navigateTo(AppScreen.ASK_HOME)
                        AppScreen.WORKFLOW -> {
                            val active = state.activeBooking
                            if (active != null) {
                                viewModel.navigateTo(AppScreen.CONFIRMED)
                            } else {
                                viewModel.navigateTo(AppScreen.ASK_HOME)
                            }
                        }
                        else -> viewModel.navigateTo(AppScreen.WELCOME)
                    }
                }) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = Color(0xFF1C1B1F)
                    )
                }
            }
        },
        actions = {
            // Providers Directory Discovery Button
            IconButton(
                onClick = {
                    if (state.isLoggedIn) {
                        viewModel.navigateTo(AppScreen.DIRECTORY)
                    } else {
                        viewModel.toggleGoogleSignInDialog(true, AppScreen.DIRECTORY)
                    }
                },
                modifier = Modifier.testTag("directory_shortcut_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Providers Grid",
                    tint = Color(0xFF1C1B1F)
                )
            }
            // Booking History Button
            IconButton(
                onClick = { viewModel.navigateTo(AppScreen.HISTORY) },
                modifier = Modifier.testTag("history_shortcut_button")
            ) {
                Icon(
                    imageVector = Icons.Default.List,
                    contentDescription = "Booking History",
                    tint = Color(0xFF1C1B1F)
                )
            }
            // Google Auth Status or profile details button
            IconButton(
                onClick = {
                    if (state.isLoggedIn) {
                        viewModel.navigateTo(AppScreen.PROFILE)
                    } else {
                        viewModel.toggleGoogleSignInDialog(true, AppScreen.PROFILE)
                    }
                },
                modifier = Modifier.testTag("google_auth_or_profile_button")
            ) {
                if (state.isLoggedIn) {
                    Box(
                        modifier = Modifier
                            .size(30.dp)
                            .clip(CircleShape)
                            .background(NeonIndigo.copy(alpha = 0.15f))
                            .border(1.5.dp, NeonIndigo, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        val initials = if (state.userName.isNotEmpty()) state.userName.take(2).uppercase() else "U"
                        Text(
                            text = initials.take(1),
                            color = NeonIndigo,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                } else {
                    Icon(
                        imageVector = Icons.Default.AccountCircle,
                        contentDescription = "Google Sign In",
                        tint = NeonIndigo
                    )
                }
            }
        },
        colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
            containerColor = MidnightBg,
            titleContentColor = Color(0xFF1C1B1F)
        )
    )
}

// ---------------- SCREENS ----------------

@Composable
fun WelcomeScreen(state: MainUiState, viewModel: MainViewModel, history: List<BookingEntity>) {
    var orbScale by remember { mutableStateOf(1f) }
    val infiniteTransition = rememberInfiniteTransition(label = "orb_pulse")
    val scaleAnim by infiniteTransition.animateFloat(
        initialValue = 0.92f,
        targetValue = 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Large Decorative Orb Area
        Box(
            modifier = Modifier
                .size(240.dp)
                .drawBehind {
                    drawCircle(
                        Brush.radialGradient(
                            colors = listOf(NeonIndigo.copy(alpha = 0.45f), Color.Transparent),
                            radius = size.width / 1.5f * scaleAnim
                        )
                    )
                },
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(NeonIndigo, NeonTeal)
                        )
                    )
                    .border(2.dp, Color.White.copy(alpha = 0.2f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = "Orb Logo",
                    tint = Color.White,
                    modifier = Modifier.size(64.dp)
                )
            }
        }

        // Title and Subtitles
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "KaamKarao AI",
                color = Color(0xFF1C1B1F),
                fontWeight = FontWeight.Black,
                fontSize = 32.sp,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Bas kaam batao, AI banda dhoond dega.",
                color = NeonIndigo,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Book trusted informal service workers across Islamabad using Urdu, Roman Urdu, or English queries.",
                color = Color(0xFF79747E),
                fontSize = 14.sp,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }

        // Controls Grid at list
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Button(
                onClick = { viewModel.navigateTo(AppScreen.ASK_HOME) },
                colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
                    .testTag("get_started_button")
            ) {
                Text(
                    text = "Get Started",
                    fontWeight = FontWeight.Bold,
                    fontSize = 17.sp,
                    color = Color.White
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Beautiful Explore Providers Directory (Matches styling in the requested grid)
            Button(
                onClick = {
                    if (state.isLoggedIn) {
                        viewModel.navigateTo(AppScreen.DIRECTORY)
                    } else {
                        viewModel.toggleGoogleSignInDialog(true, AppScreen.DIRECTORY)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE3F2FD)), // beautiful light baby-blue container
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Color(0xFF90CAF9).copy(alpha = 0.6f)),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
                    .testTag("welcome_explore_directory_button")
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search Grid",
                        tint = Color(0xFF1E88E5)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Explore Providers Grid",
                        color = Color(0xFF1565C0),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
            }

            if (!state.isLoggedIn) {
                Spacer(modifier = Modifier.height(10.dp))
                // Google branded "Sign in with Google" Button
                Button(
                    onClick = { viewModel.toggleGoogleSignInDialog(true, AppScreen.WELCOME) },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Color(0xFFDADCE0)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("welcome_google_sign_in")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        GoogleLogoIcon()
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Sign in with Google",
                            color = Color(0xFF3C4043),
                            fontWeight = FontWeight.Medium,
                            fontSize = 14.sp
                        )
                    }
                }
            } else {
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(NeonIndigo.copy(alpha = 0.08f))
                        .clickable { viewModel.navigateTo(AppScreen.PROFILE) }
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(NeonIndigo.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        val firstChar = if (state.userName.isNotEmpty()) state.userName.take(1).uppercase() else "F"
                        Text(firstChar, color = NeonIndigo, fontWeight = FontWeight.Black, fontSize = 14.sp)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Logged in as ${state.userName}",
                            color = Color(0xFF1C1B1F),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = state.userEmail,
                            color = Color(0xFF79747E),
                            fontSize = 11.sp
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = "View Profile",
                        tint = NeonIndigo,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            if (history.isNotEmpty()) {
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedButton(
                    onClick = { viewModel.navigateTo(AppScreen.HISTORY) },
                    shape = RoundedCornerShape(12.dp),
                    border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp, brush = SolidColor(NeonTeal.copy(alpha = 0.5f))),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null, tint = NeonTeal)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "View Bookings (${history.size})",
                        color = NeonTeal,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun AskScreen(state: MainUiState, viewModel: MainViewModel) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .navigationBarsPadding()
            .imePadding()
            .verticalScroll(scrollState)
            .padding(24.dp)
    ) {
        Text(
            text = "What is your service need?",
            color = Color(0xFF1C1B1F),
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Just tell us casually. We'll handle understanding, matching, and booking.",
            color = Color(0xFF79747E),
            fontSize = 14.sp
        )

        Spacer(modifier = Modifier.height(10.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(NeonIndigo.copy(alpha = 0.08f))
                .border(BorderStroke(1.dp, NeonIndigo.copy(alpha = 0.2f)), RoundedCornerShape(8.dp))
                .clickable { viewModel.navigateTo(AppScreen.DEMO_SCENARIOS) }
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = "Demo Scenarios",
                    tint = NeonIndigo,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Try a pre-guided Roman Urdu scenario?",
                    color = NeonIndigo,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Text(
                text = "Open Presets Lab 🚀",
                color = NeonIndigo,
                fontWeight = FontWeight.Bold,
                fontSize = 11.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Input Terminal box representation - Optimized height for great mobile usability!
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(130.dp)
                .background(DeepSlateCard, RoundedCornerShape(16.dp))
                .border(
                    width = 1.dp,
                    color = if (state.isRecordingVoice) NeonIndigo else Color(0xFFE9E1D8),
                    shape = RoundedCornerShape(16.dp)
                )
                .padding(16.dp)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                Box(modifier = Modifier.weight(1f)) {
                    if (state.isRecordingVoice) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                "🔴 Listening to Voice note...",
                                color = DangerRust,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            
                            // Glowing Audio Logo waveform pulse representation
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                repeat(7) { index ->
                                    val height = when (index) {
                                        0 -> 12.dp
                                        1 -> 24.dp
                                        2 -> 40.dp
                                        3 -> 18.dp
                                        4 -> 35.dp
                                        5 -> 22.dp
                                        6 -> 10.dp
                                        else -> 12.dp
                                    }
                                    Box(
                                        modifier = Modifier
                                            .width(4.dp)
                                            .height(height)
                                            .clip(CircleShape)
                                            .background(NeonIndigo)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                "00:0${state.voiceSeconds} / 00:03",
                                color = Color(0xFF1C1B1F),
                                fontFamily = FontFamily.Monospace,
                                fontSize = 18.sp
                            )
                        }
                    } else if (state.isUploadingPhoto) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            CircularProgressIndicator(color = NeonTeal)
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                "Scanning issue picture via computer vision...",
                                color = NeonTeal,
                                fontSize = 14.sp,
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        TextField(
                            value = state.inputQuery,
                            onValueChange = { viewModel.updateInputQuery(it) },
                            placeholder = {
                                Text(
                                    text = "e.g., Mujhe kal subah G-13 mein AC technician chahiye...",
                                    color = Color(0xFF79747E),
                                    fontSize = 15.sp
                                )
                            },
                            modifier = Modifier
                                .fillMaxSize()
                                .testTag("search_text_input"),
                            colors = TextFieldDefaults.colors(
                                focusedContainerColor = Color.Transparent,
                                unfocusedContainerColor = Color.Transparent,
                                disabledContainerColor = Color.Transparent,
                                focusedIndicatorColor = Color.Transparent,
                                unfocusedIndicatorColor = Color.Transparent,
                                focusedTextColor = Color(0xFF1C1B1F),
                                unfocusedTextColor = Color(0xFF1C1B1F)
                            ),
                            textStyle = TextStyle(fontSize = 16.sp, lineHeight = 22.sp)
                        )
                    }
                }

                // Branded Audio Logo / Voice Simulation Button (Pulsing Mic and Waveform Design)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Custom Audio Logo Trigger Button
                    Surface(
                        onClick = { viewModel.startVoiceSimulation() },
                        color = NeonIndigo.copy(alpha = 0.12f),
                        shape = RoundedCornerShape(24.dp),
                        border = BorderStroke(1.dp, NeonIndigo.copy(alpha = 0.4f)),
                        modifier = Modifier
                            .height(44.dp)
                            .testTag("audio_logo_trigger")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                        ) {
                            // Pulsing / glowing microphone icon symbol as an audio brand logo
                            MicAudioIcon(
                                color = NeonIndigo,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "KaamVoice",
                                color = NeonIndigo,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            // Small decorative static soundwave bars to represent a professional visual audio logo
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(modifier = Modifier.width(3.dp).height(10.dp).clip(CircleShape).background(NeonIndigo))
                                Box(modifier = Modifier.width(3.dp).height(18.dp).clip(CircleShape).background(NeonIndigo.copy(alpha = 0.8f)))
                                Box(modifier = Modifier.width(3.dp).height(14.dp).clip(CircleShape).background(NeonIndigo))
                                Box(modifier = Modifier.width(3.dp).height(6.dp).clip(CircleShape).background(NeonIndigo.copy(alpha = 0.6f)))
                            }
                        }
                    }

                    Button(
                        onClick = { viewModel.submitQuery(state.inputQuery) },
                        colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.testTag("find_help_button")
                    ) {
                        Text("Find Help", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Demo Presets Title
        Text(
            text = "Try Demo Scenarios:",
            color = Color(0xFF79747E),
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(12.dp))

        // Static layout of demo presets to avoid nested lazy scrolling inside scrollable column
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            PresetItemCard(
                title = "Main Scenario (AC Repair Roman Urdu)",
                subtitle = "Mujhe kal subah G-13 mein AC technician chahiye",
                color = NeonIndigo,
                onClick = { viewModel.selectPreset("Mujhe kal subah G-13 mein AC technician chahiye") }
            )
            PresetItemCard(
                title = "Emergency Spark (Electrician Urgent)",
                subtitle = "Aaj electrician chahiye socket spark kar raha hai G-13 mein",
                color = DangerRust,
                onClick = { viewModel.selectPreset("Aaj electrician chahiye socket spark kar raha hai G-13 mein") }
            )
            PresetItemCard(
                title = "Clarification Hook (Plumbing No Region)",
                subtitle = "Mujhe urgent plumber chahiye",
                color = NeonTeal,
                onClick = { viewModel.selectPreset("Mujhe urgent plumber chahiye") }
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Providers Grid Area
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Providers Grid 👥",
                color = Color(0xFF1C1B1F),
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
            if (state.isLoggedIn) {
                Text(
                    text = "See Full Grid ↗",
                    color = Color(0xFF1565C0),
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    modifier = Modifier.clickable { viewModel.navigateTo(AppScreen.DIRECTORY) }
                )
            }
        }
        Spacer(modifier = Modifier.height(10.dp))

        if (!state.isLoggedIn) {
            // High fidelity locked card to encourage logging in to view the live grid
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE3F2FD).copy(alpha = 0.5f)),
                border = BorderStroke(1.dp, Color(0xFF90CAF9).copy(alpha = 0.4f)),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { viewModel.toggleGoogleSignInDialog(true, AppScreen.ASK_HOME) }
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Lock",
                        tint = Color(0xFF1565C0),
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Sign in with Google to view live Experts Grid",
                        color = Color(0xFF0D47A1),
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(3.dp))
                    Text(
                        text = "Access interactive tiles of Islamabad's verified carpenters, AC technicians, plumbers, and mechanics after logging in.",
                        color = Color(0xFF1565C0).copy(alpha = 0.75f),
                        fontSize = 11.sp,
                        textAlign = TextAlign.Center,
                        lineHeight = 15.sp
                    )
                }
            }
        } else {
            // Interactive 4-column baby blue responsive grid of real experts!
            val providersList = com.example.data.ProviderMarketplace.providers.take(8)
            val rows = providersList.chunked(4)

            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                rows.forEach { rowProviders ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        rowProviders.forEach { provider ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .aspectRatio(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color(0xFFE3F2FD)) // beautiful light baby-blue
                                    .border(1.dp, Color(0xFFBBDEFB).copy(alpha = 0.6f), RoundedCornerShape(12.dp))
                                    .clickable {
                                        viewModel.updateInputQuery("Book ${provider.name} for ${provider.serviceType}")
                                    }
                                    .padding(4.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Center
                                ) {
                                    ProviderAvatar(provider = provider, size = 36.dp)
                                    Spacer(modifier = Modifier.height(5.dp))
                                    Text(
                                        text = provider.handle,
                                        color = Color(0xFF0D47A1),
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 10.sp,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis,
                                        textAlign = TextAlign.Center
                                    )
                                    Text(
                                        text = provider.serviceType.split(" ").firstOrNull() ?: "",
                                        color = Color(0xFF546E7A),
                                        fontSize = 8.sp,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }
                            }
                        }
                        if (rowProviders.size < 4) {
                            repeat(4 - rowProviders.size) {
                                Spacer(modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PresetItemCard(title: String, subtitle: String, color: Color, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = DeepSlateCard),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(color)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, color = Color(0xFF1C1B1F), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Text(
                    subtitle,
                    color = Color(0xFF49454F),
                    fontSize = 13.sp,
                    overflow = TextOverflow.Ellipsis,
                    maxLines = 1
                )
            }
            Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Color(0xFF79747E), modifier = Modifier.size(16.dp))
        }
    }
}

@Composable
fun ClarifyScreen(state: MainUiState, viewModel: MainViewModel) {
    var selectedSector by remember { mutableStateOf("G-13") }
    var selectedTimeSlot by remember { mutableStateOf("Tomorrow") }

    val sectorOptions = listOf("G-13", "G-11", "F-11", "Bahria Town", "DHA", "I-8")
    val timeOptions = listOf("Today (Urgent)", "Tomorrow", "Next Available")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Info, contentDescription = null, tint = NeonIndigo, modifier = Modifier.size(28.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = "Smart Clarification Mode 💬",
                color = Color(0xFF1C1B1F),
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Your request is received but missing vital details to identify local providers accurately. Please specify:",
            color = Color(0xFF49454F),
            fontSize = 15.sp,
            lineHeight = 22.sp
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Sector selector
        Text("Which sector/area do you live in?", color = Color(0xFF1C1B1F), fontWeight = FontWeight.Bold, fontSize = 15.sp)
        Spacer(modifier = Modifier.height(8.dp))
        FlowGridSelector(
            options = sectorOptions,
            selected = selectedSector,
            onSelected = { selectedSector = it }
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Timing selector
        Text("When is the worker expected?", color = Color(0xFF1C1B1F), fontWeight = FontWeight.Bold, fontSize = 15.sp)
        Spacer(modifier = Modifier.height(8.dp))
        FlowGridSelector(
            options = timeOptions,
            selected = selectedTimeSlot,
            onSelected = { selectedTimeSlot = it }
        )

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = {
                val timeVal = if (selectedTimeSlot.contains("Today")) "Now" else "Tomorrow"
                viewModel.submitClarification(selectedSector, timeVal)
            },
            colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp)
        ) {
            Text("Resolve Intent & Continue", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
    }
}

@Composable
fun FlowGridSelector(options: List<String>, selected: String, onSelected: (String) -> Unit) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            options.take(3).forEach { option ->
                val isSelected = selected == option
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) NeonIndigo else DeepSlateCard)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) Color.Transparent else Color(0xFFE9E1D8),
                            shape = RoundedCornerShape(8.dp)
                        )
                        .clickable { onSelected(option) }
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = option,
                        color = if (isSelected) Color.White else Color(0xFF1C1B1F),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
        if (options.size > 3) {
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                options.drop(3).forEach { option ->
                    val isSelected = selected == option
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) NeonIndigo else DeepSlateCard)
                            .border(
                                width = 1.dp,
                                color = if (isSelected) Color.Transparent else Color(0xFFE9E1D8),
                                shape = RoundedCornerShape(8.dp)
                            )
                            .clickable { onSelected(option) }
                            .padding(14.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = option,
                            color = if (isSelected) Color.White else Color(0xFF1C1B1F),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun UnderstoodScreen(state: MainUiState, viewModel: MainViewModel) {
    val req = state.parsedRequest ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                "Got it — here's what I understood.",
                color = Color(0xFF1C1B1F),
                fontWeight = FontWeight.Bold,
                fontSize = 24.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "I extracted structured parameters successfully.",
                color = Color(0xFF79747E),
                fontSize = 14.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Large Understood Dashboard Card
            Card(
                colors = CardDefaults.cardColors(containerColor = DeepSlateCard),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        1.dp,
                        if (req.urgency == "High") DangerRust.copy(alpha = 0.5f) else NeonIndigo.copy(alpha = 0.3f),
                        RoundedCornerShape(16.dp)
                    )
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "INTENT CONFIDENCE",
                            color = Color(0xFF79747E),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(if (req.isGeminiResolved) NeonTeal.copy(0.2f) else Color(0xFFE9E1D8))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                if (req.isGeminiResolved) "Gemini v3.5-flash" else "Hybrid NLP Engine",
                                color = if (req.isGeminiResolved) NeonIndigo else Color(0xFF1C1B1F),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    UnderstoodEntryRow(
                        label = "Service",
                        value = req.serviceType,
                        icon = Icons.Default.Build
                    )
                    HorizontalDivider(color = Color(0xFFE9E1D8), modifier = Modifier.padding(vertical = 12.dp))
                    UnderstoodEntryRow(
                        label = "Sector Area",
                        value = req.location,
                        icon = Icons.Default.LocationOn
                    )
                    HorizontalDivider(color = Color(0xFFE9E1D8), modifier = Modifier.padding(vertical = 12.dp))
                    UnderstoodEntryRow(
                        label = "Requested Slot",
                        value = req.time,
                        icon = Icons.Default.DateRange
                    )
                    HorizontalDivider(color = Color(0xFFE9E1D8), modifier = Modifier.padding(vertical = 12.dp))
                    UnderstoodEntryRow(
                        label = "Suggested Slot",
                        value = req.suggestedTime,
                        icon = Icons.Default.CheckCircle
                    )
                    HorizontalDivider(color = Color(0xFFE9E1D8), modifier = Modifier.padding(vertical = 12.dp))
                    UnderstoodEntryRow(
                        label = "Urgency Level",
                        value = req.urgency,
                        icon = Icons.Default.Warning,
                        color = if (req.urgency == "High") DangerRust else NeonIndigo
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Small Behind the Scenes Link
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { viewModel.navigateTo(AppScreen.WORKFLOW) }
                    .padding(12.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Share, contentDescription = null, tint = NeonIndigo, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        "Behind the Scenes: See How AI Parsed This",
                        color = NeonIndigo,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                }
            }
        }

        // Action Steppers
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = { viewModel.navigateTo(AppScreen.ASK_HOME) },
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .weight(0.4f)
                    .height(54.dp),
                border = BorderStroke(1.dp, Color(0xFFE9E1D8))
            ) {
                Text("Edit", color = NeonIndigo)
            }

            Button(
                onClick = { viewModel.navigateTo(AppScreen.MATCHES) },
                colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .weight(0.6f)
                    .height(54.dp)
                    .testTag("looks_good_button")
            ) {
                Text("Looks Good", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}

@Composable
fun UnderstoodEntryRow(label: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color = Color(0xFF1C1B1F)) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, contentDescription = null, tint = NeonIndigo, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text(label, color = Color(0xFF79747E), fontSize = 14.sp)
        }
        Text(value, color = color, fontSize = 15.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun ProviderAvatar(provider: Provider, size: Dp = 44.dp) {
    if (provider.avatarDrawable != null) {
        Image(
            painter = painterResource(id = provider.avatarDrawable),
            contentDescription = provider.name,
            modifier = Modifier
                .size(size)
                .clip(CircleShape)
                .border(2.dp, NeonIndigo, CircleShape),
            contentScale = ContentScale.Crop
        )
    } else {
        val initials = provider.name.split(" ").take(2).map { it.firstOrNull()?.toString() ?: "" }.joinToString("").uppercase()
        Box(
            modifier = Modifier
                .size(size)
                .clip(CircleShape)
                .background(NeonIndigo.copy(alpha = 0.15f))
                .border(1.dp, NeonIndigo.copy(alpha = 0.3f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = initials,
                color = NeonIndigo,
                fontWeight = FontWeight.Bold,
                fontSize = if (size < 40.dp) 11.sp else 14.sp
            )
        }
    }
}

@Composable
fun MicAudioIcon(color: Color, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier.size(20.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height
            // Draw mic central capsule
            drawRoundRect(
                color = color,
                topLeft = Offset(w * 0.35f, h * 0.15f),
                size = androidx.compose.ui.geometry.Size(w * 0.3f, h * 0.5f),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(w * 0.12f, w * 0.12f)
            )
            // Draw mic outer stand cup
            drawArc(
                color = color,
                startAngle = 0f,
                sweepAngle = 180f,
                useCenter = false,
                topLeft = Offset(w * 0.2f, h * 0.3f),
                size = androidx.compose.ui.geometry.Size(w * 0.6f, h * 0.45f),
                style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round)
            )
            // Draw mic stand stem
            drawLine(
                color = color,
                start = Offset(w * 0.5f, h * 0.75f),
                end = Offset(w * 0.5f, h * 0.9f),
                strokeWidth = 2.dp.toPx(),
                cap = StrokeCap.Round
            )
            // Draw mic base bar
            drawLine(
                color = color,
                start = Offset(w * 0.3f, h * 0.9f),
                end = Offset(w * 0.7f, h * 0.9f),
                strokeWidth = 2.dp.toPx(),
                cap = StrokeCap.Round
            )
        }
    }
}

@Composable
fun MatchesScreen(state: MainUiState, viewModel: MainViewModel) {
    val req = state.parsedRequest ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Text(
            "I found ${state.matchedProviders.size} good options near you.",
            color = Color(0xFF1C1B1F),
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            "Searching providers within coordinates of G-13 Islamabad.",
            color = Color(0xFF79747E),
            fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Awesome Provider Radar Visualization! (Sweep animation Canvas)
        ProviderRadarSweep()

        Spacer(modifier = Modifier.height(16.dp))

        // Matched cards
        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(state.matchedProviders) { provider ->
                val isBest = provider.id == state.matchedProviders.firstOrNull()?.id
                val score = provider.calculateScore(req.urgency == "High")

                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (isBest) Color.White else Color(0xFFF1EFE7)
                    ),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { viewModel.selectAlternativeProvider(provider) }
                        .border(
                            width = if (isBest) 1.5.dp else 1.dp,
                            color = if (isBest) NeonIndigo else Color(0xFFE9E1D8),
                            shape = RoundedCornerShape(16.dp)
                        )
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            ProviderAvatar(provider, size = 48.dp)
                            Spacer(modifier = Modifier.width(12.dp))
                            Row(
                                modifier = Modifier.weight(1f),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    if (isBest) {
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(4.dp))
                                                .background(NeonIndigo)
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Text("BEST MATCH", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Black)
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                    }
                                    Text(provider.name, color = Color(0xFF1C1B1F), fontSize = 16.sp, fontWeight = FontWeight.Bold)
                                }

                                // Reliability Score
                                Column(horizontalAlignment = Alignment.End) {
                                    Text("RELIABILITY", color = Color(0xFF79747E), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    Text("$score/100", color = NeonIndigo, fontSize = 16.sp, fontWeight = FontWeight.Black)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Star, contentDescription = null, tint = StarGold, modifier = Modifier.size(16.dp))
                                Text(" ${provider.rating}", color = Color(0xFF1C1B1F), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.width(12.dp))
                                Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color(0xFF79747E), modifier = Modifier.size(16.dp))
                                Text(" ${provider.distanceKm} km away", color = Color(0xFF49454F), fontSize = 13.sp)
                            }
                            Text(provider.estimatedCharges, color = Color(0xFF1C1B1F), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }

                        if (isBest) {
                            Spacer(modifier = Modifier.height(12.dp))
                            HorizontalDivider(color = Color(0xFFE9E1D8))
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(NeonIndigo)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Why Ali? Closest provider, Available in requested slot, Highly rated.",
                                    color = Color(0xFF49454F),
                                    fontSize = 11.sp,
                                    lineHeight = 16.sp
                                )
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                val best = state.matchedProviders.firstOrNull()
                if (best != null) {
                    viewModel.selectAlternativeProvider(best)
                }
            },
            colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp)
                .testTag("continue_to_explanation_button")
        ) {
            Text("Continue with ${state.selectedProvider?.name ?: "Best Match"}", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
    }
}

@Composable
fun ProviderRadarSweep() {
    val infiniteTransition = rememberInfiniteTransition(label = "RadarSweep")
    val angleSweep by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "SweepAngle"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(DeepSlateCard.copy(alpha = 0.5f))
            .border(1.dp, Color.White.copy(alpha = 0.05f), RoundedCornerShape(12.dp)),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize().padding(12.dp)) {
            val cx = size.width / 2
            val cy = size.height / 2
            val rMax = Math.min(cx, cy)

            // Draw concentric rings
            drawCircle(color = NeonIndigo.copy(0.08f), radius = rMax, style = Stroke(1.dp.toPx()))
            drawCircle(color = NeonIndigo.copy(0.15f), radius = rMax * 0.6f, style = Stroke(1.dp.toPx()))
            drawCircle(color = NeonIndigo.copy(0.25f), radius = rMax * 0.2f, style = Stroke(1.dp.toPx()))

            // Crosshairs
            drawLine(
                color = Color.White.copy(0.08f),
                start = Offset(cx - rMax, cy),
                end = Offset(cx + rMax, cy),
                strokeWidth = 1f
            )
            drawLine(
                color = Color.White.copy(0.08f),
                start = Offset(cx, cy - rMax),
                end = Offset(cx, cy + rMax),
                strokeWidth = 1f
            )

            // Draw rotating sweep line
            val rad = Math.toRadians(angleSweep.toDouble())
            val sx = cx + rMax * cos(rad).toFloat()
            val sy = cy + rMax * sin(rad).toFloat()

            drawLine(
                color = NeonTeal.copy(0.5f),
                start = Offset(cx, cy),
                end = Offset(sx, sy),
                strokeWidth = 2.dp.toPx()
            )

            // Draw custom floating sensor dots representing Ali and Umar!
            drawCircle(color = NeonTeal, radius = 5.dp.toPx(), center = Offset(cx - rMax * 0.4f, cy + rMax * 0.3f))
            drawCircle(color = NeonIndigo, radius = 4.dp.toPx(), center = Offset(cx + rMax * 0.7f, cy - rMax * 0.5f))
            drawCircle(color = DangerRust, radius = 3.dp.toPx(), center = Offset(cx + rMax * 0.2f, cy + rMax * 0.6f))
        }

        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Radar Map: Islamabad Sector Perimeter", color = Color.Gray, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Text("SCANNING ACTIVE", color = NeonTeal, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun ExplanationScreen(state: MainUiState, viewModel: MainViewModel) {
    val provider = state.selectedProvider ?: return
    val backup = state.backupProvider
    val req = state.parsedRequest ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                ProviderAvatar(provider, size = 64.dp)
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        "Why ${provider.name}?",
                        color = Color(0xFF1C1B1F),
                        fontWeight = FontWeight.Bold,
                        fontSize = 22.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "Credibility & Trust profile details of chosen provider.",
                        color = Color(0xFF79747E),
                        fontSize = 13.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // User Trust Profile Dashboard (Trust Passport)
            Card(
                colors = CardDefaults.cardColors(containerColor = DeepSlateCard),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, NeonIndigo.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        "${provider.name.uppercase()} TRUST PASSPORT",
                        color = NeonIndigo,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    TrustFeatureRow(title = "Distance", value = "${provider.distanceKm} km (Closest available)")
                    TrustFeatureRow(title = "Jobs Completed", value = "${provider.completedJobs} successful bookings")
                    TrustFeatureRow(title = "Job Completion Rate", value = "${provider.completionRate}% (Extremely high)")
                    TrustFeatureRow(title = "Average Response Time", value = "${provider.responseTimeMin} mins")
                    TrustFeatureRow(title = "Repeat Customers Rate", value = "${provider.repeatCustomerRate}%")
                    TrustFeatureRow(title = "Verification Status", value = "Verified Category Professional ✔")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Comparisons section
            Text("Market Comparison Summary:", color = Color(0xFF1C1B1F), fontWeight = FontWeight.Bold, fontSize = 15.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(LightSlateCard, RoundedCornerShape(12.dp))
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "• ${provider.name} represents the optimal balance of rating (${provider.rating}) and immediate sector proximity.",
                    color = Color(0xFF1C1B1F),
                    fontSize = 12.sp,
                    lineHeight = 18.sp
                )
                if (backup != null) {
                    Text(
                        text = "• Alternative option '${backup.name}' is available but slightly farther (${backup.distanceKm} km away).",
                        color = Color(0xFF49454F),
                        fontSize = 12.sp,
                        lineHeight = 18.sp
                    )
                }
            }
        }

        // Book Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = { viewModel.navigateTo(AppScreen.MATCHES) },
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .weight(0.4f)
                    .height(54.dp),
                border = BorderStroke(1.dp, Color(0xFFE9E1D8))
            ) {
                Text("See Others", color = NeonIndigo)
            }

            Button(
                onClick = { viewModel.confirmAndBook() },
                colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .weight(0.6f)
                    .height(54.dp)
                    .testTag("book_button")
            ) {
                Text("Book ${provider.name}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
            }
        }
    }
}

@Composable
fun TrustFeatureRow(title: String, value: String) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(title, color = Color(0xFF49454F), fontSize = 13.sp)
            Text(value, color = Color(0xFF1C1B1F), fontSize = 13.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(4.dp))
        HorizontalDivider(color = Color(0xFFE9E1D8))
    }
}

@Composable
fun ConfirmedScreen(state: MainUiState, viewModel: MainViewModel) {
    val active = state.activeBooking ?: return
    val context = LocalContext.current
    val clipboard = LocalClipboardManager.current

    // WhatsApp text content format
    val whatsappMessage = """
        Booking Confirmed ✅
        
        ${active.providerName} will visit tomorrow at 10:00 AM for ${active.serviceType} in ${active.location}.
        
        Booking ID: ${active.bookingId}
        Estimated charges: ${active.estimatedCharges}
        
        A reminder is scheduled 1 hour before.
    """.trimIndent()

    val provider = com.example.data.ProviderMarketplace.providers.firstOrNull { it.name == active.providerName }
        ?: Provider(id = "temp", name = active.providerName, serviceType = active.serviceType, areas = emptyList(), rating = 4.8, distanceKm = 1.0, availableSlots = emptyList(), completionRate = 98, responseTimeMin = 5, estimatedCharges = active.estimatedCharges, emergencyAvailable = active.isEmergency, completedJobs = 100, repeatCustomerRate = 50)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        LazyColumn(
            modifier = Modifier.weight(1f),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Box(
                    modifier = Modifier.size(90.dp),
                    contentAlignment = Alignment.Center
                ) {
                    ProviderAvatar(provider, size = 80.dp)
                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .align(Alignment.BottomEnd)
                            .clip(CircleShape)
                            .background(Color.White)
                            .padding(2.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = "Confirmed",
                            tint = NeonIndigo,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Booking Confirmed ✅",
                    color = Color(0xFF1C1B1F),
                    fontWeight = FontWeight.Black,
                    fontSize = 24.sp
                )
                Text(
                    text = "${active.providerName} has accepted your booking requirement.",
                    color = Color(0xFF79747E),
                    fontSize = 13.sp
                )
            }

            // High Fidelity Receipt UI
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = DeepSlateCard),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, NeonIndigo.copy(0.2f), RoundedCornerShape(16.dp))
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("BOOKING RECEIPT", color = Color(0xFF79747E), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text(active.bookingId, color = NeonIndigo, fontSize = 12.sp, fontWeight = FontWeight.Black)
                        }

                        HorizontalDivider(color = Color(0xFFE9E1D8), modifier = Modifier.padding(vertical = 12.dp))

                        ReceiptField("Service Required", active.serviceType)
                        ReceiptField("Assigned Worker", active.providerName)
                        ReceiptField("Reserved Time", active.slot)
                        ReceiptField("Region Sector", active.location)
                        ReceiptField("Visits Cost Est.", active.estimatedCharges)
                        ReceiptField("Booking Token", UUID.randomUUID().toString().take(8).uppercase())

                        HorizontalDivider(color = Color(0xFFE9E1D8), modifier = Modifier.padding(vertical = 12.dp))

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(LightSlateCard, RoundedCornerShape(8.dp))
                                .padding(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(NeonIndigo))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    "Safe Guarantee: Rates verify Islamabad regulations.",
                                    color = Color(0xFF49454F),
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }
                }
            }

            // WhatsApp Message Box
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = LightSlateCard),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("WHATSAPP CONFIRMATION PREVIEW", color = NeonIndigo, fontSize = 10.sp, fontWeight = FontWeight.Black)
                            IconButton(onClick = {
                                clipboard.setText(AnnotatedString(whatsappMessage))
                                Toast.makeText(context, "Copied Message!", Toast.LENGTH_SHORT).show()
                            }) {
                                Icon(Icons.Default.Menu, contentDescription = "Copy message", tint = NeonIndigo, modifier = Modifier.size(20.dp))
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = whatsappMessage,
                            color = Color(0xFF1C1B1F),
                            fontSize = 12.sp,
                            lineHeight = 18.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }

            // Real-time Service Status Tracking Panel (Wow Factor 11)
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = DeepSlateCard),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("LIVE STATUS WATCH", color = Color(0xFF1C1B1F), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Button(
                                onClick = { viewModel.progressActiveBookingStatus() },
                                colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
                                shape = RoundedCornerShape(6.dp),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                                modifier = Modifier.height(28.dp)
                            ) {
                                Text("Simulate Next Status 🔄", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Progress Dots line
                        LiveProgressTracker(active.status)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Actions navigation
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { viewModel.navigateTo(AppScreen.FOLLOWUP) },
                    colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp)
                ) {
                    Text("View Follow-up Timeline", fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = { viewModel.navigateTo(AppScreen.WORKFLOW) },
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp),
                    border = BorderStroke(1.dp, Color(0xFFE9E1D8))
                ) {
                    Text("View AI Workflow ⚙", color = NeonIndigo, fontWeight = FontWeight.Bold)
                }
            }

            Button(
                onClick = { viewModel.navigateTo(AppScreen.ASK_HOME) },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE9E1D8)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Text("Book Another Service", color = Color(0xFF1C1B1F))
            }
        }
    }
}

@Composable
fun ReceiptField(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = Color(0xFF49454F), fontSize = 13.sp)
        Text(value, color = Color(0xFF1C1B1F), fontSize = 13.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun LiveProgressTracker(currentStatus: String) {
    val steps = listOf(
        Pair("confirmed", "Accepted"),
        Pair("reminder_sent", "Reminded"),
        Pair("on_the_way", "En-Route"),
        Pair("completed", "Completed"),
        Pair("rating_requested", "Feedback")
    )

    val currentIndex = steps.indexOfFirst { it.first == currentStatus }.coerceAtLeast(0)

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        steps.forEachIndexed { index, pair ->
            val isActive = index <= currentIndex
            val isCurrent = index == currentIndex

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .background(
                            if (isActive) NeonIndigo else Color(0xFFE9E1D8)
                        )
                        .border(
                            width = if (isCurrent) 2.dp else 0.dp,
                            color = if (isCurrent) Color(0xFF1C1B1F) else Color.Transparent,
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    if (index < currentIndex) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
                    } else {
                        Text(
                            "${index + 1}",
                            color = if (isActive) Color.White else Color(0xFF79747E),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = pair.second,
                    color = if (isActive) Color(0xFF1C1B1F) else Color(0xFF79747E),
                    fontSize = 9.sp,
                    fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Normal,
                    textAlign = TextAlign.Center,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

@Composable
fun FollowupScreen(state: MainUiState, viewModel: MainViewModel) {
    val active = state.activeBooking ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                "I'll handle the follow-up.",
                color = Color(0xFF1C1B1F),
                fontWeight = FontWeight.Bold,
                fontSize = 24.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "Lifecycle scheduling automation logs.",
                color = Color(0xFF79747E),
                fontSize = 14.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Follow Up Timeline checklist items
            TimelineChecklistItem("09:00 AM", "Reminder to you", "Custom SMS alert verifying confirmation tomorrow morning at 10:00 AM.")
            TimelineChecklistItem("09:30 AM", "Provider status check", "Automated system background handshake to verify Ali is heading to G-13.")
            TimelineChecklistItem("10:00 AM", "Service visit begins", "Worker arrives at your Islamabad address coordinates.")
            TimelineChecklistItem("12:00 PM", "Completion check", "Checks with both you and Ali to mark job successfully completed.")
            TimelineChecklistItem("12:15 PM", "Rating request", "Triggers reliability index feedback loops.")
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = { viewModel.navigateTo(AppScreen.CONFIRMED) },
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .weight(0.4f)
                    .height(54.dp),
                border = BorderStroke(1.dp, Color(0xFFE9E1D8))
            ) {
                Text("Booking Card", color = NeonIndigo)
            }

            Button(
                onClick = { viewModel.navigateTo(AppScreen.WELCOME) },
                colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .weight(0.6f)
                    .height(54.dp)
            ) {
                Text("Done", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
            }
        }
    }
}

@Composable
fun TimelineChecklistItem(time: String, title: String, desc: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(10.dp)
                    .clip(CircleShape)
                    .background(NeonIndigo)
            )
            Box(
                modifier = Modifier
                    .width(1.5.dp)
                    .height(44.dp)
                    .background(Color(0xFFE9E1D8))
            )
        }
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(title, color = Color(0xFF1C1B1F), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                Text(time, color = NeonIndigo, fontSize = 12.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(desc, color = Color(0xFF49454F), fontSize = 12.sp, lineHeight = 16.sp)
        }
    }
}

@Composable
fun HistoryScreen(viewModel: MainViewModel, historyList: List<BookingEntity>) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "My Saved Bookings",
                color = Color(0xFF1C1B1F),
                fontWeight = FontWeight.Bold,
                fontSize = 24.sp
            )
            if (historyList.isNotEmpty()) {
                Text(
                    "Clear",
                    color = DangerRust,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    modifier = Modifier.clickable { viewModel.clearAllHistory() }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (historyList.isEmpty()) {
            Column(
                modifier = Modifier.weight(1f).fillMaxWidth(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF79747E), modifier = Modifier.size(56.dp))
                Spacer(modifier = Modifier.height(16.dp))
                Text("No saved bookings found yet.", color = Color(0xFF1C1B1F), fontSize = 16.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Text("Try booking Ali AC services in G-13 Islamabad!", color = Color(0xFF79747E), fontSize = 13.sp, textAlign = TextAlign.Center)
            }
        } else {
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(historyList) { booking ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = DeepSlateCard),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { viewModel.selectHistoryBooking(booking) }
                            .border(1.dp, Color(0xFFE9E1D8), RoundedCornerShape(14.dp))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(booking.serviceType, color = Color(0xFF1C1B1F), fontSize = 16.sp, fontWeight = FontWeight.Bold)
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(
                                            when (booking.status) {
                                                "completed" -> Color(0xFFEBF6EC)
                                                else -> Color(0xFFFCF8F4)
                                            }
                                        )
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = booking.status.uppercase(),
                                        color = when (booking.status) {
                                            "completed" -> NeonIndigo
                                            else -> Color(0xFF79747E)
                                        },
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text("Assigned to ${booking.providerName}", color = Color(0xFF49454F), fontSize = 13.sp)
                            Text("When: ${booking.slot}", color = Color(0xFF79747E), fontSize = 12.sp)
                            Text("Location: ${booking.location}", color = Color(0xFF79747E), fontSize = 12.sp)

                            HorizontalDivider(color = Color(0xFFE9E1D8), modifier = Modifier.padding(vertical = 12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(booking.bookingId, color = NeonIndigo, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                Text(
                                    "Delete",
                                    color = DangerRust.copy(0.7f),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.clickable { viewModel.deleteBookingHistoryItem(booking.bookingId) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WorkflowScreen(state: MainUiState, viewModel: MainViewModel) {
    val steps = state.agentSteps

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Text(
            "AI Agent Workflow completed",
            color = Color(0xFF1C1B1F),
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            "How KaamKarao AI handled this request step-by-step.",
            color = Color(0xFF79747E),
            fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (steps.isEmpty()) {
            Box(
                modifier = Modifier.weight(1f).fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text("No active trace logs yet. Please run a booking scenario first.", color = Color(0xFF79747E), textAlign = TextAlign.Center)
            }
        } else {
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(steps) { step ->
                    var isExpanded by remember { mutableStateOf(false) }

                    Card(
                        colors = CardDefaults.cardColors(containerColor = DeepSlateCard),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { isExpanded = !isExpanded }
                            .border(1.dp, Color(0xFFE9E1D8), RoundedCornerShape(12.dp))
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(24.dp)
                                            .clip(CircleShape)
                                            .background(NeonIndigo.copy(0.2f)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = step.id.toString(),
                                            color = NeonIndigo,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 12.sp
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column {
                                        Text(step.userFriendlyName, color = Color(0xFF1C1B1F), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                        Text(step.agentName, color = Color(0xFF79747E), fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                                    }
                                }

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(NeonIndigo.copy(0.12f))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(step.status, color = NeonIndigo, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Icon(
                                        imageVector = if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.ArrowDropDown,
                                        contentDescription = null,
                                        tint = Color(0xFF79747E),
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            Text(step.description, color = Color(0xFF49454F), fontSize = 12.sp)

                            if (isExpanded) {
                                Spacer(modifier = Modifier.height(12.dp))
                                HorizontalDivider(color = Color(0xFFE9E1D8))
                                Spacer(modifier = Modifier.height(8.dp))
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(LightSlateCard, RoundedCornerShape(8.dp))
                                        .padding(10.dp)
                                ) {
                                    step.logs.forEach { logLine ->
                                        Text(
                                            text = logLine,
                                            color = if (logLine.contains("TOOL_CALL")) NeonIndigo else Color(0xFF1C1B1F),
                                            fontFamily = FontFamily.Monospace,
                                            fontSize = 11.sp,
                                            modifier = Modifier.padding(vertical = 2.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                val active = state.activeBooking
                if (active != null) {
                    viewModel.navigateTo(AppScreen.CONFIRMED)
                } else {
                    viewModel.navigateTo(AppScreen.ASK_HOME)
                }
            },
            colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text("Go back", fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}

@Composable
fun GoogleLogoIcon(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier.size(18.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height
            val strokeW = 2.5.dp.toPx()
            
            // Red arc top
            drawArc(
                color = Color(0xFFEA4335),
                startAngle = 180f,
                sweepAngle = 110f,
                useCenter = false,
                topLeft = Offset(0f, 0f),
                size = androidx.compose.ui.geometry.Size(w, h),
                style = Stroke(width = strokeW)
            )
            // Yellow arc left/bottom
            drawArc(
                color = Color(0xFFFBBC05),
                startAngle = 110f,
                sweepAngle = 70f,
                useCenter = false,
                topLeft = Offset(0f, 0f),
                size = androidx.compose.ui.geometry.Size(w, h),
                style = Stroke(width = strokeW)
            )
            // Green arc bottom
            drawArc(
                color = Color(0xFF34A853),
                startAngle = 30f,
                sweepAngle = 80f,
                useCenter = false,
                topLeft = Offset(0f, 0f),
                size = androidx.compose.ui.geometry.Size(w, h),
                style = Stroke(width = strokeW)
            )
            // Blue arc right + center bar
            drawArc(
                color = Color(0xFF4285F4),
                startAngle = -70f,
                sweepAngle = 100f,
                useCenter = false,
                topLeft = Offset(0f, 0f),
                size = androidx.compose.ui.geometry.Size(w, h),
                style = Stroke(width = strokeW)
            )
            // Center horizontal blue line
            drawLine(
                color = Color(0xFF4285F4),
                start = Offset(w * 0.5f, h * 0.5f),
                end = Offset(w, h * 0.5f),
                strokeWidth = strokeW
            )
        }
    }
}

@Composable
fun GoogleSignInAccountChooserDialog(
    onDismiss: () -> Unit,
    onAccountChosen: (String, String) -> Unit
) {
    androidx.compose.ui.window.Dialog(onDismissRequest = onDismiss) {
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .border(1.dp, Color(0xFFDADCE0).copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                .testTag("google_account_chooser_dialog")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                GoogleLogoIcon(modifier = Modifier.size(32.dp))
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = "Sign in with Google",
                    color = Color(0xFF202124),
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "to continue to KaamKarao AI",
                    color = Color(0xFF5F6368),
                    fontSize = 13.sp,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val accounts = listOf(
                        Pair("Farrukh Tahir", "farrukhtahir5@gmail.com"),
                        Pair("Guest Account", "kaamworker.guest@gmail.com")
                    )
                    
                    accounts.forEach { (name, email) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .clickable { onAccountChosen(name, email) }
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFFF1F3F4)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = name.take(1).uppercase(),
                                    color = Color(0xFF5F6368),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = name,
                                    color = Color(0xFF3C4043),
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = email,
                                    color = Color(0xFF5F6368),
                                    fontSize = 12.sp
                                )
                            }
                        }
                    }
                    
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { onAccountChosen("Guest Pro", "guest.pro@kaamkarao.com") }
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFE8F0FE)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, tint = Color(0xFF1A73E8), modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "Use another account",
                            color = Color(0xFF1A73E8),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(20.dp))
                
                Text(
                    text = "To continue, Google will share your name, email address, and profile picture with KaamKarao AI. See our Privacy Policy and Terms of Services.",
                    color = Color(0xFF70757A),
                    fontSize = 10.sp,
                    lineHeight = 14.sp,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

val Provider.handle: String
    get() = "@" + name.lowercase(java.util.Locale.ROOT)
        .replace(" & ", "_")
        .replace(" ", "_")
        .replace("(", "")
        .replace(")", "")
        .replace(".", "")
        .replace("'", "")

@Composable
fun ProviderDirectoryScreen(state: MainUiState, viewModel: MainViewModel) {
    val providers = com.example.data.ProviderMarketplace.providers
    var query by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    
    val filtered = remember(query, selectedCategory) {
        providers.filter { 
            (selectedCategory == "All" || it.serviceType.lowercase().contains(selectedCategory.lowercase())) &&
            (it.name.lowercase().contains(query.lowercase()) || it.serviceType.lowercase().contains(query.lowercase()) || it.handle.lowercase().contains(query.lowercase()))
        }
    }

    val categories = listOf("All", "AC", "Electrician", "Plumber", "Tutor", "Salon", "Cleaning")
    
    var detailedProvider by remember { mutableStateOf<Provider?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Text(
            text = "Providers Grid 👥",
            color = Color(0xFF1C1B1F),
            fontWeight = FontWeight.Black,
            fontSize = 24.sp
        )
        Text(
            text = "Interactive grids of verified local informal service experts.",
            color = Color(0xFF79747E),
            fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        TextField(
            value = query,
            onValueChange = { query = it },
            placeholder = { Text("Search handle, name or type...", fontSize = 13.sp, color = Color(0xFF79747E)) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = NeonIndigo) },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { query = "" }) {
                        Icon(Icons.Default.Clear, contentDescription = "Clear", tint = Color(0xFF79747E))
                    }
                }
            },
            colors = TextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedIndicatorColor = NeonIndigo,
                unfocusedIndicatorColor = Color(0xFFDADCE0)
            ),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Color(0xFFDADCE0), RoundedCornerShape(12.dp))
                .testTag("directory_search_bar")
        )

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            categories.forEach { cat ->
                val isSel = (cat == "All" && selectedCategory == "All") || (cat != "All" && selectedCategory.lowercase().contains(cat.lowercase()))
                Surface(
                    onClick = { selectedCategory = if (cat == "All") "All" else cat },
                    color = if (isSel) NeonIndigo else Color.White,
                    border = BorderStroke(1.dp, if (isSel) NeonIndigo else Color(0xFFDADCE0)),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Text(
                        text = cat,
                        color = if (isSel) Color.White else Color(0xFF1C1B1F),
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (filtered.isEmpty()) {
            Box(
                modifier = Modifier.weight(1f).fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text("No service providers found.", color = Color(0xFF79747E))
            }
        } else {
            val chunked = filtered.chunked(3) // 3 columns
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(chunked) { rowProducts ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        for (i in 0 until 3) {
                            if (i < rowProducts.size) {
                                val provider = rowProducts[i]
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .aspectRatio(1f)
                                        .clip(RoundedCornerShape(16.dp))
                                        .background(Color(0xFFE3F2FD)) // Soft light Google blue matches the uploaded photo
                                        .border(1.dp, Color(0xFFBBDEFB).copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                                        .clickable { detailedProvider = provider }
                                        .padding(8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        verticalArrangement = Arrangement.Center
                                    ) {
                                        ProviderAvatar(provider, size = 52.dp)
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(
                                            text = provider.handle,
                                            color = Color(0xFF0D47A1),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 11.sp,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis,
                                            textAlign = TextAlign.Center
                                        )
                                        Text(
                                            text = provider.serviceType,
                                            color = Color(0xFF546E7A),
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Medium,
                                            maxLines = 1,
                                        )
                                    }
                                }
                            } else {
                                Spacer(modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = { viewModel.navigateTo(AppScreen.WELCOME) },
            modifier = Modifier.fillMaxWidth().height(48.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = NeonIndigo),
            border = BorderStroke(1.dp, NeonIndigo.copy(alpha = 0.5f)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("Go back to Welcome Screen", fontWeight = FontWeight.Bold)
        }
    }

    detailedProvider?.let { prov ->
        androidx.compose.ui.window.Dialog(onDismissRequest = { detailedProvider = null }) {
            Card(
                shape = RoundedCornerShape(18.dp),
                border = BorderStroke(1.dp, NeonIndigo.copy(alpha = 0.3f)),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        ProviderAvatar(prov, size = 52.dp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(prov.name, color = Color(0xFF1C1B1F), fontWeight = FontWeight.Bold, fontSize = 17.sp)
                            Text(prov.handle, color = Color(0xFF0D47A1), fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFF1EFE7), RoundedCornerShape(12.dp))
                            .padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Service Category", color = Color(0xFF79747E), fontSize = 12.sp)
                            Text(prov.serviceType, color = Color(0xFF1C1B1F), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Completed Jobs", color = Color(0xFF79747E), fontSize = 12.sp)
                            Text("${prov.completedJobs} Orders", color = Color(0xFF1C1B1F), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Repeat Cust. Rate", color = Color(0xFF79747E), fontSize = 12.sp)
                            Text("${prov.repeatCustomerRate}%", color = NeonIndigo, fontWeight = FontWeight.Black, fontSize = 12.sp)
                        }
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Charges", color = Color(0xFF79747E), fontSize = 12.sp)
                            Text(prov.estimatedCharges, color = Color(0xFF1C1B1F), fontWeight = FontWeight.Medium, fontSize = 12.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        "Tap below to draft an automated AI booking request with this expert.",
                        fontSize = 11.sp,
                        color = Color(0xFF79747E),
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedButton(
                            onClick = { detailedProvider = null },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Cancel")
                        }
                        Button(
                            onClick = {
                                detailedProvider = null
                                viewModel.navigateTo(AppScreen.ASK_HOME)
                                viewModel.updateInputQuery("Book ${prov.name} for ${prov.serviceType} services")
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonIndigo),
                            modifier = Modifier.weight(1.3f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Select & Book", color = Color.White)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun UserProfileScreen(state: MainUiState, viewModel: MainViewModel) {
    var isEditingName by remember { mutableStateOf(false) }
    var editedName by remember { mutableStateOf(state.userName) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "User Profile 👤",
                color = Color(0xFF1C1B1F),
                fontWeight = FontWeight.Black,
                fontSize = 24.sp,
                modifier = Modifier.weight(1f)
            )
        }
        Text(
            text = "Manage your active Google account and customized parameters.",
            color = Color(0xFF79747E),
            fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(20.dp))

        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFFEBF6EC)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Verified Status",
                    tint = NeonIndigo,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "AUTHENTICATED VIA GOOGLE",
                    color = NeonIndigo,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, Color(0xFFE9E1D8)),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(NeonIndigo.copy(alpha = 0.15f))
                        .border(3.dp, NeonIndigo, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    val initial = if (state.userName.isNotEmpty()) state.userName.take(2).uppercase() else "U"
                    Text(
                        text = initial,
                        color = NeonIndigo,
                        fontWeight = FontWeight.Black,
                        fontSize = 28.sp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                if (isEditingName) {
                    TextField(
                        value = editedName,
                        onValueChange = { editedName = it },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color.Transparent,
                            unfocusedContainerColor = Color.Transparent,
                            focusedIndicatorColor = NeonIndigo
                        ),
                        modifier = Modifier.fillMaxWidth(),
                        trailingIcon = {
                            IconButton(onClick = {
                                viewModel.updateProfileName(editedName)
                                isEditingName = false
                            }) {
                                Icon(Icons.Default.Check, contentDescription = "Save", tint = NeonIndigo)
                            }
                        }
                    )
                } else {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = state.userName.ifEmpty { "Guest User" },
                            color = Color(0xFF1C1B1F),
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(
                            imageVector = Icons.Default.Edit,
                            contentDescription = "Edit name",
                            tint = Color(0xFF79747E),
                            modifier = Modifier
                                .size(16.dp)
                                .clickable { isEditingName = true }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = state.userEmail.ifEmpty { "anonymous-guest@kaamkarao.com" },
                    color = Color(0xFF79747E),
                    fontSize = 13.sp
                )

                HorizontalDivider(color = Color(0xFFE9E1D8), modifier = Modifier.padding(vertical = 16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("MEMBER SINCE", color = Color(0xFF79747E), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("May 2026", color = Color(0xFF1C1B1F), fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                    Box(modifier = Modifier.width(1.dp).height(30.dp).background(Color(0xFFE9E1D8)))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("ACCOUNT CLASS", color = Color(0xFF79747E), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("Excellent Verified", color = NeonIndigo, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = { viewModel.logoutGoogle() },
            colors = ButtonDefaults.buttonColors(containerColor = DangerRust),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        ) {
            Icon(Icons.Default.Lock, contentDescription = "Sign Out", tint = Color.White)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Sign out / Disconnect Account", fontWeight = FontWeight.Bold, color = Color.White)
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = { viewModel.navigateTo(AppScreen.WELCOME) },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            border = BorderStroke(1.dp, NeonIndigo),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("Back to Welcome Dashboard", color = NeonIndigo, fontWeight = FontWeight.Bold)
        }
    }
}
