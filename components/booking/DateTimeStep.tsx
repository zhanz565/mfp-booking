'use client';

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBookingStore } from "@/store/useBookingStore";

// Updated list with 30-minute intervals
const TIME_SLOTS = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

export default function DateTimeStep() {
  const { data, updateData, setStep } = useBookingStore();
  const [date, setDate] = useState<Date | undefined>(
    data.date ? new Date(data.date) : undefined
  );

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    async function fetchAvailability() {
      if (!date) return;

      setIsLoadingSlots(true);
      setBookedSlots([]); 
      
      if (data.slot) updateData({ slot: "" });

      try {
        const dateString = format(date, 'yyyy-MM-dd');
        const response = await fetch(`/api/availability?date=${dateString}`);

        if (response.ok) {
          const result = await response.json();
          setBookedSlots(result.bookedSlots); 
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      } finally {
        setIsLoadingSlots(false);
      }
    }

    fetchAvailability();
  }, [date]); 

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateData({ date: selectedDate.toISOString() });
    }
  };

  return (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Select Date & Time</h2>
        <p className="text-sm text-slate-500 mt-1">When would you like to bring your vehicle in?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-12 bg-white",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => {
                   const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                   const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                   return isPast || isWeekend;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {date && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">Available Times</label>
              {isLoadingSlots && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            </div>

            {/* Changed to grid-cols-2 (mobile) and grid-cols-3 (desktop) for better density */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);

                return (
                  <Button
                    key={slot}
                    variant={data.slot === slot ? "default" : "outline"}
                    className={cn(
                      "h-12 transition-all text-sm",
                      data.slot === slot ? "bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-600 ring-offset-2" : "bg-white hover:bg-slate-50",
                      isBooked && "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-100"
                    )}
                    onClick={() => !isBooked && updateData({ slot })}
                    disabled={isBooked || isLoadingSlots}
                  >
                    {isBooked ? "Booked" : slot}
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4 mt-8 border-t border-slate-100">
        <Button variant="outline" className="flex-1 h-12 font-semibold" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button
          className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold disabled:opacity-50"
          disabled={!data.date || !data.slot}
          onClick={() => setStep(3)}
        >
          Next: Vehicle Details
        </Button>
      </div>
    </section>
  );
}