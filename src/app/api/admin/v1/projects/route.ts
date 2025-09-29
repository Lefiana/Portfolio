// pages/api/admin/v1/projects.ts

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

    // --- 3. Validation and Destructuring (Project Fields) ---
    const { 
        title, 
        description, 
        image_url, 
        technologies, 
        github_url, 
        live_url,
        is_featured, // Added for Projects
        priority     // Added for Projects
    } = await req.json();
    
    // Basic requirement for a new project
    if (!title || !description || !technologies) {
        return NextResponse.json({ error: "Title, description, and technologies are required." });
    }
    
    // Ensure technologies is an array (required for PostgreSQL TEXT[] type)
    if (!Array.isArray(technologies)) {
        return NextResponse.json({ error: "Technologies must be an array of strings." });
    }

    // --- 4. Database Insertion ---
    try {
        
        // SQL query to insert a new project into the 'projects' table
        const insertQuery = `
            INSERT INTO projects (
                user_id, title, description, image_url, technologies, github_url, live_url, is_featured, priority
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9
            ) RETURNING id;
        `;
        
        const insertValues = [
            userId,
            title,
            description,
            image_url || null,
            technologies, // Will be cast to TEXT[] by PostgreSQL driver
            github_url || null,
            live_url || null,
            is_featured || false, // Default to false if not provided
            priority || 0         // Default to 0 if not provided
        ];

        const result = await pool.query(insertQuery, insertValues);
        
        // Return the ID of the newly created project
        return NextResponse.json({ 
            ok: true, 
            message: "Project created successfully",
            projectId: result.rows[0].id
        });
        
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during project creation" });
    }
}