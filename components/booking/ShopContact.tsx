'use client';

import { useState } from 'react';
import Image from 'next/image'; 
import { ChevronDown, ChevronUp, Phone, Mail, MapPin, Globe } from 'lucide-react'; 
import { Button } from '@/components/ui/button';

export default function ShopContact() {
  const [isExpanded, setIsExpanded] = useState(false);

  const shopData = {
    name: "MFP Auto Service",
    phone: "(905) 906-5555",
    phoneLink: "tel:9059065555",
    email: "frontdesk@mfpauto.com", 
    website: "https://mfpauto.com",
    address: "1161 Pettit Rd",
    city: "Burlington, ON L7P 2K3",
  };

  return (
    <div className="mb-8">
      {/* Flush-Left Header Area */}
      <div 
        className="flex items-center justify-between cursor-pointer group transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          
          {/* FIXED: Rectangular Logo Container */}
          <div className="relative h-12 w-32 shrink-0">
            <Image 
              src="/mfp-logo-white.png" 
              alt="MFP Auto Service Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <div className="text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{shopData.name}</h1>
            <a 
              href={shopData.phoneLink} 
              className="text-blue-600 font-medium hover:underline text-sm"
              onClick={(e) => e.stopPropagation()} 
            >
              {shopData.phone}
            </a>
          </div>
        </div>
        
        {/* Subtle Dropdown Icon */}
        <div className="text-slate-400 group-hover:text-slate-700 transition-colors p-2 hover:bg-slate-200/50 rounded-full">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>

      {/* Expandable Details Dropdown Card */}
      {isExpanded && (
        <div className="mt-6 p-5 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            
            {/* Contact Info */}
            <div className="space-y-2 text-slate-600">
              <p className="font-semibold text-slate-900">{shopData.name}</p>
              <p>{shopData.phone}</p>
              <p>{shopData.email}</p>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <a href={shopData.website} className="text-blue-600 hover:underline">
                  {shopData.website}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 text-slate-600 pt-2 border-t border-slate-100">
              <MapPin className="w-4 h-4 mt-3 shrink-0 text-slate-400" />
              <div className="pt-2">
                <p>{shopData.address}</p>
                <p>{shopData.city}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1 bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold" asChild>
                <a href={shopData.phoneLink}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </Button>
              <Button variant="secondary" className="flex-1 bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold" asChild>
                <a href={`mailto:${shopData.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </Button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}