require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const User = require("./model/user");
const shop = require("./model/shop");
const review = require("./model/review");
// Register
app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, location, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
      first_name,
      last_name,
      location,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

//shopDetails
app.post("/shopDetails", auth, async (req, res) => {
  try {
    const { shopName, shopCategory, shopLocation } = req.body;

    if (!(shopName && shopCategory && shopLocation)) {
      res.status(400).send("All input is required");
    }
    const oldShop = await shop.findOne({ shopName });

    if (oldShop) {
      return res.status(409).send("Shop Already Exist.");
    }

    const Shop = await shop.create({
      shopName,
      shopCategory,
      shopLocation,
    });

    // shop.save();
    res.status(200).json(Shop);
  } catch (err) {
    console.log(err);
  }
});

//shopReview
app.post("/shopReview", auth, async (req, res) => {
    try {
      const { shopName, shopReview } = req.body;
  
      if (!(shopName && shopReview)) {
        res.status(400).send("All input is required");
      }
      const shopExist = await shop.findOne({ shopName });
  
      if (!shopExist) {
        return res.status(409).send("Shop Does not Exist.");
      }
  
      const Shopreview = await review.create({
        shopName,
        shopReview
      });
  
      // shop.save();
      res.status(200).json(Shopreview);
    } catch (err) {
      console.log(err);
    }
  });
  
//getShop 

app.get("/shopList", auth, async (req, res) => {
    try {
  
      
      if (User.location === shop.shopLocation) {
          const data = await shop.find({shop});
          console.log(data);
        //   console.log(Shop.shopName);
        return  res.status(200).json(data);
      }
      return res.status(409).send("Shop Does not Exist.");
    } catch (err) {
      console.log(err);
    }
  });


  
//getShopLocation wise PENDING

app.post("/shopListLocation", auth, async (req, res) => {
    try {
        const {shopLocation} = req.body;
      if ((User.location === shop.shopLocation) === shopLocation) {
          const data = await shop.find({shop});
          console.log(data);
        return  res.status(200).json(data);
      }
      return res.status(409).send("Shop Does not Exist.");
    } catch (err) {
      console.log(err);
    }
  });



module.exports = app;
