import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,       // smtp.gmail.com
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,                      // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App password
    },
  });
};

// Email template for admin notification
const createAdminEmailTemplate = (formData) => {
  const { name, email, subject, message, type } = formData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
        .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; border-left: 4px solid #10B981; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6B7280; margin-left: 10px; }
        .message-box { background: white; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb; margin-top: 15px; }
        .badge { display: inline-block; padding: 4px 12px; background: #10B981; color: white; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🛒 GoCart Plus - New Contact Form Submission</h2>
          <p>You have received a new message from your website contact form.</p>
        </div>
        
        <div class="content">
          <div class="info-row">
            <span class="label">📝 Inquiry Type:</span>
            <span class="badge">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
          
          <div class="info-row">
            <span class="label">👤 Name:</span>
            <span class="value">${name}</span>
          </div>
          
          <div class="info-row">
            <span class="label">📧 Email:</span>
            <span class="value">${email}</span>
          </div>
          
          <div class="info-row">
            <span class="label">📋 Subject:</span>
            <span class="value">${subject}</span>
          </div>
          
          <div class="info-row">
            <span class="label">🕒 Received At:</span>
            <span class="value">${new Date().toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          
          <div class="message-box">
            <h4 style="margin-top: 0; color: #374151;">💬 Message:</h4>
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">This email was sent from GoCart Plus contact form</p>
          <small>Reply directly to this email to respond to the customer</small>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email template for customer confirmation
const createCustomerEmailTemplate = (formData) => {
  const { name, type } = formData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting GoCart Plus</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 25px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; }
        .highlight { color: #10B981; font-weight: bold; }
        .info-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 GoCart Plus</h1>
          <h2>Thank You for Contacting Us!</h2>
        </div>
        
        <div class="content">
          <p>Hi <span class="highlight">${name}</span>,</p>
          
          <p>Thank you for reaching out to us regarding your <strong>${type}</strong> inquiry. We have successfully received your message and truly appreciate you taking the time to contact us.</p>
          
          <div class="info-box">
            <h3>⏰ What happens next?</h3>
            <ul>
              <li><strong>Response Time:</strong> We typically respond within 24-48 hours</li>
              <li><strong>Business Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM, Sat 10:00 AM - 4:00 PM (IST)</li>
              <li><strong>Priority Support:</strong> Technical issues and order-related inquiries are given priority</li>
            </ul>
          </div>
          
          <p>In the meantime, you might find these resources helpful:</p>
          <ul>
            <li>📋 <a href="#" style="color: #10B981;">FAQ & Help Center</a></li>
            <li>📦 <a href="#" style="color: #10B981;">Track Your Order</a></li>
            <li>🔄 <a href="#" style="color: #10B981;">Returns & Exchanges</a></li>
            <li>💬 <a href="#" style="color: #10B981;">Live Chat Support</a></li>
          </ul>
          
          <p>If your inquiry is urgent, you can also reach us directly at:</p>
          <p>📞 <strong>+91 80 1234 5678</strong> | 📧 <strong>support@gocartplus.com</strong></p>
        </div>
        
        <div class="footer">
          <p><strong>GoCart Plus Team</strong></p>
          <p>Your trusted multi-vendor marketplace</p>
          <small>123 Tech Street, Bengaluru, Karnataka 560001, India</small>
        </div>
      </div>
    </body>
    </html>
  `;
};

// POST handler for contact form
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, subject, message, type } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();

    // Email options for admin notification
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email to receive notifications
      subject: `🛒 New Contact Form: ${subject}`,
      html: createAdminEmailTemplate({ name, email, subject, message, type }),
      replyTo: email, // Allow admin to reply directly to customer
    };

    // Email options for customer confirmation
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Thank you for contacting GoCart Plus',
      html: createCustomerEmailTemplate({ name, type }),
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    // Log successful submission (you can store in database here too)
    

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);

    // Return appropriate error message
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { error: 'Email authentication failed. Please check email configuration.' },
        { status: 500 }
      );
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Email server connection failed. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET handler (optional - for testing)
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Contact API is running',
      timestamp: new Date().toISOString(),
      timezone: 'Asia/Kolkata'
    },
    { status: 200 }
  );
}