require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UsersModel } = require("./model/UsersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URI;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const createPasswordHash = (password, salt = null) => {
  const usedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, usedSalt, 10000, 64, "sha512")
    .toString("hex");
  return { hash, salt: usedSalt };
};

// Test route for Render
app.get("/", (req, res) => {
  res.send("Backend working!");
});

app.get("/allHoldings", async (req, res) => {
  const data = await HoldingsModel.find({});
  res.json(data);
});

app.get("/allPositions", async (req, res) => {
  const data = await PositionsModel.find({});
  res.json(data);
});

app.post("/newOrder", async (req, res) => {
  const newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  await newOrder.save();
  res.send("order saved!");
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const { hash, salt } = createPasswordHash(password);
    const newUser = new UsersModel({
      name,
      email,
      passwordHash: hash,
      passwordSalt: salt,
    });

    await newUser.save();
    return res.status(201).json({ message: "Signup successful." });
  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({ message: "Signup failed." });
  }
});

// Correct way: connect DB first, then start server
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT, () => console.log("Server running on port", PORT));
  })
  .catch((err) => console.log("MongoDB connection error:", err));
