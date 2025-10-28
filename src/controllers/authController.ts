import { Request, Response } from "express";
import responses from "../responses/errorResponses.json";
import { authenticateUser, destroySession, getUserByName, registerUser } from "../services/authService";
import { language } from "../types";
import { returnError } from "../utils";

export const register = async (req: Request, res: Response) => {
  const { username, password, passwordConfirmation, email } = req.body;
  const language = (req.headers.language as language) || "en";

  const userExists = await getUserByName(username);
  if (userExists) return returnError(res, responses.Username_Already_Exists, language);

  const userExistsByEmail = await getUserByName(email);
  if (userExistsByEmail) return returnError(res, responses.Email_Already_Exists, language);

  if (password !== passwordConfirmation) return returnError(res, responses.Passwords_Do_Not_Match, language);

  const createdUser = await registerUser(username, password, email);
  if (!createdUser) return returnError(res, responses.Error_During_Registration, language);

  res.json({ success: true, message: responses.Registration_Successful[language] });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const language = (req.headers.language as language) || "en";

  const sessionToken = await authenticateUser(username, password);
  if (!sessionToken) return returnError(res, responses.Invalid_Username_Or_Password, language);

  res.cookie("sessiontoken", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ success: true, message: responses.Login_Successful[language] });
};

export const logout = async (req: Request, res: Response) => {
  const language = (req.headers.language as language) || "en";
  const token = req.cookies?.sessiontoken;
  if (token) await destroySession(token);
  res.clearCookie("sessiontoken");
  res.json({ success: true, message: responses.Logout_Successful[language] });
};
