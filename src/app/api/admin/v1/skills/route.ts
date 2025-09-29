// app/api/admin/v1/skills/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/authmiddleware";

export async function POST(req: NextRequest) {
    
    // --- 1. AUTHENTICATION (Reusable middleware) ---
    const authResult = requireAuth(req);
    if ('error' in authResult) {
        return authResult.error;
    }

    const { userId } = authResult; // Safely extracted from middleware
    // --- 2. Validation and Destructuring (Skill Fields) ---
    const { 
        skill_name, 
        category, 
        priority 
    } = await req.json(); // Use req.json() to parse the body
    
    if (!skill_name) {
        return NextResponse.json({ error: "Skill name is required." }, { status: 400 });
    }

    // --- 3. Database Insertion ---
    try {
        
        const insertQuery = `
            INSERT INTO skills (
                user_id, skill_name, category, priority
            ) VALUES (
                $1, $2, $3, $4
            ) RETURNING id;
        `;
        
        const insertValues = [
            userId,
            skill_name,
            category || null,
            priority || 0
        ];

        const result = await pool.query(insertQuery, insertValues);
        
        return NextResponse.json({ 
            ok: true, 
            message: "Skill created successfully",
            skillId: result.rows[0].id
        }, { status: 201 });
        
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during skill creation" }, { status: 500 });
    }
}