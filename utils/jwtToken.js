import jwt from "jsonwebtoken";
import constants from "../constants/constants.js";
const generateJWT = (data) => {
  // console.log(user, "data");
  let token = jwt.sign(data, constants.jwtSecret, { expiresIn: '120m' });
  return token;
};

const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, constants.jwtSecret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export { generateJWT, verifyJWT };
