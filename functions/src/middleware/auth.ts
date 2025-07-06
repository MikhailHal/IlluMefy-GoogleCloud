import {Request, Response, NextFunction} from "express";
import {auth} from "../config/firebase/firebase";
import {DecodedIdToken} from "firebase-admin/auth";
import {UnauthorizedError} from "../base/error/UnauthorizedError";

export interface AuthRequest extends Request {
    user?: DecodedIdToken;
}
export const verifyAuth = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        // トークン取り出し
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("No valid authorization header");
        }
        const token = authHeader.split(" ")[1];

        // トークンの認証処理
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        if (error instanceof Error) {
            throw new UnauthorizedError(`Detail: ${error.message}`);
        } else {
            throw new UnauthorizedError("Authentication failed");
        }
    }
};
