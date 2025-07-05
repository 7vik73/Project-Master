import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../utils/appError';

export interface SessionUser {
    _id: string;
    email: string;
    name: string;
    currentWorkspace?: string;
}

export class SessionManager {
    /**
     * Validate session and handle server restart scenarios
     */
    static validateSession(req: Request, res: Response, next: NextFunction) {
        try {
            // Check if session exists
            if (!req.session) {
                console.log('No session found - user needs to login');
                return next(new UnauthorizedException('Session not found. Please login again.'));
            }

            // Check if user is authenticated
            if (!req.user) {
                console.log('No user in session - clearing invalid session');
                // Don't destroy session immediately, just return unauthorized
                return next(new UnauthorizedException('Invalid session. Please login again.'));
            }

            // Validate session data integrity
            const user = req.user as any;
            if (!user._id || !user.email) {
                console.log('Invalid user data in session - clearing session');
                // Don't destroy session immediately, just return unauthorized
                return next(new UnauthorizedException('Invalid session data. Please login again.'));
            }

            // Session is valid
            console.log(`Valid session for user: ${user.email}`);
            next();
        } catch (error) {
            console.error('Session validation error:', error);
            return next(new UnauthorizedException('Session validation failed. Please login again.'));
        }
    }

    /**
     * Extend session on activity
     */
    static extendSession(req: Request) {
        try {
            if (req.session && req.user) {
                // Touch the session to extend it
                req.session.touch();
                const user = req.user as any;
                console.log(`Session extended for user: ${user.email}`);
            }
        } catch (error) {
            console.error('Session extension error:', error);
        }
    }

    /**
     * Clear session completely
     */
    static clearSession(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (req.session) {
                    req.session.destroy((err) => {
                        if (err) {
                            console.error('Error destroying session:', err);
                            reject(err);
                        } else {
                            console.log('Session destroyed successfully');
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            } catch (error) {
                console.error('Session clear error:', error);
                resolve(); // Resolve anyway to prevent hanging
            }
        });
    }

    /**
     * Get session info for debugging
     */
    static getSessionInfo(req: Request) {
        try {
            if (!req.session) {
                return { exists: false };
            }

            const user = req.user as any;
            return {
                exists: true,
                sessionId: req.sessionID,
                userId: user?._id,
                userEmail: user?.email,
                createdAt: req.session.cookie?.expires,
                maxAge: req.session.cookie?.maxAge,
                sessionStore: 'MongoDB',
                ttl: '3 years'
            };
        } catch (error) {
            console.error('Session info error:', error);
            return { exists: false, error: 'Failed to get session info' };
        }
    }

    /**
     * Handle session errors gracefully
     */
    static handleSessionError(error: any, req: Request, res: Response, next: NextFunction) {
        console.error('Session error occurred:', error);

        // Clear the problematic session
        if (req.session) {
            req.session.destroy(() => {
                console.log('Problematic session cleared due to error');
            });
        }

        return res.status(500).json({
            error: 'Session error occurred. Please login again.',
            code: 'SESSION_ERROR'
        });
    }
} 