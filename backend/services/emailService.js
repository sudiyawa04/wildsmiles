const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const templates = {
  'verify-email': (data) => ({
    subject: 'WildSmiles — Please verify your email',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;">
        <div style="background:#fff;border-radius:12px;padding:40px;box-shadow:0 2px 10px rgba(0,0,0,.08);">
          <h1 style="color:#f5960f;margin-top:0;">Welcome to WildSmiles, ${data.name}! 🦁</h1>
          <p style="color:#555;font-size:16px;line-height:1.6;">
            Thank you for joining the WildSmiles family. Please verify your email to unlock all features.
          </p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${data.link}" style="background:#f5960f;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;">
              Verify My Email
            </a>
          </div>
          <p style="color:#999;font-size:14px;">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
        </div>
      </div>`,
  }),

  'reset-password': (data) => ({
    subject: 'WildSmiles — Password Reset Request',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;">
        <div style="background:#fff;border-radius:12px;padding:40px;">
          <h2 style="color:#f5960f;">Password Reset Request</h2>
          <p style="color:#555;">Hello ${data.name}, click the button below to reset your password.</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${data.link}" style="background:#f5960f;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">
              Reset Password
            </a>
          </div>
          <p style="color:#999;font-size:14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      </div>`,
  }),

  'booking-confirmation': (data) => ({
    subject: `WildSmiles — Booking Confirmed! Ref: ${data.booking_ref}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;">
        <div style="background:#fff;border-radius:12px;padding:40px;">
          <h2 style="color:#f5960f;">🎉 Booking Confirmed!</h2>
          <p>Hello ${data.name}, your adventure is booked!</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#777;">Booking Ref</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${data.booking_ref}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#777;">Tour</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.tour_title}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#777;">Date</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.tour_date}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#777;">Travelers</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.adults} adults${data.children > 0 ? `, ${data.children} children` : ''}</td></tr>
            <tr><td style="padding:8px;color:#777;">Total</td><td style="padding:8px;font-weight:bold;color:#f5960f;">$${data.total}</td></tr>
          </table>
          <p style="color:#555;">We will send your full travel details 48 hours before departure. Get ready for an unforgettable adventure!</p>
        </div>
      </div>`,
  }),
};

const sendEmail = async ({ to, subject, template, data, html }) => {
  const content = template && templates[template]
    ? templates[template](data)
    : { subject, html };

  return transporter.sendMail({
    from:    `"${process.env.FROM_NAME || 'WildSmiles'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject: content.subject || subject,
    html:    content.html || html,
  });
};

module.exports = { sendEmail };
