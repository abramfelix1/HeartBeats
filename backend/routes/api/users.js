// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { validateSignup } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { User } = require("../../db/models");

const router = express.Router();

// Sign up
router.post("", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    firstName,
    lastName,
    username,
    hashedPassword,
  });

  // Check if Username or Email exists
  const usernameExists = await User.findOne({ where: { username } });
  const emailExists = await User.findOne({ where: { email } });

  if (usernameExists)
    next({
      errors: { username: "Username already exists" },
      status: 403,
    });
  if (emailExists)
    next({
      errors: { email: "Email already exists" },
      status: 403,
    });

  const safeUser = {
    id: user.id,
    email: user.email.toLower(),
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username.toLower(),
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
