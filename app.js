const express = require("express");
const routers = require("./routers");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.static(path.resolve('public')))
app.use(express.urlencoded({ extended: false }));

// https://idpay.ir/web-service/v1.1/#d7b83cfb9c {لیست خطا ها آیدی پی}

app.use(routers);

app.listen(3000);
