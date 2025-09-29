import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT name, tagline, long_bio, photo_url, contact_email, linkedin_url, github_url, resume_url FROM personal_info"
        );
        
        // Return the first (and only) row directly, or an empty object if no data exists
        const info = result.rows.length > 0 ? result.rows[0] : {};

        return NextResponse.json(info);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}