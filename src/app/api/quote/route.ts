import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

const notificationRecipient = 'rnbdigitals@gmail.com';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

async function sendInquiryNotification(inquiry: Record<string, unknown>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn('Inquiry email not sent: configure RESEND_API_KEY and RESEND_FROM_EMAIL.');
    return false;
  }

  const name = String(inquiry.name || 'Website visitor');
  const email = String(inquiry.email || 'Not provided');
  const phone = String(inquiry.phone || 'Not provided');
  const service = String(inquiry.service || 'General inquiry');
  const quantity = String(inquiry.quantity || 'Not provided');
  const estimatedTotal = String(inquiry.estimatedTotal || 'Not provided');
  const message = String(inquiry.message || 'No additional details provided.');
  const fields = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Service', service],
    ['Quantity / Size', quantity],
    ['Estimated total', estimatedTotal],
    ['Message', message],
  ] as const;
  const text = fields.map(([label, value]) => `${label}: ${value}`).join('\n\n');
  const html = fields
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`)
    .join('');
  const validReplyAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [notificationRecipient],
        subject: `New website inquiry: ${service}`,
        text,
        html,
        ...(validReplyAddress ? { reply_to: validReplyAddress } : {}),
      }),
    });

    if (!response.ok) {
      console.error('Inquiry email delivery failed:', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Inquiry email delivery error:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, phone, service, message, quantity, estimatedTotal } = body;

    // Server-side validation
    if (!String(name || '').trim() || !String(phone || '').trim()) {
      return NextResponse.json(
        { error: 'Name and phone number are required.' },
        { status: 400 }
      );
    }

    let savedInquiry = null;
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('quote_inquiries')
        .upsert({
          id: id || crypto.randomUUID(),
          name: String(name).trim(),
          email: email || null,
          phone: String(phone).trim(),
          service: service || null,
          quantity: quantity ? String(quantity) : null,
          estimated_total: estimatedTotal ? String(estimatedTotal) : null,
          message: message || null,
          status: 'pending',
        })
        .select()
        .single();
      if (error) {
        console.error('Quote inquiry database save failed:', error);
      } else {
        savedInquiry = data;
      }
    }

    const emailSent = await sendInquiryNotification({
      name,
      email,
      phone,
      service,
      message,
      quantity,
      estimatedTotal,
    });

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
        stored: Boolean(savedInquiry),
        inquiry: savedInquiry,
        emailSent,
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
