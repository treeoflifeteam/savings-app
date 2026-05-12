
import Ledger from "../models/Ledger.js";
import Wallet from "../models/Wallet.js";

// ======================================
// GENERATE REFERENCE
// ======================================

export const generateReference = (
  prefix = "TXN"
) => {
  return `${prefix}_${Date.now()}_${Math.floor(
    Math.random() * 1000000
  )}`;
};

// ======================================
// GET WALLET
// ======================================

export const getOrCreateWallet =
  async (userId) => {
    let wallet = await Wallet.findOne({
      userId,
    });

    if (!wallet) {
      wallet = await Wallet.create({
        userId,
      });
    }

    return wallet;
  };

// ======================================
// CREATE LEDGER ENTRY
// ======================================

export const createLedgerEntry =
  async ({
    userId,
    cycleId = null,
    type,
    amount,
    description = "",
    metadata = {},
    source = "system",
  }) => {
    const wallet =
      await getOrCreateWallet(userId);

    const balanceBefore =
      wallet.availableBalance;

    let balanceAfter = balanceBefore;

    // ==============================
    // CREDIT TYPES
    // ==============================

    const creditTypes = [
      "wallet_credit",
      "cycle_release",
      "agent_commission",
      "bonus",
      "remainder_credit",
    ];

    // ==============================
    // DEBIT TYPES
    // ==============================

    const debitTypes = [
      "wallet_debit",
      "withdrawal",
    ];

    if (creditTypes.includes(type)) {
      balanceAfter += amount;
    }

    if (debitTypes.includes(type)) {
      balanceAfter -= amount;
    }

    // Update wallet balance
    wallet.availableBalance =
      balanceAfter;

    await wallet.save();

    // Create immutable ledger entry
    const ledger =
      await Ledger.create({
        userId,
        cycleId,

        reference:
          generateReference("LEDGER"),

        type,

        amount,

        balanceBefore,

        balanceAfter,

        description,

        metadata,

        source,

        status: "completed",
      });

    return ledger;
  };

// ======================================
// GET WALLET BALANCE
// ======================================

export const getWalletBalance =
  async (userId) => {
    const wallet =
      await getOrCreateWallet(userId);

    return wallet.availableBalance;
  };

// ======================================
// LOCK FUNDS
// ======================================

export const lockFunds = async (
  userId,
  amount
) => {
  const wallet =
    await getOrCreateWallet(userId);

  wallet.lockedBalance += amount;

  await wallet.save();
};

// ======================================
// RELEASE LOCKED FUNDS
// ======================================

export const releaseLockedFunds =
  async (userId, amount) => {
    const wallet =
      await getOrCreateWallet(userId);

    wallet.lockedBalance -= amount;

    if (wallet.lockedBalance < 0) {
      wallet.lockedBalance = 0;
    }

    wallet.availableBalance += amount;

    await wallet.save();
  };
