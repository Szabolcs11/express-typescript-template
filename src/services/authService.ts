import bcrypt from "bcrypt";
import crypto from "crypto";
import { createSession, createUser, deleteSession, findUserByEmail, findUserByUsername } from "../database/authQueries";

export const authenticateUser = async (username: string, password: string) => {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.Password);
  if (!valid) return null;

  const token = crypto.randomBytes(32).toString("hex");
  await createSession(user.id, token);
  return token;
};

export const destroySession = async (token: string) => {
  await deleteSession(token);
};

export const getUserByName = async (username: string) => {
  return await findUserByUsername(username);
};

export const getUserByEmail = async (email: string) => {
  return await findUserByEmail(email);
};

export const registerUser = async (username: string, password: string, email: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser(username, hashedPassword, email);
};
