import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// Middleware to handle authentication and ID validation
const authenticateAndValidate = async (req: NextRequest, params: Promise<{ id: string }>)=> {
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
        return { error: NextResponse.json({ error: "Invalid or missing Project ID." }, { status: 400 }) };
    }
    return { userId, id };
};

// =========================================================================================
// GET: Fetch a single project
// =========================================================================================
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;

    try {
        const result = await pool.query(
            `SELECT id, title, description, image_url, technologies, github_url, live_url, is_featured, priority FROM projects 
             WHERE id = $1 AND user_id = $2`, [id, userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Project not found." }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during fetch." }, { status: 500 });
    }
}

// =========================================================================================
// PUT: Update a single project
// =========================================================================================
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;

    const { title, description, image_url, technologies, github_url, live_url, is_featured, priority } = await req.json();

    if (!title && !description && !technologies && !image_url && !github_url && !live_url && typeof is_featured !== 'boolean' && typeof priority !== 'number') {
        return NextResponse.json({ error: "At least one field is required for update." }, { status: 400 });
    }

    try {
        const technologiesArray = technologies ? technologies.split(',').map((tech: string) => tech.trim()) : null;

        const updateQuery = `
            UPDATE projects SET
                title = COALESCE($3, title),
                description = COALESCE($4, description),
                image_url = COALESCE($5, image_url),
                technologies = COALESCE($6, technologies),
                github_url = COALESCE($7, github_url),
                live_url = COALESCE($8, live_url),
                is_featured = COALESCE($9, is_featured),
                priority = COALESCE($10, priority),
                updated_at = NOW()
            WHERE id = $1 AND user_id = $2
            RETURNING id;
        `;

        const updateValues = [
            id,
            userId,
            title || null,
            description || null,
            image_url || null,
            technologiesArray, // Pass the array directly to PostgreSQL
            github_url || null,
            live_url || null,
            typeof is_featured === 'boolean' ? is_featured : null, // Correctly handle boolean values
            typeof priority === 'number' ? priority : null, // Correctly handle number values
        ];

        const result = await pool.query(updateQuery, updateValues);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Project not found or unauthorized." }, { status: 404 });
        }
        
        // ✨ Add a successful response here
        return NextResponse.json({ ok: true, message: `Project ${id} updated successfully.` });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during update." }, { status: 500 });
    }
}

// =========================================================================================
// DELETE: Delete a single project
// =========================================================================================
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authResult = await authenticateAndValidate(req, params);
    if (authResult.error) return authResult.error;
    const { userId, id } = authResult;

    try {
        const result = await pool.query(
            "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Project not found or unauthorized." }, { status: 404 });
        }
        
        return NextResponse.json({ ok: true, message: `Project ${id} deleted successfully.` });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error during deletion." }, { status: 500 });
    }
}