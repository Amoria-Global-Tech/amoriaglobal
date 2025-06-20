// api/contact/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import client from "@/app/api/utils/db";
import { sendContactEmail, sendContactReply} from "../utils/brevo";


// Define types for the contact form data
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Validation function
function validateContactData(data: ContactFormData): string | null {
  // Check required fields
  if (!data.name || data.name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!data.email || !isValidEmail(data.email)) {
    return "Please provide a valid email address";
  }

  if (!data.message || data.message.trim().length < 10) {
    return "Message must be at least 10 characters long";
  }

  // Validate phone if provided
  if (data.phone && data.phone.trim() && !isValidPhone(data.phone)) {
    return "Please provide a valid phone number";
  }

  // Check for reasonable length limits
  if (data.name.length > 100) {
    return "Name is too long (max 100 characters)";
  }

  if (data.email.length > 255) {
    return "Email is too long (max 255 characters)";
  }

  if (data.phone && data.phone.length > 20) {
    return "Phone number is too long (max 20 characters)";
  }

  if (data.message.length > 2000) {
    return "Message is too long (max 2000 characters)";
  }

  return null;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (basic)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

// Handle POST request for contact form submission
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    
    // Validate request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json({
        success: false,
        message: "Invalid request data"
      }, { status: 400 });
    }

    // Extract and sanitize form data
    const formData: ContactFormData = {
      name: sanitizeInput(body.name || ''),
      email: sanitizeInput(body.email || ''),
      phone: body.phone ? sanitizeInput(body.phone) : undefined,
      message: sanitizeInput(body.message || '')
    };

    // Validate the data
    const validationError = validateContactData(formData);
    if (validationError) {
      return NextResponse.json({
        success: false,
        message: validationError
      }, { status: 400 });
    }

    // Check for rate limiting (optional - basic check by IP)
    //const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Check if the same email sent a message in the last 5 minutes
    const recentMessageQuery = `
      SELECT id FROM contact_us
      WHERE email = $1 AND created_at > NOW() - INTERVAL '5 minutes'
      LIMIT 1
    `;
    
    const recentMessages = await client.query(recentMessageQuery, [formData.email]);
    
    if (recentMessages.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Please wait a few minutes before sending another message"
      }, { status: 429 });
    }

    // Insert the contact message into the database
    const insertQuery = `
      INSERT INTO contact_us (name, email, phone_number, message, is_resolved, created_at, updated_at)
      VALUES ($1, $2, $3, $4, false, NOW(), NOW())
      RETURNING id, name, email, phone_number, message, is_resolved, created_at
    `;

    const insertParams = [
      formData.name,
      formData.email,
      formData.phone || null,
      formData.message
    ];

    const result = await client.query(insertQuery, insertParams);
    const newMessage = result.rows[0];

    // Log the submission (optional)
    console.log(`New contact message from ${formData.name} (${formData.email}) at ${new Date().toISOString()}`);

    await sendContactReply(formData.email,  formData.name)
    await sendContactEmail(formData.email, formData.message, formData.name);

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      data: {
        id: newMessage.id,
        createdAt: newMessage.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error processing contact form:", error);
    
    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '42P01') { // Table doesn't exist
        return NextResponse.json({
          success: false,
          message: "Database configuration error. Please contact support."
        }, { status: 500 });
      }
      
      if (error.code === '23505') { // Unique constraint violation (if you have unique constraints)
        return NextResponse.json({
          success: false,
          message: "This message appears to be a duplicate. Please try again later."
        }, { status: 409 });
      }
    }

    return NextResponse.json({
      success: false,
      message: "We're experiencing technical difficulties. Please try again later or contact us directly."
    }, { status: 500 });
  }
}

