import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.SENDER,
        pass: process.env.PASSWORD,
      },
      secure: true,
    });

    // Email to your inbox
    const adminMailData = {
      from: process.env.SENDER,
      to: process.env.TO, // Replace with your email
      subject: `New Contact Form Submission`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Message:</strong> ${body.message}</p>
      `,
    };

    // Confirmation email to user
    const userMailData = {
      from: process.env.SENDER,
      to: body.email,
      subject: `Thank You for Reaching Out`,
      html: `
        <h3>Hi ${body.name},</h3>
        <p>Thank you for contacting us. We have received your message and will get back to you soon.</p>
        <p><strong>Your Message:</strong></p>
        <blockquote>${body.message}</blockquote>
        <p>Best Regards,<br>Khizar Ali</p>
      `,
    };

    // Send emails
    await transporter.sendMail(adminMailData);
    await transporter.sendMail(userMailData);

    return NextResponse.json({ success: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { error: "Error sending emails" },
      { status: 500 }
    );
  }
}
