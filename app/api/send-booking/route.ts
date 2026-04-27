import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase'; // Import our new database connection

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. SAVE TO SUPABASE FIRST
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
          // 'status' and 'created_at' will auto-fill based on our SQL setup!
        }
      ]);

    if (dbError) {
      console.error('Database Error:', dbError);
      throw new Error('Failed to save to database');
    }

    // 2. CONFIGURE NODEMAILER (Same as before)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    // 3. SEND THE EMAIL (Same as before)
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

    // 4. RETURN SUCCESS
    return NextResponse.json({ success: true, message: 'Booking saved and email sent' });
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}