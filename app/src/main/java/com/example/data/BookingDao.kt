package com.example.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface BookingDao {
    @Query("SELECT * FROM booking_history ORDER BY timestamp DESC")
    fun getAllBookings(): Flow<List<BookingEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBooking(booking: BookingEntity)

    @Query("UPDATE booking_history SET status = :status WHERE bookingId = :bookingId")
    suspend fun updateBookingStatus(bookingId: String, status: String)

    @Query("DELETE FROM booking_history WHERE bookingId = :bookingId")
    suspend fun deleteBooking(bookingId: String)

    @Query("DELETE FROM booking_history")
    suspend fun clearAllBookings()
}
