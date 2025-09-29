// app/api/admin/v1/skills/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth"; 

export async function POST(req: NextRequest) {
    
    // -------------------------------------------------------------------------
    // 1. Authentication Check (Combined with token verification)
    // -------------------------------------------------------------------------
    const auth = req.headers.get("authorization");
    if (!auth) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ error: "Invalid token or not authorized" }, { status: 401 });
    }
    
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
        const userId = (decoded as any).id;
        
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