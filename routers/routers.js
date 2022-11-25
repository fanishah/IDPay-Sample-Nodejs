const express = require("express");
const randomstring = require("randomstring");
const axios = require("axios").default;

const router = express.Router();

// درخواست پست ایجاد تراکنش
router.use("/buy", async (req, res) => {
  console.log(req.body);
  try {
    // ورودی های درخواست ایجاد تراکنش
    let params = {
      headers: {
        "X-API-KEY": process.env.API_KEY,
        "X-SANDBOX": 1, // تراکنش آزمایشی
      },
      method: "post",
      url: "https://api.idpay.ir/v1.1/payment",
      data: {
        name: req.body.fullname,
        amount: req.body.amount,
        mail: req.body.email,
        phone: req.body.phone,
        callback: process.env.CALLBACK,
        order_id: randomstring.generate({ length: 8, charset: "alphanumeric" }),
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
      return res.status(400).send(err);
    }
  }
});

// درخواست پست کال بک تراکنش
router.post("/callback", async (req, res) => {
  try {
    console.log(req.body);

    // https://idpay.ir/web-service/v1.1/#ad39f18522 {لیست کد وضعیت تراکنش}

    // تراکنش پرداخت شده
    if (req.body.status == 10) {
      let params = {
        headers: {
          "X-API-KEY": process.env.API_KEY,
          "X-SANDBOX": 1, // تراکنش آزمایشی
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

module.exports = router;
