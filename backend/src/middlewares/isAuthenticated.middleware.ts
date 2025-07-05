import { NextFunction, Request, Response } from "express";
import { SessionManager } from "../utils/session-manager";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Use the session manager to validate session
  SessionManager.validateSession(req, res, next);
};

export default isAuthenticated;
