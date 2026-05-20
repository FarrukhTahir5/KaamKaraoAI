package com.example.service

import android.util.Log
import com.example.BuildConfig
import org.json.JSONObject
import java.util.Locale

data class ParsedRequest(
    val serviceType: String,
    val location: String,
    val time: String,
    val urgency: String,
    val suggestedTime: String,
    val originalQuery: String,
    val isGeminiResolved: Boolean
)

object QueryParser {
    private const val TAG = "QueryParser"

    // Supported Services
    const val SERVICE_AC = "AC Technician"
    const val SERVICE_ELECTRICIAN = "Electrician"
    const val SERVICE_PLUMBER = "Plumber"
    const val SERVICE_TUTOR = "Math Tutor"
    const val SERVICE_BEAUTICIAN = "Beautician"
    const val SERVICE_APPLIANCE = "Appliance Repair"
    const val SERVICE_CLEANING = "Home Cleaning"
    const val SERVICE_CARPENTER = "Carpenter"
    const val SERVICE_PAINTER = "Painter"

    suspend fun parse(query: String): ParsedRequest {
        val apiKey = BuildConfig.GEMINI_API_KEY
        val hasRealKey = apiKey.isNotEmpty() && 
                         apiKey != "MY_GEMINI_API_KEY" && 
                         !apiKey.contains("PLACEHOLDER")

        if (hasRealKey) {
            try {
                val systemPrompt = """
                    You are KaamKarao AI's Intent Extraction engine. Analyze the Pakistani local service request (in Roman Urdu, Urdu, or English) and return a JSON object with these fields:
                    - 'serviceType': Must be exactly one of: 'AC Technician', 'Electrician', 'Plumber', 'Math Tutor', 'Beautician', 'Appliance Repair', 'Home Cleaning', 'Carpenter', 'Painter'. If not specified, return "".
                    - 'location': Extract the sector or region (e.g. 'G-13 Islamabad', 'F-11', 'Bahria Town'). If not specified, return "".
                    - 'time': Detected day/time, e.g. 'Tomorrow morning', 'Now', 'Aaj shaam'. Default to 'Today' if unclear.
                    - 'urgency': 'High' if there are signs of urgent issue (e.g., sparks, fire, leaking water, broken doors, available now), otherwise 'Normal'.
                    - 'suggestedTime': Recommended clock time (e.g., '10:00 AM', 'Immediate').
                    
                    Respond strictly with valid JSON. Do not include markdown styling or outer codeblocks.
                """.trimIndent()

                val response = RetrofitClient.service.generateContent(
                    apiKey = apiKey,
                    request = GeminiRequest(
                        contents = listOf(Content(parts = listOf(Part(text = query)))),
                        generationConfig = GenerationConfig(
                            responseFormat = ResponseFormat(ResponseFormatText(mimeType = "application/json")),
                            temperature = 0.2f
                        ),
                        systemInstruction = Content(parts = listOf(Part(text = systemPrompt)))
                    )
                )

                val responseText = response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
                if (!responseText.isNullOrEmpty()) {
                    Log.d(TAG, "Gemini Response: $responseText")
                    // Strip backticks if returned despite instructions
                    val cleanJson = responseText.replace("```json", "").replace("```", "").trim()
                    val json = JSONObject(cleanJson)
                    return ParsedRequest(
                        serviceType = json.optString("serviceType", ""),
                        location = json.optString("location", ""),
                        time = json.optString("time", "Today"),
                        urgency = json.optString("urgency", "Normal"),
                        suggestedTime = json.optString("suggestedTime", "10:00 AM"),
                        originalQuery = query,
                        isGeminiResolved = true
                    )
                }
            } catch (e: Exception) {
                Log.e(TAG, "Gemini parsing failed, falling back to local regex: ${e.message}")
            }
        }

        // Offline / Fallback Parsing Logic using Regex & Keyword triggers
        val lower = query.lowercase(Locale.ROOT)
        var service = ""
        var location = ""
        var urgency = "Normal"
        var time = "Today"
        var suggestedTime = "10:00 AM"

        // 1. Identify Service
        when {
            lower.contains("ac") || lower.contains("cooling") || lower.contains("compressor") || lower.contains("air conditioner") -> {
                service = SERVICE_AC
            }
            lower.contains("electrician") || lower.contains("bijli") || lower.contains("socket") || lower.contains("spark") || lower.contains("wire") || lower.contains("plug") -> {
                service = SERVICE_ELECTRICIAN
            }
            lower.contains("plumber") || lower.contains(" नल ") || lower.contains("pipe") || lower.contains("leak") || lower.contains("seepage") || lower.contains("tap") -> {
                service = SERVICE_PLUMBER
            }
            lower.contains("tutor") || lower.contains("teacher") || lower.contains("math") || lower.contains("padhana") || lower.contains("parhana") || lower.contains("class") -> {
                service = SERVICE_TUTOR
            }
            lower.contains("beautician") || lower.contains("makeup") || lower.contains("salon") || lower.contains("parlor") || lower.contains("parlour") || lower.contains("facial") -> {
                service = SERVICE_BEAUTICIAN
            }
            lower.contains("fridge") || lower.contains("oven") || lower.contains("refrigerator") || lower.contains("washing machine") || lower.contains("microwave") || lower.contains("appliance") -> {
                service = SERVICE_APPLIANCE
            }
            lower.contains("clean") || lower.contains("safai") || lower.contains("sweeper") || lower.contains("dusting") -> {
                service = SERVICE_CLEANING
            }
            lower.contains("carpenter") || lower.contains("lakri") || lower.contains("wood") || lower.contains("bed") || lower.contains("sofa") || lower.contains("door") || lower.contains("lock") -> {
                service = SERVICE_CARPENTER
            }
            lower.contains("paint") || lower.contains("wall paint") || lower.contains("painter") || lower.contains("rang") -> {
                service = SERVICE_PAINTER
            }
        }

        // 2. Identify Location (Smarter support for regex matching any Islamabad sector pattern)
        val sectorRegex = Regex("""\b([a-zA-Z])-?(\d+)\b""")
        val matchResult = sectorRegex.find(lower)
        if (matchResult != null) {
            val letter = matchResult.groupValues[1].uppercase(Locale.ROOT)
            val digits = matchResult.groupValues[2]
            location = "$letter-$digits Islamabad"
        } else {
            when {
                lower.contains("bahria") -> location = "Bahria Town"
                lower.contains("dha") -> location = "DHA"
                lower.contains("pwd") -> location = "PWD"
                lower.contains("ghouri") -> location = "Ghouri Town"
                lower.contains("bani gala") || lower.contains("banigala") -> location = "Bani Gala"
                lower.contains("soan") -> location = "Soan Gardens"
                lower.contains("rawalpindi") || lower.contains("pindi") -> location = "Rawalpindi"
                lower.contains("islamabad") || lower.contains("isb") -> location = "G-13 Islamabad" // Default sector if general Islamabad
            }
        }

        // 3. Identify Urgency & Time
        if (lower.contains("spark") || lower.contains("emergency") || lower.contains("urgent") || lower.contains("abhi") || lower.contains("fauri") || lower.contains("leaking")) {
            urgency = "High"
            time = "Now / Immediate"
            suggestedTime = "Immediate"
        } else if (lower.contains("kal subah") || lower.contains("kal morning") || lower.contains("tomorrow")) {
            time = "Tomorrow Morning"
            suggestedTime = "10:00 AM"
        } else if (lower.contains("shaam") || lower.contains("evening")) {
            time = "Today Evening"
            suggestedTime = "5:00 PM"
        }

        return ParsedRequest(
            serviceType = service,
            location = location,
            time = time,
            urgency = urgency,
            suggestedTime = suggestedTime,
            originalQuery = query,
            isGeminiResolved = false
        )
    }
}
