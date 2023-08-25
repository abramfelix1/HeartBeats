// backend/utils/validation.js
const { validationResult } = require("express-validator");
const { check, query } = require("express-validator");

const validateWordCount = (value, { req }) => {
  const wordCount = req.body.content.split(/\s+/).length;
  return wordCount >= 3 && wordCount <= 500;
};

const validateImgUrl = (value, { req }) => {
  if (!/\.(png|jpg|jpeg)$/.test(value)) {
    return false;
  }
  return true;
};

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.param] = error.msg));

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

const validateSignup = [
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 16 })
    .withMessage("Please provide a First Name between 1-16 characters"),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 16 })
    .withMessage("Please provide a Last Name between 1-16 characters"),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .matches(/^[a-zA-Z0-9_]*$/)
    .withMessage("Please provide a valid username")
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

const validateJournal = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 60 })
    .withMessage("Please provide a Name between 1-60 characters"),
  check("content")
    .exists({ checkFalsy: true })
    .custom(validateWordCount)
    .withMessage("Word Count must be between 3-500"),
  check("image_url")
    .optional()
    .custom(validateImgUrl)
    .withMessage("URL must end with .png, .jpg, or .jpeg"),
  handleValidationErrors,
];

const validatePlaylist = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 60 })
    .withMessage("Please provide a Name between 1-60 characters"),
  check("image_url")
    .optional()
    .custom(validateImgUrl)
    .withMessage("URL must end with .png, .jpg, or .jpeg"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateSignup,
  validateJournal,
  validatePlaylist,
};
