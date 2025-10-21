import { Request, Response, NextFunction } from "express";
import { info, warn } from "./logger";
import { getIpAddress } from "../utils";

export const Middleware = (req: Request, res: Response, next: NextFunction) => {
  if (isAuthorizedOrigin(req.headers.origin)) {
    const logInfo = {
      method: req.method,
      url: req.url,
      body: req.body,
      query: req.query,
      ip: getIpAddress(req),
      userAgent: req.headers["user-agent"],
      timestamp: new Date().toISOString(),
    };
    info(logInfo);
    next();
  } else {
    const forbiddenInfo = {
      method: req.method,
      url: req.url,
      ip: getIpAddress(req),
      userAgent: req.headers["user-agent"],
      timestamp: new Date().toISOString(),
      message: "Unauthorized access attempt",
    };
    warn(forbiddenInfo);
    res.status(403).send("Forbidden");
  }
};

function isAuthorizedOrigin(origin: string | undefined): boolean {
  const authorizedOrigins = [
    process.env.APPURL,
    process.env.CONTROL_PANEL_URL,
    process.env.ADMIN_PANEL_URL,
    process.env.GAPE_PANEL_URL,
  ];
  return authorizedOrigins.includes(origin);
}
