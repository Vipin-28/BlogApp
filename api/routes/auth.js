const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    //console.log(newUser);

    const user = await newUser.save();
     res.status(200).json(user);
  } catch (err) {
    console.log("server error");
    res.status(500).json({ success: false, message: err.message });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json({ success: false, message: "Wrong credentials!" });

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...others } = user._doc; // ... spread operator
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;