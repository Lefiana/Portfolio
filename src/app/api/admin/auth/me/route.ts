import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET handler to fetch the authenticated user's profile based on the JWT
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    
    // 1. Check for token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { message: "Missing or invalid token" }, 
            { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        // 2. Verify token and decode user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        
        // Return decoded user data (excluding sensitive fields like the full password hash)
        // Note: For a real app, you would likely fetch fresh user data from the DB here
        return NextResponse.json({ user: decoded }, { status: 200 });
    } catch (err) {
        console.error("JWT verification failed:", err);
        return NextResponse.json(
            { message: "Invalid or expired token" }, 
            { status: 401 }
        );
    }
}
