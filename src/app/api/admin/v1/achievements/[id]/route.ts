import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // <-- ADDED: Need this for database queries
import { requireAuth } from "@/lib/authmiddleware"; // <-- Corrected path/function name usage

// GET single
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
            "SELECT id, title, issuer, date, credential_url, image_url FROM certificates WHERE id = $1 AND user_id = $2",  
            [id, userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Achievement not found." }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during fetch." }, { status: 500 });
    }
}

// PUT SINGLE
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

    const { title, issuer, date, credential_url, image_url } = await req.json();

    if (!title && !issuer && !date && !credential_url && !image_url) {
        return NextResponse.json({ error: "At least one field is required for update." }, { status: 400 });
    }

    try {
        const updateQuery = `
            UPDATE certificates SET
                title = COALESCE($3, title),
                issuer = COALESCE($4, issuer),
                date = COALESCE($5, date),
                credential_url = COALESCE($6, credential_url),
                image_url = COALESCE($7, image_url),  
                updated_at = NOW()
            WHERE id = $1 AND user_id = $2
            RETURNING id;
        `;
        
        const updateValues = [
            id, userId, 
            title || null, 
            issuer || null, 
            date || null, 
            credential_url || null,
            image_url || null
        ];
        
        const result = await pool.query(updateQuery, updateValues);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Achievement not found or unauthorized." }, { status: 404 });
        }
        return NextResponse.json({ ok: true, message: `Achievement ${id} updated successfully.` });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during update." }, { status: 500 });
    }
}

// DELETE SINGLE
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
            "DELETE FROM certificates WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Achievement not found or unauthorized." }, { status: 404 });
        }
        return NextResponse.json({ ok: true, message: `Achievement ${id} deleted successfully.` });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during deletion." }, { status: 500 });
    }
}
