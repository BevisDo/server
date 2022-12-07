const express = require("express");
const router = express.Router();
const argon2 = require("argon2");

const User = require("../models/User");

//@route POST api/auth/register
//@desc Register user
//@access Public
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //simple validate
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, massage: "Missing username or password" });
    try {
      //check for existing user
      const user = await User.findOne({ username });
      if (user) {
        return res
          .status(400)
          .json({ success: false, message: "Username already taken" });

        //All good
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({ username, password });
        await newUser.save()

        //return token 
        
    } catch (error) {}
  }
});

module.exports = router;
