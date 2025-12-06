const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateRoom = [
  body("name").trim().notEmpty().withMessage("Room name is required"),
  body("description").optional().trim(),
];

const handleValidationErrors = (req, res, next) => {
  // validationResult() --> Ye function saare validation errors collect karta hai.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRoom,
  handleValidationErrors,
};
