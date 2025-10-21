import { userQueries } from "../database/userQueries";

export const userService = {
  async getAllUsers() {
    return await userQueries.getAll();
  },

  async getUserById(id: number) {
    return await userQueries.getById(id);
  },

  async editUserProfile(token: string, id: number, Username: string, Discord: string) {
    if (!token) throw new Error("You_Need_To_Login_To_Use_This_Function");
    if (isNaN(id)) throw new Error("Invalid_Param");

    const user = await userQueries.findByToken(token);
    if (!user) throw new Error("Invalid_Cookie");
    if (user.id !== id) throw new Error("Forbidden_Access");

    const usernameTaken = await userQueries.isUsernameTaken(Username, id);
    if (usernameTaken) throw new Error("Username_Taken");

    const updated = await userQueries.updateProfile(id, Username, Discord);
    if (!updated) throw new Error("Unexpected_Error");

    return true;
  },
};
