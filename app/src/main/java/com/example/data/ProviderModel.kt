package com.example.data

import com.example.R
import java.util.Locale
import kotlin.math.sqrt
import kotlin.math.pow
import kotlin.math.abs

data class Provider(
    val id: String,
    val name: String,
    val serviceType: String,
    val areas: List<String>,
    val rating: Double,
    val distanceKm: Double,
    val availableSlots: List<String>,
    val completionRate: Int,      // Percentage e.g. 94%
    val responseTimeMin: Int,     // Minutes e.g. 8
    val estimatedCharges: String, // e.g. "Rs. 1500 - Rs. 2000"
    val emergencyAvailable: Boolean,
    val isVerified: Boolean = true,
    val completedJobs: Int,
    val repeatCustomerRate: Int,  // Percentage e.g. 37%
    val avatarDrawable: Int? = null
) {
    /**
     * Calculates the Trust Score (Reliability Score on Frontend)
     * For normal mode and emergency mode respectively based on specifications.
     */
    fun calculateScore(isEmergency: Boolean): Int {
        return if (isEmergency) {
            // Emergency Mode Formula: Availability: 35%, Distance: 30%, Rating: 15%, Completion Rate: 10%, Response Speed: 10%
            val availabilityScore = if (emergencyAvailable) 35.0 else 10.0
            
            // Distance (shorter is better, max 10km)
            val distScore = ((10.0 - distanceKm.coerceIn(0.0, 10.0)) / 10.0) * 30.0
            
            // Rating (normalized out of 5)
            val ratScore = (rating / 5.0) * 15.0
            
            // Completion rate (normalized out of 100)
            val compScore = (completionRate / 100.0) * 10.0
            
            // Response Speed (shorter response time is better, max 30 min)
            val speedScore = ((30.0 - responseTimeMin.coerceIn(0, 30).toDouble()) / 30.0) * 10.0
            
            (availabilityScore + distScore + ratScore + compScore + speedScore).toInt().coerceIn(0, 100)
        } else {
            // Normal Mode Formula: Rating: 30%, Availability: 25%, Distance: 20%, Completion Rate: 15%, Response Speed: 10%
            val ratScore = (rating / 5.0) * 30.0
            val availabilityScore = 25.0 // Handled matches mostly
            
            // Distance (shorter is better, max 10km)
            val distScore = ((10.0 - distanceKm.coerceIn(0.0, 10.0)) / 10.0) * 20.0
            
            // Completion rate (normalized out of 100)
            val compScore = (completionRate / 100.0) * 15.0
            
            // Response Speed (shorter response time is better, max 30 min)
            val speedScore = ((30.0 - responseTimeMin.coerceIn(0, 30).toDouble()) / 30.0) * 10.0
            
            (ratScore + availabilityScore + distScore + compScore + speedScore).toInt().coerceIn(0, 100)
        }
    }
}

object ProviderMarketplace {
    val providers = listOf(
        // AC Technicians
        Provider(
            id = "p_ac_ali",
            name = "Rana Ali AC Repair",
            serviceType = "AC Technician",
            areas = listOf("G-13", "G-11", "F-11", "F-10"),
            rating = 4.8,
            distanceKm = 2.1,
            availableSlots = listOf("10:00 AM", "2:00 PM", "4:30 PM"),
            completionRate = 94,
            responseTimeMin = 8,
            estimatedCharges = "Rs. 1500 - Rs. 2000",
            emergencyAvailable = false,
            completedJobs = 148,
            repeatCustomerRate = 37,
            avatarDrawable = R.drawable.img_worker_ali
        ),
        Provider(
            id = "p_ac_umar",
            name = "Umar Farooq Cooling",
            serviceType = "AC Technician",
            areas = listOf("G-13", "G-11", "F-10", "I-8"),
            rating = 4.6,
            distanceKm = 3.4,
            availableSlots = listOf("9:30 AM", "12:00 PM", "3:00 PM"),
            completionRate = 91,
            responseTimeMin = 12,
            estimatedCharges = "Rs. 1200 - Rs. 1800",
            emergencyAvailable = false,
            completedJobs = 89,
            repeatCustomerRate = 29,
            avatarDrawable = R.drawable.img_worker_umar
        ),
        Provider(
            id = "p_ac_fast",
            name = "Zahid Mahmood AC",
            serviceType = "AC Technician",
            areas = listOf("G-13", "F-11", "DHA", "Bahria Town"),
            rating = 4.2,
            distanceKm = 2.8,
            availableSlots = listOf("11:00 AM", "1:30 PM", "5:00 PM"),
            completionRate = 85,
            responseTimeMin = 15,
            estimatedCharges = "Rs. 1600 - Rs. 2200",
            emergencyAvailable = false,
            completedJobs = 64,
            repeatCustomerRate = 18,
            avatarDrawable = R.drawable.img_worker_ali
        ),

        // Electricians
        Provider(
            id = "p_elec_safe",
            name = "Sajid Malik Electric",
            serviceType = "Electrician",
            areas = listOf("G-13", "G-11", "F-11", "Bahria Town"),
            rating = 4.9,
            distanceKm = 1.4,
            availableSlots = listOf("Available Now", "2:00 PM", "6:00 PM"),
            completionRate = 96,
            responseTimeMin = 4,
            estimatedCharges = "Rs. 1000 - Rs. 1500",
            emergencyAvailable = true,
            completedJobs = 210,
            repeatCustomerRate = 45,
            avatarDrawable = R.drawable.img_worker_electrician
        ),
        Provider(
            id = "p_elec_sparky",
            name = "Naveed Akhtar Electric",
            serviceType = "Electrician",
            areas = listOf("G-13", "G-11", "I-8", "F-10"),
            rating = 4.5,
            distanceKm = 3.2,
            availableSlots = listOf("Available Now", "11:00 AM", "4:00 PM"),
            completionRate = 88,
            responseTimeMin = 10,
            estimatedCharges = "Rs. 800 - Rs. 1200",
            emergencyAvailable = true,
            completedJobs = 115,
            repeatCustomerRate = 30,
            avatarDrawable = R.drawable.img_worker_electrician
        ),

        // Plumbers
        Provider(
            id = "p_plumb_quick",
            name = "Tariq Jamil Plumber",
            serviceType = "Plumber",
            areas = listOf("G-13", "G-11", "F-11", "I-8"),
            rating = 4.7,
            distanceKm = 1.8,
            availableSlots = listOf("Available Now", "10:00 AM", "3:00 PM"),
            completionRate = 93,
            responseTimeMin = 6,
            estimatedCharges = "Rs. 1500 - Rs. 2500",
            emergencyAvailable = true,
            completedJobs = 132,
            repeatCustomerRate = 34,
            avatarDrawable = R.drawable.img_worker_plumber
        ),
        Provider(
            id = "p_plumb_expert",
            name = "Imran Abbasi Pipes",
            serviceType = "Plumber",
            areas = listOf("G-13", "F-10", "DHA"),
            rating = 4.4,
            distanceKm = 4.1,
            availableSlots = listOf("Available Now", "1:00 PM", "5:30 PM"),
            completionRate = 89,
            responseTimeMin = 14,
            estimatedCharges = "Rs. 1800 - Rs. 2800",
            emergencyAvailable = true,
            completedJobs = 75,
            repeatCustomerRate = 22,
            avatarDrawable = R.drawable.img_worker_plumber
        ),

        // Tutors
        Provider(
            id = "p_tut_master",
            name = "Sir Saeed Ahmad",
            serviceType = "Math Tutor",
            areas = listOf("G-13", "G-11", "F-10", "F-11"),
            rating = 4.9,
            distanceKm = 2.5,
            availableSlots = listOf("4:00 PM", "6:00 PM"),
            completionRate = 98,
            responseTimeMin = 5,
            estimatedCharges = "Rs. 5000 - Rs. 8000/mo",
            emergencyAvailable = false,
            completedJobs = 56,
            repeatCustomerRate = 80,
            avatarDrawable = R.drawable.img_worker_umar
        ),

        // Beauticians
        Provider(
            id = "p_salon_glam",
            name = "Ayesha Beauty Care",
            serviceType = "Beautician",
            areas = listOf("G-13", "G-11", "F-11", "F-10"),
            rating = 4.6,
            distanceKm = 1.9,
            availableSlots = listOf("11:00 AM", "1:30 PM", "3:30 PM", "6:00 PM"),
            completionRate = 90,
            responseTimeMin = 10,
            estimatedCharges = "Rs. 3000 - Rs. 5000",
            emergencyAvailable = false,
            completedJobs = 94,
            repeatCustomerRate = 42,
            avatarDrawable = null
        ),

        // Appliance Repair
        Provider(
            id = "p_appl_smart",
            name = "Waseem Akram Repairs",
            serviceType = "Appliance Repair",
            areas = listOf("G-13", "G-11", "F-11", "I-8"),
            rating = 4.5,
            distanceKm = 3.0,
            availableSlots = listOf("10:00 AM", "12:00 PM", "4:00 PM"),
            completionRate = 88,
            responseTimeMin = 15,
            estimatedCharges = "Rs. 2000 - Rs. 3500",
            emergencyAvailable = false,
            completedJobs = 102,
            repeatCustomerRate = 28,
            avatarDrawable = R.drawable.img_worker_umar
        ),

        // Home Cleaning
        Provider(
            id = "p_clean_sparkle",
            name = "Bilal Cleaning Services",
            serviceType = "Home Cleaning",
            areas = listOf("G-13", "F-11", "F-10", "DHA"),
            rating = 4.8,
            distanceKm = 2.3,
            availableSlots = listOf("8:00 AM", "1:00 PM"),
            completionRate = 94,
            responseTimeMin = 8,
            estimatedCharges = "Rs. 2000 - Rs. 3500",
            emergencyAvailable = false,
            completedJobs = 156,
            repeatCustomerRate = 48,
            avatarDrawable = R.drawable.img_worker_ali
        ),

        // Carpenters
        Provider(
            id = "p_carp_urban",
            name = "Sajid Hussain Woodworks",
            serviceType = "Carpenter",
            areas = listOf("G-13", "G-11", "I-8", "Bahria Town"),
            rating = 4.4,
            distanceKm = 3.6,
            availableSlots = listOf("10:00 AM", "3:00 PM"),
            completionRate = 87,
            responseTimeMin = 14,
            estimatedCharges = "Rs. 1500 - Rs. 2500",
            emergencyAvailable = false,
            completedJobs = 73,
            repeatCustomerRate = 20,
            avatarDrawable = R.drawable.img_worker_umar
        ),

        // Painters
        Provider(
            id = "p_paint_creative",
            name = "Tariq Kiyani Decor",
            serviceType = "Painter",
            areas = listOf("G-13", "G-11", "F-11", "Bahria Town"),
            rating = 4.7,
            distanceKm = 2.9,
            availableSlots = listOf("9:00 AM", "1:00 PM"),
            completionRate = 92,
            responseTimeMin = 9,
            estimatedCharges = "Rs. 10000 - Rs. 15000",
            emergencyAvailable = false,
            completedJobs = 45,
            repeatCustomerRate = 33,
            avatarDrawable = R.drawable.img_worker_ali
        )
    )

    fun getProvidersForService(serviceType: String, area: String): List<Provider> {
        val serviceMatches = providers.filter { 
            it.serviceType.lowercase().contains(serviceType.lowercase()) || 
            serviceType.lowercase().contains(it.serviceType.lowercase())
        }
        return serviceMatches.map { provider ->
            val minDistance = provider.areas.map { provArea ->
                SectorCoordinates.getDistance(area, provArea)
            }.minOrNull() ?: 2.5
            val formattedDist = String.format(Locale.US, "%.1f", minDistance).toDouble()
            provider.copy(distanceKm = formattedDist)
        }
    }
}

object SectorCoordinates {
    private val coords = mapOf(
        "G-13" to Pair(1.0, 5.5),
        "G-11" to Pair(4.0, 5.0),
        "F-11" to Pair(4.0, 8.0),
        "F-10" to Pair(6.5, 8.0),
        "I-8" to Pair(11.0, 2.0),
        "BAHRIA" to Pair(15.0, -10.0),
        "DHA" to Pair(18.0, -12.0),
        "PWD" to Pair(14.0, -9.0),
        "GHOURI" to Pair(13.0, -4.0),
        "BANI GALA" to Pair(14.0, 10.0),
        "SOAN GARDENS" to Pair(15.0, -11.0),
        "RAWALPINDI" to Pair(8.0, -5.0)
    )

    fun getDistance(area1: String, area2: String): Double {
        val clean1 = normalize(area1)
        val clean2 = normalize(area2)
        if (clean1 == clean2) {
            return 1.2 + (abs(area1.hashCode() % 10) * 0.15)
        }
        val p1 = coords[clean1] ?: coords.entries.find { clean1.contains(it.key) || it.key.contains(clean1) }?.value ?: Pair(5.0, 5.0)
        val p2 = coords[clean2] ?: coords.entries.find { clean2.contains(it.key) || it.key.contains(clean2) }?.value ?: Pair(5.0, 5.0)
        val dist = sqrt((p1.first - p2.first).pow(2.0) + (p1.second - p2.second).pow(2.0))
        return dist.coerceAtLeast(1.0)
    }

    private fun normalize(area: String): String {
        val upper = area.uppercase(Locale.ROOT)
        return when {
            upper.contains("G-13") || upper.contains("G13") -> "G-13"
            upper.contains("G-11") || upper.contains("G11") -> "G-11"
            upper.contains("F-11") || upper.contains("F11") -> "F-11"
            upper.contains("F-10") || upper.contains("F10") -> "F-10"
            upper.contains("I-8") || upper.contains("I8") -> "I-8"
            upper.contains("BAHRIA") -> "BAHRIA"
            upper.contains("DHA") -> "DHA"
            upper.contains("PWD") -> "PWD"
            upper.contains("GHOURI") -> "GHOURI"
            upper.contains("BANI GALA") || upper.contains("BANIGALA") -> "BANI GALA"
            upper.contains("SOAN") -> "SOAN GARDENS"
            upper.contains("RAWALPINDI") || upper.contains("PINDI") -> "RAWALPINDI"
            else -> upper
        }
    }
}
