import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // Assuming verifyToken function exists

// Define the expected structure of the data inside the JWT payload
interface JwtPayload {
    id: string; // The user ID is expected to be stored here
    // Add any other properties your token includes (e.g., iat, exp)
}

/**
 * Checks for a valid Authorization header, verifies the JWT, and extracts the user ID.
 * Returns the userId on success, or a NextResponse error object on failure.
 */
export const requireAuth = (req: NextRequest): { userId: string } | { error: NextResponse } => {
    const auth = req.headers.get("authorization");
    
    // 1. Check for Authorization Header
    if (!auth) {
        return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
    }
    
    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    
    // 2. Verify Token Validity
    if (!decoded) {
        return { error: NextResponse.json({ error: "Invalid token or not authorized" }, { status: 401 }) };
    }
    
    // 3. Extract User ID safely
    const payload = decoded as JwtPayload;
    return { userId: payload.id };
};
