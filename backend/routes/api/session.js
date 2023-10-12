// backend/routes/api/session.js
const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { validateLogin } = require("../../utils/validation");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { User } = require("../../db/models");

const router = express.Router();

// Login
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The provided credentials were invalid." };
    return next(err);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    spotifyId: user.spotifyId,
  };

  await setTokenCookie(res, safeUser);

  return res.json({ user: safeUser });
});

// Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.clearCookie("connect.sid");
  return res.json({ message: "success" });
});

// Check for session user
router.get("/user", (req, res) => {
  if (req.session && req.session.user) {
    // console.log("CHECK SESSION:", req.session.user);
    return res.json({ user: req.session.user });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
});

// Restore session user
router.get("/", (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
});

module.exports = router;
