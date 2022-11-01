const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const routers = require("./routers/routers");

dotenv.config({ path: "./config.env" });

const app = express();

// https://idpay.ir/web-service/v1.1/#d7b83cfb9c {لیست خطا ها آیدی پی}

app.use(express.static(path.join(__dirname, ".", "public")));
app.use(express.urlencoded({ extended: false }));

app.use(routers);

app.listen(3000, () => console.log(`App listening on port 3000!`));
