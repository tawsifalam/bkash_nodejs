require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/bkashToken", async (req, res) => {
  const tokenResponse = await fetch(
    "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
      body: JSON.stringify({
        app_key: process.env.KEY,
        app_secret: process.env.SECRET,
      }),
    }
  );

  const tokenResult = await tokenResponse.json();
  res.cookie("token", tokenResult);
  res.send(tokenResult);
});

app.get("/creatBkashPayment", async (req, res) => {
  const token = req.cookies.token;
  const checkoutResopnse = await fetch(
    "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token.id_token,
        "x-app-key": process.env.KEY,
      },
      body: JSON.stringify({
        amount: "500",
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: uuidv4(),
      }),
    }
  );

  const checkoutResult = await checkoutResopnse.json();

  res.cookie("payment", checkoutResult);
  res.send(checkoutResult);
});

app.get("/executeBkashPayment", async (req, res) => {
  const token = req.cookies.token;
  const payment = req.cookies.payment;

  const executePaymentResponse = await fetch(
    `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute/${payment.paymentID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token.id_token,
        "x-app-key": process.env.KEY,
      },
    }
  );
  const executePaymentResult = await executePaymentResponse.json();

  res.send(executePaymentResult);
});

app.get("/queryBkashPayment", async (req, res) => {
  const token = req.cookies.token;
  const payment = req.cookies.payment;

  const queryPaymentResponse = await fetch(
    `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/query/${req.query.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token.id_token,
        "x-app-key": process.env.KEY,
      },
    }
  );
  const queryPaymentResult = await queryPaymentResponse.json();

  res.send(queryPaymentResult);
});

app.get("/searchBkashTransaction", async (req, res) => {
  const token = req.cookies.token;
  const payment = req.cookies.payment;

  const searchTransactionResponse = await fetch(
    `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/search/${req.query.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token.id_token,
        "x-app-key": process.env.KEY,
      },
    }
  );
  const searchTransactionResult = await searchTransactionResponse.json();

  res.send(searchTransactionResult);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
