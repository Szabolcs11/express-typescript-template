import { Response } from "express";

export const getIpAddress = (req: any): string => {
  return req.headers["x-forwarded-for"]?.toString().split(",").shift() || req.connection.remoteAddress || "";
};

export const returnError = (res: Response, message: any, language: string) => {
  const languague = language;
  return res.status(200).json({
    success: false,
    message: message[languague],
  });
};
