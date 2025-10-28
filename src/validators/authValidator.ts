import { language } from "../types";
import { returnError } from "../utils";
import responses from "./../responses/errorResponses.json";
import { Request, Response, NextFunction } from "express";

const forbiddenWords = ["admin", "badword"];

export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
  const language = (req.headers.language as language) || "en";
  const { username, password } = req.body;

  if (!username) return returnError(res, responses.Missing_Username, language);
  if (!password) return returnError(res, responses.Missing_Password, language);

  next();
};

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
  const language = (req.headers.language as language) || "en";
  const { username, password, passwordConfirmation, email } = req.body;

  if (!username) return returnError(res, responses.Missing_Username, language);
  if (!password) return returnError(res, responses.Missing_Password, language);
  if (!passwordConfirmation) return returnError(res, responses.Missing_Password_Confirmation, language);
  if (!email) return returnError(res, responses.Missing_Email, language);
  if (username.length < 3) return returnError(res, responses.Username_Too_Short, language);
  if (password.length < 6) return returnError(res, responses.Password_Too_Short, language);
  if (password !== passwordConfirmation) return returnError(res, responses.Passwords_Do_Not_Match, language);
  for (const word of forbiddenWords) {
    if (username.toLowerCase().includes(word)) {
      return returnError(res, responses.Invalid_Words, language);
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return returnError(res, responses.Invalid_Email_Format, language);
  }

  next();
};
