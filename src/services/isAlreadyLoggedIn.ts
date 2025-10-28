import { NextFunction, Request, Response } from "express";
import { validateSessionToken } from "../database/authQueries";
import responses from "../responses/errorResponses.json";
import { language } from "../types";
import { returnError } from "../utils";

export const isAlreadyLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const language = (req.headers.language as language) || "en";
  const token = req.cookies.sessiontoken;

  if (!token) return next();

  const valid = await validateSessionToken(token);
  if (valid) {
    return returnError(res, responses.Already_Logged_In, language);
  } else {
    res.clearCookie("sessiontoken");
    return next();
  }
};
