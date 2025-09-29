import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/authmiddleware";


// =========================================================================================
// GET: Fetch a single Skills
// =========================================================================================
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // 1. Get ID from parameters
    const { id } = await params;
    
    // 2. AUTHENTICATION (Reusable middleware)
    const authResult = requireAuth(req); 
    
    // FIX: Use 'in' operator to correctly narrow the type
    if ('error' in authResult) {
        return authResult.error;
    }
    
    const { userId } = authResult; // Now TypeScript knows this property exists
    
    // 3. ID Validation (Route-specific)
    if (!id) {
        return NextResponse.json({ error: "Invalid or missing Achievement ID." }, { status: 400 });
    }

    try {
        const result = await pool.query(
            `SELECT id, skill_name, category, priority FROM skills WHERE id = $1 AND user_id = $2`, [id, userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Skill not found." }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during fetch." }, { status: 500 });
    }
}

// =========================================================================================
// PUT: Update a single Skills
// =========================================================================================
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // 1. Get ID from parameters
    const { id } = await params;
    
    // 2. AUTHENTICATION (Reusable middleware)
    const authResult = requireAuth(req); 
    
    // FIX: Use 'in' operator to correctly narrow the type
    if ('error' in authResult) {
        return authResult.error;
    }
    
    const { userId } = authResult; // Now TypeScript knows this property exists
    
    // 3. ID Validation (Route-specific)
    if (!id) {
        return NextResponse.json({ error: "Invalid or missing Achievement ID." }, { status: 400 });
    }

    const { skill_name, category, priority } = await req.json();

    if (skill_name === undefined && category === undefined && priority === undefined) {
        return NextResponse.json({ error: "At least one field is required for update." }, { status: 400 });
    }

    try {
        const updateQuery = `
            UPDATE skills SET
                skill_name = COALESCE($3, skill_name),
                category = COALESCE($4, category),
                priority = COALESCE($5, priority),
                updated_at = NOW()
            WHERE id = $1 AND user_id = $2
            RETURNING id;
            `;
            
        const updateValues = [
            id, 
            userId, 
            skill_name !== undefined ? skill_name : null, 
            category !== undefined ? category : null, 
            priority !== undefined ? priority : null 
        ];
            
        const result = await pool.query(updateQuery, updateValues);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Skill not found or unauthorized." }, { status: 404 });
        }
        
        // ✨ Add a successful response here
        return NextResponse.json({ ok: true, message: `Skill ${id} updated successfully.` });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during update." }, { status: 500 });
    }
}

// =========================================================================================
// DELETE: Delete a single Skills
// =========================================================================================
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // 1. Get ID from parameters
    const { id } = await params;
    
    // 2. AUTHENTICATION (Reusable middleware)
    const authResult = requireAuth(req); 
    
    // FIX: Use 'in' operator to correctly narrow the type
    if ('error' in authResult) {
        return authResult.error;
    }
    
    const { userId } = authResult; // Now TypeScript knows this property exists
    
    // 3. ID Validation (Route-specific)
    if (!id) {
        return NextResponse.json({ error: "Invalid or missing Achievement ID." }, { status: 400 });
    }

    try {   
        const result = await pool.query(
            "DELETE FROM skills WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Skill not found or unauthorized." }, { status: 404 });
        }
        
        return NextResponse.json({ ok: true, message: `Skill ${id} deleted successfully.` });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during deletion." }, { status: 500 });
    }
}