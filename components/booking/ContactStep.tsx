'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/useBookingStore";

export default function ContactStep() {
  const { data, updateData, setStep } = useBookingStore();

  // Local state handles the smooth typing experience so the spacebar works
  const [makeModelString, setMakeModelString] = useState(
    `${data.vehicle.make} ${data.vehicle.model}`.trim()
  );

  // Loading state to prevent double-clicks while the email sends
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean, type-safe updaters for nested state (used for single fields like Year)
  const handleVehicleChange = (field: keyof typeof data.vehicle, value: string) => {
    updateData({ vehicle: { ...data.vehicle, [field]: value } });
  };

  const handleCustomerChange = (field: keyof typeof data.customer, value: string) => {
    updateData({ customer: { ...data.customer, [field]: value } });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Send the payload to our secure Next.js API route
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Move to the Success screen if email sent successfully
      setStep(4); 
    } catch (error) {
      console.error("Failed to submit booking:", error);
      alert("There was an issue sending your request. Please try calling the shop directly.");
    } finally {
      setIsSubmitting(false); // Reset button state
    }
  };

  // Smarter, production-ready validation
  const isFormValid = 
    data.customer.name.trim().length > 0 && 
    data.customer.phone.trim().length >= 7 && 
    makeModelString.trim().length > 0 &&      
    data.vehicle.year.trim().length > 0;      

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Vehicle & Contact</h2>
        <p className="text-sm text-slate-500 mt-1">Final details so we can prep for your arrival.</p>
      </div>
      
      <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
        {/* Vehicle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year" className="text-slate-700">Year</Label>
            <Input 
              id="year"
              placeholder="e.g., 2021" 
              value={data.vehicle.year} 
              onChange={(e) => handleVehicleChange('year', e.target.value)} 
              className="bg-white"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="makeModel" className="text-slate-700">Make & Model</Label>
            <Input 
              id="makeModel"
              placeholder="e.g., Honda Civic" 
              value={makeModelString} 
              onChange={(e) => {
                const val = e.target.value;
                setMakeModelString(val); 
                
                const [make, ...modelParts] = val.split(' ');
                
                // THE FIX: Batch the update so 'make' and 'model' save simultaneously
                updateData({
                  vehicle: {
                    ...data.vehicle,
                    make: make || '',
                    model: modelParts.join(' ')
                  }
                });
              }} 
              className="bg-white"
            />
          </div>
        </div>

        {/* Customer Section */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700">Full Name</Label>
            <Input 
              id="fullName"
              placeholder="John Doe" 
              value={data.customer.name} 
              onChange={(e) => handleCustomerChange('name', e.target.value)} 
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
            <Input 
              id="phone"
              type="tel" 
              placeholder="(555) 000-0000" 
              value={data.customer.phone} 
              onChange={(e) => handleCustomerChange('phone', e.target.value)} 
              className="bg-white"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-2">
        <Button variant="outline" className="flex-1 h-12 font-semibold" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button 
          className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={!isFormValid || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Sending..." : "Confirm Appointment"}
        </Button>
      </div>
    </section>
  );
}