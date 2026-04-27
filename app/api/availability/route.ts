import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    // Get the requested date from the URL (e.g., ?date=2026-04-27)
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // We use .eq() because 'appointment_date' is a Date type column.
    // This will return all rows that match the specific YYYY-MM-DD string.
    const { data, error } = await supabase
      .from('appointments')
      .select('time_slot')
      .eq('appointment_date', date);

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
    }

    // Transform data from [{time_slot: "9:00 AM"}] to ["9:00 AM"]
    const bookedSlots = data.map(appointment => appointment.time_slot);

    return NextResponse.json({ bookedSlots });
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}