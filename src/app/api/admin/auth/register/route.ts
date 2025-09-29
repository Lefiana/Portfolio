import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        // 1. Parse JSON body from NextRequest
        const { email, password } = await req.json();

        // 2. Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and Password Required" }, 
                { status: 400 }
            );
        }

        // 3. Hash password and insert into database
        const hashed = bcrypt.hashSync(password, 10);
        
        const result = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id",
            [email, hashed]
        );

        // Check if an insertion actually occurred (for ON CONFLICT DO NOTHING)
        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "User already exists or conflict occurred" },
                { status: 409 } // Conflict
            );
        }
        
        // 4. Success response
        return NextResponse.json({ ok: true, message: "User registered successfully" }, { status: 201 });
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json({ error: "Server error during registration" }, { status: 500 });
    }
}
