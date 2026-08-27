import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message, quantity, estimatedTotal } = body;

    // Server-side validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required.' },
        { status: 400 }
      );
    }

    // Process inquiry / Send notification or store in database
    console.log('Received RnB Digitals Project Inquiry:', {
      name,
      email,
      phone,
      service,
      message,
      quantity,
      estimatedTotal,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your quote request has been received by RnB Digitals.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Quote API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing request.' },
      { status: 500 }
    );
  }
}
