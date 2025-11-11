import { NextRequest, NextResponse } from 'next/server';

// Store recent submissions in memory (or use Redis in production)
const submissionStore = new Map<string, number[]>();

// Disposable email domains list (common ones)
const disposableDomains = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'mohmal.com',
  'yopmail.com', 'sharklasers.com', 'grr.la', 'guerrillamailblock.com',
  'pokemail.net', 'spam4.me', 'bccto.me', 'chacuo.net',
];

export async function POST(request: NextRequest) {
  try {
    const { email, message } = await request.json();
    
    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Rate limiting by IP
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    const ipSubmissions = submissionStore.get(ip) || [];
    const recentSubmissions = ipSubmissions.filter(time => time > oneHourAgo);
    
    if (recentSubmissions.length >= 3) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Basic spam detection
    const spamPatterns = [
      /http[s]?:\/\//gi, // URLs
      /(free|click here|buy now|limited time|act now|urgent|winner|prize)/gi,
      /[A-Z]{10,}/g, // ALL CAPS
      /(.)\1{5,}/g, // Repeated characters
    ];

    if (spamPatterns.some(pattern => pattern.test(message))) {
      return NextResponse.json(
        { error: 'Message contains suspicious content.' },
        { status: 400 }
      );
    }

    // Email domain validation
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (!emailDomain) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }
    
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Disposable email addresses are not allowed.' },
        { status: 400 }
      );
    }

    // Record submission
    recentSubmissions.push(now);
    submissionStore.set(ip, recentSubmissions);

    // Clean old entries periodically (10% chance to clean on each request)
    if (Math.random() < 0.1) {
      for (const [key, times] of submissionStore.entries()) {
        const filtered = times.filter(time => time > oneHourAgo);
        if (filtered.length === 0) {
          submissionStore.delete(key);
        } else {
          submissionStore.set(key, filtered);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ERROR] Validation failed:', error);
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
}

