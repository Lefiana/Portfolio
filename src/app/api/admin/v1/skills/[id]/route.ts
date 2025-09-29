import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// Middleware to handle authentication and ID validation
const authenticateAndValidate = async (req: NextRequest, params: Promise<{ id: string }>) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

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

    if (!id) {
        return { error: NextResponse.json({ error: "Invalid or missing Skills ID." }, { status: 400 }) };
    }
    return { userId, id };
};

// =========================================================================================
// GET: Fetch a single Skills
// =========================================================================================
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;

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
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;

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
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;

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