import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import {
  googleLoginCallback,
  loginController,
  logOutController,
  registerUserController,
} from "../controllers/auth.controller";
import { SessionManager } from "../utils/session-manager";
import { HTTPSTATUS } from "../config/http.config";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);

authRoutes.post("/logout", logOutController);

// Session debugging endpoint (for development only)
if (config.NODE_ENV === "development") {
  authRoutes.get("/session-info", (req, res) => {
    const sessionInfo = SessionManager.getSessionInfo(req);
    res.status(HTTPSTATUS.OK).json({
      sessionInfo,
      headers: {
        cookie: req.headers.cookie,
        'user-agent': req.headers['user-agent']
      }
    });
  });
}

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
  }),
  googleLoginCallback
);

export default authRoutes;
