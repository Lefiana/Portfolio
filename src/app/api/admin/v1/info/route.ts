// app/api/admin/v1/info/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth"; 

export async function PUT(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (!auth) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ error: "Invalid token or not authorized" }, { status: 401 });
    }

    const { name, tagline, long_bio, photo_url, contact_email, linkedin_url, github_url, resume_url } = await req.json();
    
    if (!name && !tagline && !contact_email) {
        // Return 400 Bad Request since no data was provided
        return NextResponse.json({ error: "At least one field is required for update." }, { status: 400 });
    }
    
    try {
        const userId = (decoded as any).id;
        
        // --- STEP 1: Try to UPDATE the existing row ---
        const updateQuery = `
            UPDATE personal_info SET
                name = COALESCE($2, name),
                tagline = COALESCE($3, tagline),
                long_bio = COALESCE($4, long_bio),
                photo_url = COALESCE($5, photo_url),
                contact_email = COALESCE($6, contact_email),
                linkedin_url = COALESCE($7, linkedin_url),
                github_url = COALESCE($8, github_url),
                resume_url = COALESCE($9, resume_url),
                updated_at = NOW()
            WHERE user_id = $1
            RETURNING *;
        `;
        
        const updateValues = [
            userId, 
            name || null, 
            tagline || null, 
            long_bio || null, 
            photo_url || null, 
            contact_email || null,
            linkedin_url || null, 
            github_url || null, 
            resume_url || null
        ];

        const updateResult = await pool.query(updateQuery, updateValues);
        
        // --- STEP 2: If UPDATE failed (no row found), then INSERT a new row ---
        if (updateResult.rowCount === 0) {
            const insertQuery = `
                INSERT INTO personal_info (
                    user_id, name, tagline, long_bio, photo_url, contact_email, linkedin_url, github_url, resume_url
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9
                ) RETURNING *;
            `;
            const insertValues = updateValues; // The values are the same
            await pool.query(insertQuery, insertValues);

            return NextResponse.json({ ok: true, message: "Personal info created successfully" }, { status: 201 });
        }

        // --- STEP 3: If UPDATE succeeded, return a success response ---
        return NextResponse.json({ ok: true, message: "Personal info updated successfully" }, { status: 200 });
        
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during upsert" }, { status: 500 });
    }
}