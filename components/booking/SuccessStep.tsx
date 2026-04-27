'use client';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";

export default function SuccessStep() {
  const { reset } = useBookingStore();

  return (
    <div className="text-center py-10 space-y-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-20 w-20 text-green-500" />
      </div>
      <h2 className="text-3xl font-bold">Appointment Requested!</h2>
      <p className="text-slate-600 max-w-xs mx-auto">
        We've received your request for MFP Auto Service. We'll text you shortly to confirm.
      </p>
      <Button 
        variant="outline" 
        onClick={() => {
          reset();
          window.location.reload(); // Hard reset to start fresh
        }}
      >
        Book Another Vehicle
      </Button>
    </div>
  );
}