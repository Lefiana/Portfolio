import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db"
import bcrypt from "bcryptjs";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and Password Required"});
    const hashed = bcrypt.hashSync(password, 10);
    try {
        await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
        [email, hashed]
        );
        return res.json({ok:true});
    }catch(err){
        console.error(err);
        return res.status(500).json({error: "Server error"});
    }
}
