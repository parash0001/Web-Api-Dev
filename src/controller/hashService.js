// services/hash.service.js
import bcrypt from "bcrypt";

const saltRounds = 10;

export default {
  async hash(password) {
    return await bcrypt.hash(password, saltRounds);
  },

  async compare(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
};
