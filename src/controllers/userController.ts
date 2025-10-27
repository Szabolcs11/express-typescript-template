import { Request, Response } from "express";
import { userService } from "../services/userService";
import { returnError } from "../utils/index";
import responses from "./../responses/errorResponses.json";
import { language } from "../types/index";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};

export const editUser = async (req: Request, res: Response) => {
  const language = req.headers.language as language;
  const { id } = req.params;
  const { Username, Discord } = req.body;
  const token = req.cookies?.sessiontoken;

  try {
    await userService.editUserProfile(token, Number(id), Username, Discord);
    res.status(200).json({
      success: true,
      message: responses.Successfully_Updated_User[language],
    });
  } catch (err: any) {
    const messageKey = err.message as keyof typeof responses;
    return returnError(res, responses[messageKey] || responses.Unexpected_Error, language);
  }
};
