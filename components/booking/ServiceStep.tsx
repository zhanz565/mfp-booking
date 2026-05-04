'use client';

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/useBookingStore";
import { MessageSquare } from "lucide-react"; // NEW: Icon for the chat bubble

const SERVICES = [
  "Oil Change", 
  "General Diagnostic",
  "Tires", 
  "4 Wheel Alignment & Balancing",
  "Air Conditioning / Heating",
  "Noise Inspection",
  "Electrical Diagnostic",
  "Brakes",
  "Not Starting",
  "Warning Light on Dash",
  "Scheduled Maintenance",
  "Detailing"
] as const; 

export default function ServiceStep() {
  const { data, updateData, setStep } = useBookingStore();
  
  // Look to see if they already typed a custom issue (in case they hit "Back" from Step 2)
  const existingCustom = data.services.find(s => s.startsWith("Custom Issue: "));
  
  // Local state to manage the custom text and which "screen" they are looking at
  const [customText, setCustomText] = useState(existingCustom ? existingCustom.replace("Custom Issue: ", "") : "");
  const [mode, setMode] = useState<'list' | 'custom'>('list');

  const toggleService = (service: string) => {
    const currentServices = data.services;
    const newServices = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];
      
    updateData({ services: newServices });
  };

  const handleNext = () => {
    // 1. Keep only the standard checkbox services they selected
    const standardServices = data.services.filter(s => SERVICES.includes(s as any));

    // 2. Add their custom typed issue to the array if it exists
    if (customText.trim().length > 0) {
      standardServices.push(`Custom Issue: ${customText.trim()}`);
    }

    // 3. Save to Zustand and go to the next step
    updateData({ services: standardServices });
    setStep(2);
  };

  // Check if they selected a checkbox OR typed a custom issue so we can light up the Next button
  const hasSelection = data.services.filter(s => SERVICES.includes(s as any)).length > 0 || customText.trim().length > 0;

  // ==========================================
  // VIEW 2: THE CUSTOM ISSUE TEXTAREA
  // ==========================================
  if (mode === 'custom') {
    return (
      <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Select Service</h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 block">
            Describe the issue or service you're interested in. <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full min-h-[200px] p-4 border border-red-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all shadow-sm"
            placeholder="Enter text..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Button 
            variant="outline" 
            className="flex-1 h-12 font-semibold" 
            onClick={() => setMode('list')}
          >
            Back to List
          </Button>
          <Button 
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors disabled:opacity-50" 
            disabled={customText.trim().length === 0}
            onClick={handleNext}
          >
            Next: Date & Time
          </Button>
        </div>
      </section>
    );
  }

  // ==========================================
  // VIEW 1: THE STANDARD LIST VIEW
  // ==========================================
  return (
    <section className="space-y-6 animate-in slide-in-from-left-4 duration-300">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Select Services</h2>
        <p className="text-sm text-slate-500 mt-1">What does your vehicle need today?</p>
      </div>

      {/* NEW: Custom Issue Button Block */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Service not listed?</h3>
        <button 
          onClick={() => setMode('custom')}
          className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all shadow-sm text-slate-700"
        >
          <MessageSquare className="w-5 h-5 text-slate-500" />
          <span className="font-medium">Describe your issue</span>
          
          {/* Helpful tag if they already typed something but went back to select more checkboxes */}
          {customText && (
            <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-md">
              Issue Saved
            </span>
          )}
        </button>
      </div>

      {/* Standard Services Block */}
      <div className="space-y-3 pt-2">
        <h3 className="font-semibold text-slate-900">Shop services</h3>
        <div className="grid gap-3 max-h-[35vh] overflow-y-auto pr-2 pb-2">
          {SERVICES.map((serviceName) => (
            <label 
              key={serviceName} 
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                data.services.includes(serviceName) 
                  ? 'border-blue-600 bg-blue-50/50' 
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Checkbox 
                checked={data.services.includes(serviceName)} 
                onCheckedChange={() => toggleService(serviceName)}
              />
              <span className="font-medium text-slate-700">{serviceName}</span>
            </label>
          ))}
        </div>
      </div>

      <Button 
        className="w-full h-12 text-base font-semibold mt-4 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed" 
        size="lg"
        disabled={!hasSelection}
        onClick={handleNext}
      >
        Next: Select Date & Time
      </Button>
    </section>
  );
}