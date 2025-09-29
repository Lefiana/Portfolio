import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";

export async function GET() {

    try {
        const result = await pool.query(
            "SELECT id, title, description, image_url, technologies, github_url, live_url FROM projects ORDER BY is_featured DESC, priority ASC, updated_at DESC"
        );
        // The public API returns data  
        return NextResponse.json(result.rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server Error" });
    }
}