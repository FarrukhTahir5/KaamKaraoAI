package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "booking_history")
data class BookingEntity(
    @PrimaryKey val bookingId: String,
    val serviceType: String,
    val providerName: String,
    val location: String,
    val slot: String,
    val status: String,
    val estimatedCharges: String,
    val isEmergency: Boolean,
    val timestamp: Long = System.currentTimeMillis()
)
