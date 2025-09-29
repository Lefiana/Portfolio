import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {

    try {
        const result = await pool.query(
            "SELECT id, title, issuer, date, credential_url, image_url FROM certificates ORDER BY date DESC"
        );
        // The public API returns data
        return NextResponse.json(result.rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server Error" });
    }
}