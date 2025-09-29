// pages/api/admin/v1/achievements.ts (Admin Write)

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth"; // Used for POST authentication

export async function POST(req: NextRequest) {

    // --- 1. Authentication Check ---
    const auth = req.headers.get("authorization");
    if (!auth) {
        return NextResponse.json( {error: "Authentication required" }, { status: 401 });
    }
    
    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ error: "Invalid token or not authorized" }, { status: 401 });
    }
    // --- 2. Validation ---
    const { title, issuer, date, credential_url, image_url } = await req.json();
    if (!title || !date) return NextResponse.json({ error: "Title and date required" });

    // --- 3. Database Insertion ---
    try {
        const userId = (decoded as any).id; 

        await pool.query(
            "INSERT INTO certificates (user_id, title, issuer, date, credential_url, image_url) VALUES ($1, $2, $3, $4, $5, $6)",
            [userId, title, issuer || null, date, credential_url || null, image_url || null] // Array of parameters
        );
        
        return NextResponse.json({ ok: true, message: "Achievement created successfully" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during creation" });
    }
}