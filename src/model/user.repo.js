import UserModel from "./user.js";

const userRepo = {
  async findByEmail(email) {
    return await UserModel.findOne({ email });
  },

  async updatePasswordByEmail(email, hashedPassword) {
    return await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
  },

  //user CRUD for dashboard
  // User CRUD for admin dashboard
  async createUser(data) {
    return await UserModel.create(data);
  },

  async getAllUsers() {
    return await UserModel.find();
  },

  async getUserById(id) {
    return await UserModel.findById(id);
  },

  async updateUserById(id, data) {
    return await UserModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteUserById(id) {
    return await UserModel.findByIdAndDelete(id);
  }
};

export default userRepo;
