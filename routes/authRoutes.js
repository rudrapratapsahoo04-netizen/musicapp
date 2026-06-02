const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/login", (req, res) => res.render("login.ejs"));
router.get("/signup", (req, res) => res.render("signup.ejs"));

// Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await User.create({ username, email, password: hash });

  req.flash("success", "Signup successful");
  res.redirect("/");
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    req.flash("error", "Wrong password");
    return res.redirect("/auth/login");
  }

  req.session.user = user;
  res.redirect("/");
});

//Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;