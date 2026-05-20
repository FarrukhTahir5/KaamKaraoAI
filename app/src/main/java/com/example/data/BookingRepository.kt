package com.example.data

import kotlinx.coroutines.flow.Flow

class BookingRepository(private val bookingDao: BookingDao) {
    val allBookings: Flow<List<BookingEntity>> = bookingDao.getAllBookings()

    suspend fun insertBooking(booking: BookingEntity) {
        bookingDao.insertBooking(booking)
    }

    suspend fun updateBookingStatus(bookingId: String, status: String) {
        bookingDao.updateBookingStatus(bookingId, status)
    }

    suspend fun deleteBooking(bookingId: String) {
        bookingDao.deleteBooking(bookingId)
    }

    suspend fun clearAllBookings() {
        bookingDao.clearAllBookings()
    }
}
