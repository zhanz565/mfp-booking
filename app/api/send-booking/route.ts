import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

// 1. Define the shape of the incoming data for TypeScript
interface BookingRequest {
  customer: {
    name: string;
    phone: string;
  };
  vehicle: {
    year: string;
    make: string;
    model: string;
  };
  services: string[];
  date: string;
  slot: string;
}

export async function POST(req: Request) {
  try {
    const data: BookingRequest = await req.json();

    // 2. SAVE TO SUPABASE
    const { error: dbError } = await supabase
      .from('appointments')
      .insert([
        {
          customer_name: data.customer.name,
          customer_phone: data.customer.phone,
          vehicle_year: data.vehicle.year,
          vehicle_make: data.vehicle.make,
          vehicle_model: data.vehicle.model,
          services: data.services,
          appointment_date: data.date,
          time_slot: data.slot,
          status: 'pending'
        }
      ]);

    // CHECK FOR RACE CONDITION (Duplicate Booking)
    if (dbError) {
      // PostgREST error code '23505' means Unique Constraint Violation
      if (dbError.code === '23505') {
        return NextResponse.json(
          { error: 'This time slot was just taken by another customer.' },
          { status: 409 }
        );
      }
      console.error('Database Error:', dbError);
      throw new Error('Failed to save to database');
    }

    // 3. CONFIGURE NODEMAILER
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC' // Ensures the date doesn't shift due to local server time
    });

    // 4. SEND THE EMAIL
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.FRONTDESK_EMAIL,
      subject: `New Booking Request: ${data.customer.name} (${data.vehicle.make})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1e293b; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">New Appointment Request</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">MFP Auto Service Website</p>
          </div>
          
          <div style="padding: 20px; background-color: #f8fafc;">
            <h3 style="border-bottom: 2px solid #cbd5e1; padding-bottom: 5px;">Customer Details</h3>
            <p><strong>Name:</strong> ${data.customer.name}</p>
            <p><strong>Phone:</strong> ${data.customer.phone}</p>

            <h3 style="border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 20px;">Vehicle Details</h3>
            <p><strong>Year:</strong> ${data.vehicle.year}</p>
            <p><strong>Make & Model:</strong> ${data.vehicle.make} ${data.vehicle.model}</p>

            <h3 style="border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 20px;">Service Requested</h3>
            <p><strong>Services:</strong> ${data.services.join(', ')}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time Slot:</strong> ${data.slot}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Booking saved and email sent' });
    
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}