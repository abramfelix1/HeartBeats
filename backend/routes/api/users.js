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
router.post("", validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;

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

  const hashedPassword = bcrypt.hashSync(password);

  const user = await User.create({
    email: email.toLowerCase(),
    firstName,
    lastName,
    username: username.toLowerCase(),
    hashedPassword,
  });

  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    spotifyId: user.spotifyId,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
