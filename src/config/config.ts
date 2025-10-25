import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  ip_address: process.env.IP_ADDRESS,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,

  email: {
    app_name: process.env.APP_NAME,
    email_service: process.env.EMAIL_SERVICE,
    support_email: process.env.SUPPORT_EMAIL,
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
  },

  jwt: {
    jwt_expire_in: process.env.JWT_EXPIRE_IN,
  },
};
