import { pool } from "./mysql";
import { User } from "./../types/";

export const userQueries = {
  async getAll(): Promise<User[]> {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows as User[];
  },

  async getById(id: number): Promise<User | null> {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    const result = rows as User[];
    return result.length > 0 ? result[0] : null;
  },

  async findByToken(token: string): Promise<User | null> {
    const [rows] = await pool.query(
      `SELECT users.id FROM users 
       INNER JOIN sessions ON sessions.UserID = users.id 
       WHERE sessions.Token = ?;`,
      [token]
    );
    const result = rows as User[];
    return result.length > 0 ? result[0] : null;
  },

  async isUsernameTaken(username: string, excludeId: number): Promise<boolean> {
    const [rows] = await pool.query("SELECT id FROM users WHERE Username = ? AND id != ? AND users.Disabled = 0", [
      username,
      excludeId,
    ]);
    return (rows as any[]).length > 0;
  },

  async updateProfile(userID: number, Username: string, Discord: string): Promise<boolean> {
    const [res] = await pool.execute("UPDATE users SET Username = ?, Discord = ? WHERE id = ? AND users.Disabled = 0", [
      Username,
      Discord,
      userID,
    ]);
    return (res as any).affectedRows > 0;
  },
};
