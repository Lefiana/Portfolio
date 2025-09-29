import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
// Using the centralized middleware now
import { requireAuth } from "@/lib/authmiddleware"; 

export async function POST(req: NextRequest) {

    // 1. AUTHENTICATION (Reusable middleware)
    const authResult = requireAuth(req); 
    
    if ('error' in authResult) {
        return authResult.error;
    }
    
    const { userId } = authResult; // Safely extracted from middleware

    // 2. Validation
    const { title, issuer, date, credential_url, image_url } = await req.json();
    
    // Return status 400 for bad request validation failure
    if (!title || !date) {
        return NextResponse.json({ error: "Title and date required" }, { status: 400 });
    }

    // 3. Database Insertion
    try {
        await pool.query(
            "INSERT INTO certificates (user_id, title, issuer, date, credential_url, image_url) VALUES ($1, $2, $3, $4, $5, $6)",
            [userId, title, issuer || null, date, credential_url || null, image_url || null] // Array of parameters
        );
        
        // Return 201 status code for successful creation
        return NextResponse.json({ ok: true, message: "Achievement created successfully" }, { status: 201 });
    } catch (err) {
        console.error(err);
        // Return 500 status code for server error
        return NextResponse.json({ error: "Server error during creation" }, { status: 500 });
    }
}
