import { Request, Response, NextFunction } from "express";
import responses from "../responses/errorResponses.json";
import { language } from "../types";
import { returnError } from "../utils";
import { getUserBySessionToken } from "../database/authQueries";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const language = (req.headers.language as language) || "en";
  const token = req.cookies?.sessiontoken;

  if (!token) {
    return returnError(res, responses.You_Are_Not_Logged_In, language);
  }

  const user = await getUserBySessionToken(token);

  if (!user) {
    res.clearCookie("sessiontoken");
    return returnError(res, responses.You_Are_Not_Logged_In, language);
  }

  (req as any).user = user;

  next();
};
