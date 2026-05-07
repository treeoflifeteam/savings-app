import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import bcrypt from "bcryptjs";
import { catchAsync, AppError } from "../utils/errorHandler.js";

// ============ USER PROFILE ============
export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const transactions = await Transaction.find({ userId: user._id }).sort({
    date: -1,
  });

  res.json({ ...user.toObject(), transactions });
});

// ============ SAVINGS CYCLES ============
export const startCycle = catchAsync(async (req, res) => {
  const { dailyAmount, totalDays } = req.body;

  if (!dailyAmount || !totalDays) {
    throw new AppError("Daily amount and total days required", 400);
  }

  if (dailyAmount <= 0 || totalDays <= 0) {
    throw new AppError("Amount and days must be positive", 400);
  }

  const user = await User.findById(req.user.id);

  if (user.currentCycle?.status === "active") {
    throw new AppError("User already has an active cycle", 400);
  }

  user.currentCycle = {
    dailyAmount,
    totalDays,
    daysPaid: 0,
    status: "active",
    chargesTaken: false,
    totalCharges: 0,
    startDate: new Date(),
  };

  await user.save();

  res.json({
    msg: "Savings cycle started successfully",
    user,
  });
});

// ============ ADD SAVINGS ============
export const addSavings = catchAsync(async (req, res) => {
  const { days, method = "app" } = req.body;

  if (!days || days <= 0) {
    throw new AppError("Invalid number of days", 400);
  }

  const user = await User.findById(req.user.id);

  if (!user.currentCycle || user.currentCycle.status !== "active") {
    throw new AppError("No active cycle", 400);
  }

  const cycle = user.currentCycle;
  const remainingDays = cycle.totalDays - cycle.daysPaid;

  if (days > remainingDays) {
    throw new AppError(`Only ${remainingDays} days remaining in cycle`, 400);
  }

  const amount = cycle.dailyAmount * days;
  let charges = 0;

  if (!cycle.chargesTaken) {
    charges = method === "manual" ? cycle.dailyAmount : cycle.dailyAmount * 0.5;
  }

  // Create deposit transaction
  await Transaction.create({
    userId: user._id,
    type: "deposit",
    amount,
    effect: amount,
    source: method,
  });

  // Create charge transaction if applicable
  if (charges > 0) {
    await Transaction.create({
      userId: user._id,
      type: "charge",
      amount: charges,
      effect: -charges,
      source: method,
    });
  }

  cycle.daysPaid += days;
  cycle.totalCharges += charges;
  cycle.chargesTaken = cycle.chargesTaken || charges > 0;

  const updatedDays = cycle.daysPaid;
  if (updatedDays >= cycle.totalDays) {
    cycle.status = "completed";

    const totalSaved = cycle.dailyAmount * cycle.totalDays - cycle.totalCharges;

    user.cycles.push({
      ...cycle,
      totalSaved,
      finalBalance: totalSaved,
      completedAt: new Date(),
    });

    user.walletBalance += totalSaved;
    user.currentCycle = null;
  }

  await user.save();

  res.json({
    msg: "Savings added successfully",
    user,
  });
});

// ============ WITHDRAW ============
export const withdraw = catchAsync(async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.user.id);

  if (user.walletBalance < amount) {
    throw new AppError("Insufficient balance", 400);
  }

  user.walletBalance -= amount;

  await Transaction.create({
    userId: user._id,
    type: "withdrawal",
    amount,
    effect: -amount,
    source: "wallet",
  });

  await user.save();

  res.json({
    msg: "Withdrawal successful",
    user,
  });
});

// ============ TRANSACTIONS ============
export const getTransactions = catchAsync(async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id }).sort({
    date: -1,
  });

  res.json(transactions);
});

// ============ ADMIN - USERS ============
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select("-password");

  const userIds = users.map((u) => u._id);
  const transactions = await Transaction.find({
    userId: { $in: userIds },
  }).sort({ date: -1 });

  const byUserId = transactions.reduce((acc, tx) => {
    const key = tx.userId?.toString?.() ?? tx.userId?.toString?.();
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});

  const usersWithTransactions = users.map((u) => ({
    ...u.toObject(),
    transactions: byUserId[u._id.toString()] ?? [],
  }));

  res.json(usersWithTransactions);
});

export const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const transactions = await Transaction.find({ userId: user._id }).sort({
    date: -1,
  });

  res.json({ ...user.toObject(), transactions });
});

export const createUserAdmin = catchAsync(async (req, res) => {
  const { name, phone, password } = req.body;

  if (!name || !phone) {
    throw new AppError("Name and phone required", 400);
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new AppError("Phone number already registered", 400);
  }

  let hashedPassword = "default123"; // Default password for admin-created users

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  } else {
    hashedPassword = await bcrypt.hash(hashedPassword, 10);
  }

  const user = await User.create({
    name,
    phone,
    password: hashedPassword,
    walletBalance: 0,
    currentCycle: null,
    cycles: [],
  });

  res.json({
    msg: "User created successfully",
    user: { ...user.toObject(), password: undefined },
  });
});

// ============ ADMIN - TRANSACTIONS ============
// ============ ADMIN - TRANSACTIONS ============
export const getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await Transaction.find()
    .populate("userId", "name phone")
    .sort({ date: -1 });

  res.json(transactions);
});

// ============ ADMIN - ACTIONS ON SPECIFIC USER ============

export const adminStartCycle = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { dailyAmount, totalDays } = req.body;

  if (!dailyAmount || !totalDays) {
    throw new AppError("Daily amount and total days required", 400);
  }

  if (dailyAmount <= 0 || totalDays <= 0) {
    throw new AppError("Amount and days must be positive", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.currentCycle?.status === "active") {
    throw new AppError("User already has an active cycle", 400);
  }

  user.currentCycle = {
    dailyAmount,
    totalDays,
    daysPaid: 0,
    status: "active",
    chargesTaken: false,
    totalCharges: 0,
    startDate: new Date(),
  };

  await user.save();

  res.json({ msg: "Savings cycle started successfully", user });
});

export const adminAddSavings = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { days, method = "manual" } = req.body;

  if (!days || days <= 0) {
    throw new AppError("Invalid number of days", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.currentCycle || user.currentCycle.status !== "active") {
    throw new AppError("No active cycle", 400);
  }

  const cycle = user.currentCycle;
  const remainingDays = cycle.totalDays - cycle.daysPaid;

  if (days > remainingDays) {
    throw new AppError(`Only ${remainingDays} days remaining in cycle`, 400);
  }

  const amount = cycle.dailyAmount * days;
  let charges = 0;

  if (!cycle.chargesTaken) {
    charges = method === "manual" ? cycle.dailyAmount : cycle.dailyAmount * 0.5;
  }

  // deposit
  await Transaction.create({
    userId: user._id,
    type: "deposit",
    amount,
    effect: amount,
    source: method,
  });

  // charge if applicable
  if (charges > 0) {
    await Transaction.create({
      userId: user._id,
      type: "charge",
      amount: charges,
      effect: -charges,
      source: method,
    });
  }

  cycle.daysPaid += days;
  cycle.totalCharges += charges;
  cycle.chargesTaken = cycle.chargesTaken || charges > 0;

  const updatedDays = cycle.daysPaid;
  if (updatedDays >= cycle.totalDays) {
    cycle.status = "completed";

    const totalSaved = cycle.dailyAmount * cycle.totalDays - cycle.totalCharges;

    user.cycles.push({
      ...cycle,
      totalSaved,
      finalBalance: totalSaved,
      completedAt: new Date(),
    });

    user.walletBalance += totalSaved;
    user.currentCycle = null;
  }

  await user.save();

  res.json({ msg: "Savings added successfully", user });
});

export const adminWithdraw = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    throw new AppError("Invalid withdrawal amount", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.walletBalance < amount) {
    throw new AppError("Insufficient balance", 400);
  }

  user.walletBalance -= amount;

  await Transaction.create({
    userId: user._id,
    type: "withdrawal",
    amount,
    effect: -amount,
    source: "wallet",
  });

  await user.save();

  res.json({ msg: "Withdrawal successful", user });
});
