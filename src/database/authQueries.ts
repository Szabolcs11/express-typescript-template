import { pool } from "./mysql";

export const findUserByUsername = async (username: string) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE Username = ?", [username]);
  const result = rows as any[];
  return result.length > 0 ? result[0] : null;
};

export const findUserByEmail = async (email: string) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE Email = ?", [email]);
  const result = rows as any[];
  return result.length > 0 ? result[0] : null;
};

export const createSession = async (userID: number, token: string) => {
  await pool.execute("INSERT INTO sessions (UserID, Token) VALUES (?, ?)", [userID, token]);
};

export const deleteSession = async (token: string) => {
  await pool.execute("DELETE FROM sessions WHERE Token = ?", [token]);
};

export const createUser = async (username: string, password: string, email: string) => {
  const [result] = await pool.execute("INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)", [
    username,
    password,
    email,
  ]);
  return result;
};

export const getUserBySessionToken = async (token: string) => {
  const [rows] = await pool.execute(
    "SELECT users.id, users.username FROM users JOIN sessions ON users.id = sessions.UserID WHERE sessions.Token = ?",
    [token]
  );
  return (rows as any[])[0] || null;
};

export const validateSessionToken = async (token: string) => {
  const [rows] = await pool.execute("SELECT * FROM sessions WHERE Token = ?", [token]);
  const result = rows as any[];
  return result.length > 0;
};
