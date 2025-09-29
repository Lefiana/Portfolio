// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';

// Environment variables
const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASS;

if (!user || !pass) {
    console.error("Missing GMAIL_USER or GMAIL_PASS environment variables.");
    // Early exit: Don't create transporter if creds missing
    // (In production, this could return a 500 on POST, but for now, log and fail gracefully)
}

let transporter: nodemailer.Transporter;
try {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user,
            pass,
        },
    });

    // Optional: Verify transporter on startup (logs to console)
    transporter.verify((error, success) => {
        if (error) {
            console.error("Transporter verification failed:", error);
        } else {
            console.log("Email transporter ready");
        }
    });
} catch (error) {
    console.error("Failed to create email transporter:", error);
}

export async function POST(req: NextRequest) {
    // If transporter not created, fail early
    if (!transporter) {
        return NextResponse.json(
            { message: "Email service unavailable. Please try again later." },
            { status: 503 }
        );
    }

    try {
        const { name, email, message } = await req.json();

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { message: "Name, email, and message are all required." },
                { status: 400 }
            );
        }

        // Email format validation (basic regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        // Optional: Rate limiting (pseudo-code; implement with a cache like Redis)
        // const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
        // if (await isRateLimited(clientIP)) {
        //     return NextResponse.json({ message: "Too many requests. Try again later." }, { status: 429 });
        // }

        // Send the email
        await transporter.sendMail({
            from: `"Portfolio Contact" <${user}>`,  // Nicer sender name
            to: user,
            subject: `New Contact Form Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
            `,
        });

        return NextResponse.json(
            { message: "Message sent successfully! I'll get back to you soon." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        
        // More specific error handling
        if (error instanceof Error && 'code' in error && error.code === 'EAUTH') {
            return NextResponse.json(
                { message: "Authentication failed. Check email credentials." },
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            { message: "Failed to send message. Please try again." },
            { status: 500 }
        );
    }
}
