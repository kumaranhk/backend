import dotenv from "dotenv";

dotenv.config();

const constants = {
  mail: process.env.MAIL,
  mailPass: process.env.MAIL_PASS,
  jwtSecret: process.env.JWT_SECRET,
  fronEndUrl: process.env.FRONT_END_URL
};

export default constants;
