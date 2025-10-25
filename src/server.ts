import colors from "colors";
import app from "./app";
import config from "./config/config";
import { dbConnect } from "./config/dbConnect";

// connect to database
dbConnect();

const port =
  typeof config.port === "number" ? config.port : Number(config.port);

app.listen(port, () => {
  console.log(colors.yellow(`Qube Server is running on port http://${config.ip_address}:${port}`));
});
