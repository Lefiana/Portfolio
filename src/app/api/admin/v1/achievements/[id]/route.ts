// pages/api/admin/v1/achievements/[id].ts (Admin Read/Update/Delete)

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";


// Middleware to handle authentication and ID validation
const authenticateAndValidate = async (req: NextRequest, params: Promise<{ id: string }>) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // --- Authentication ---
    const auth = req.headers.get("authorization");
    if (!auth) {
        return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
    }
    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return { error: NextResponse.json({ error: "Invalid token or not authorized" }, { status: 401 }) };
    }
    const userId = (decoded as any).id;

    // --- ID Validation ---
    if (!id) {
        return { error: NextResponse.json({ error: "Invalid or missing Achievement ID." }, { status: 400 }) };
    }

    return { userId, id };
};

// GET single
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;
    
    try {
        const result = await pool.query(
            "SELECT id, title, issuer, date, credential_url, image_url FROM certificates WHERE id = $1 AND user_id = $2",  // Added image_url
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
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;

    const { title, issuer, date, credential_url, image_url } = await req.json();  // Added image_url

    if (!title && !issuer && !date && !credential_url && !image_url) {  // Added image_url to check
        return NextResponse.json({ error: "At least one field is required for update." }, { status: 400 });
    }

    try {
        const updateQuery = `
            UPDATE certificates SET
                title = COALESCE($3, title),
                issuer = COALESCE($4, issuer),
                date = COALESCE($5, date),
                credential_url = COALESCE($6, credential_url),
                image_url = COALESCE($7, image_url),  -- Added image_url
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
            image_url || null  // Added image_url param
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
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;

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
