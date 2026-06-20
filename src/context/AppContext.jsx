import React, { createContext, useState, useCallback } from 'react';
import { SAMPLE_GUIDES, COUPONS, BOOKING_STATUS } from '../data/guideData';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [guides, setGuides] = useState(SAMPLE_GUIDES);
  const [bookings, setBookings] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [userCoupons, setUserCoupons] = useState(COUPONS);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);

  // Search and filter guides
  const searchGuides = useCallback((location, packageType, rating) => {
    return guides.filter(guide => {
      const locationMatch = !location || guide.location.toLowerCase().includes(location.toLowerCase());
      const packageMatch = !packageType || guide.packages.includes(packageType);
      const ratingMatch = !rating || guide.rating >= rating;
      return locationMatch && packageMatch && ratingMatch;
    });
  }, [guides]);

  // Create booking
  const createBooking = useCallback((bookingData) => {
    const newBooking = {
      id: `booking_${Date.now()}`,
      ...bookingData,
      status: BOOKING_STATUS.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setBookings([...bookings, newBooking]);
    setCurrentBooking(newBooking);
    return newBooking;
  }, [bookings]);

  // Update booking status
  const updateBookingStatus = useCallback((bookingId, status) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status, updatedAt: new Date() }
        : booking
    ));
  }, [bookings]);

  // Apply coupon
  const applyCoupon = useCallback((couponCode) => {
    const coupon = userCoupons.find(c => c.code === couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      return { success: true, coupon };
    }
    return { success: false, error: 'Invalid coupon code' };
  }, [userCoupons]);

  // Remove coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Calculate total price
  const calculatePrice = useCallback((basePrice, multipliers) => {
    let total = basePrice;
    if (multipliers.groupSize) total *= multipliers.groupSize;
    if (multipliers.rating) total *= multipliers.rating;
    if (multipliers.time) total *= multipliers.time;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        total -= (total * appliedCoupon.discount) / 100;
      } else {
        total -= appliedCoupon.discount;
      }
    }
    return total;
  }, [appliedCoupon]);

  return (
    <AppContext.Provider value={{
      guides,
      bookings,
      appliedCoupon,
      userCoupons,
      selectedGuide,
      currentBooking,
      searchGuides,
      createBooking,
      updateBookingStatus,
      applyCoupon,
      removeCoupon,
      calculatePrice,
      setSelectedGuide,
      setCurrentBooking
    }}>
      {children}
    </AppContext.Provider>
  );
}
