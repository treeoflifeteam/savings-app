
import Ledger from "../models/Ledger.js";

export const preventDuplicateReference =
  async (req, res, next) => {
    const reference =
      req.body.reference ||
      req.params.reference;

    if (!reference) {
      return next();
    }

    const existing =
      await Ledger.findOne({
        reference,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Duplicate transaction detected",
      });
    }

    next();
  };
