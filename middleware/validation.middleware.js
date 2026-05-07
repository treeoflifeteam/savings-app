import { body, validationResult } from "express-validator";

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

// Validation rules for user registration
export const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("phone")
    .trim()
    .matches(/^(\+234|0)[789]\d{9}$/)
    .withMessage("Please enter a valid Nigerian phone number"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),

  handleValidationErrors,
];

// Validation rules for login
export const validateLogin = [
  body("phone")
    .trim()
    .matches(/^(\+234|0)[789]\d{9}$/)
    .withMessage("Please enter a valid Nigerian phone number"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// Validation rules for savings cycle
export const validateCycleStart = [
  body("dailyAmount")
    .isInt({ min: 100, max: 100000 })
    .withMessage("Daily amount must be between ₦100 and ₦100,000"),

  body("totalDays")
    .isInt({ min: 1, max: 365 })
    .withMessage("Total days must be between 1 and 365"),

  handleValidationErrors,
];

// Validation rules for adding savings
export const validateAddSavings = [
  body("days")
    .isInt({ min: 1, max: 30 })
    .withMessage("Days must be between 1 and 30"),

  body("method")
    .optional()
    .isIn(["app", "manual"])
    .withMessage('Method must be either "app" or "manual"'),

  handleValidationErrors,
];

// Validation rules for withdrawal
export const validateWithdrawal = [
  body("amount")
    .isInt({ min: 1 })
    .withMessage("Amount must be a positive number"),

  handleValidationErrors,
];

// Validation rules for payment initialization
export const validatePaymentInit = [
  body("amount")
    .isInt({ min: 1 })
    .withMessage("Amount must be a positive number"),

  body("days")
    .isInt({ min: 1, max: 30 })
    .withMessage("Days must be between 1 and 30"),

  body("cycleId").optional().isMongoId().withMessage("Invalid cycle ID"),

  handleValidationErrors,
];

// Validation rules for admin user creation
export const validateAdminUserCreate = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("phone")
    .trim()
    .matches(/^(\+234|0)[789]\d{9}$/)
    .withMessage("Please enter a valid Nigerian phone number"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  handleValidationErrors,
];

// Validation rules for admin actions
export const validateAdminAction = [
  body("userId").isMongoId().withMessage("Invalid user ID"),

  handleValidationErrors,
];
