const express = require("express");
const { send } = require("express/lib/response");
const axios = require("axios").default;
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.urlencoded({ extended: false }));

// https://idpay.ir/web-service/v1.1/#d7b83cfb9c {لیست خطا ها آیدی پی}

// درخواست پست ایجاد تراکنش
app.use("/buy", async (req, res) => {
  try {
    // ورودی های درخواست ایجاد تراکنش
    let params = {
      headers: {
        "X-API-KEY": process.env.API_KEY,
        "X-SANDBOX": 1,
      },
      method: "post",
      url: "https://api.idpay.ir/v1.1/payment",
      data: {
        order_id: "222",
        amount: "1000",
        callback: process.env.CALLBACK,
        order_id: "2424",
      },
    };

    // درخواست ایجاد تراکنش
    let requestBuy = await axios(params);

    // لاگ اطلاعات تراکنش
    console.log(requestBuy.data);

    // ریدایرکت به صفحه پرداخت
    res.redirect(requestBuy.data.link);
  } catch (err) {
    if (err) {
      return res.status(400).send(err.response.data);
    }
  }
});

// درخواست پست کال بک تراکنش
app.post("/callback", async (req, res) => {
  try {
    console.log(req.body);

    // https://idpay.ir/web-service/v1.1/#ad39f18522 {لیست کد وضعیت تراکنش}

    // تراکنش پرداخت شده
    if (req.body.status == 10) {
      let params = {
        headers: {
          "X-API-KEY": process.env.API_KEY,
          "X-SANDBOX": 1,
        },
        method: "post",
        url: "https://api.idpay.ir/v1.1/payment/verify",
        data: {
          id: req.body.id,
          order_id: req.body.order_id,
        },
      };

      // درخواست تایید تراکنش
      let verifyBuy = await axios(params);

      // اطلاعات تراکنش
      console.log(verifyBuy.data);

      // تایید تراکنش
      if (verifyBuy.data.status == 100) {
        return res.json({
          message: "تراکنش موفق",
          peymnet: verifyBuy.data.payment,
        });
      }
      // تراکنش قبلا پرداخت و تایید شده است
      if (verifyBuy.data.status == 101) {
        return res.json({
          message: "تراکنش قبلا پرداخت و تایید شده است",
          peymnet: verifyBuy.data.payment,
        });
      } else {
        res.json(req.body);
      }
    } else {
      // تراکنش های ناموفق
      res.json({ message: "پرداخت ناموفق", peyment: req.body });
    }
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  }
});

app.get("/", (req, res) => {
  res.setHeader("content-type", "text/html");
  res.send(`<a href="/buy">click me</a>`);
});

app.listen(3000);
