'use client';

import { useBookingStore } from '@/store/useBookingStore';
import ServiceStep from '@/components/booking/ServiceStep';
import DateTimeStep from '@/components/booking/DateTimeStep';
import ContactStep from '@/components/booking/ContactStep';
import SuccessStep from '@/components/booking/SuccessStep';
import ShopContact from '@/components/booking/ShopContact';

export default function BookingPage() {
  const { data } = useBookingStore();

  const renderStep = () => {
    switch (data.step) {
      case 1:
        return <ServiceStep />;
      case 2:
        return <DateTimeStep />;
      case 3:
        return <ContactStep />;
      case 4:
        return <SuccessStep />;
      default:
        return <ServiceStep />;
    }
  };

  return (
    <main className="min-h-screen bg-white py-6 px-4 md:py-10">
      <div className="max-w-xl mx-auto">
        
        {/* NEW: Interactive Shop Contact Card */}
        <ShopContact />
        
        {/* FIXED: Dynamic Progress Bar (Hidden on Success Step) */}
        {data.step < 4 && (
          <div className="flex gap-2 mb-8" aria-label="Progress">
            {/* Step 1 Indicator */}
            <div className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              data.step >= 1 ? 'bg-blue-600' : 'bg-slate-200'
            }`} />
            
            {/* Step 2 Indicator */}
            <div className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              data.step >= 2 ? 'bg-blue-600' : 'bg-slate-200'
            }`} />
            
            {/* Step 3 Indicator */}
            <div className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              data.step >= 3 ? 'bg-blue-600' : 'bg-slate-200'
            }`} />
          </div>
        )}

        {/* Dynamic Form Step */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
          {renderStep()}
        </div>
        
      </div>
    </main>
  );
}