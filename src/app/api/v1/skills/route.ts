import pool from "@/lib/db"
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try{
        const result = await pool.query(
            "SELECT id, skill_name, category, priority FROM skills ORDER BY category DESC, priority ASC, updated_at DESC "
        );

        return NextResponse.json(result.rows);
    }catch(err){
        console.error(err);
        return NextResponse.json({error: "Server error"});
    }
}