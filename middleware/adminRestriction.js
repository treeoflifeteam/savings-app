
export const preventSelfFinancialAction =
  (req, res, next) => {
    const targetUserId =
      req.body.userId;

    // ==============================
    // ADMIN CANNOT ACT FOR SELF
    // ==============================

    if (
      req.user.role === "admin" &&
      req.user.id === targetUserId
    ) {
      return res.status(403).json({
        success: false,

        message:
          "Admin cannot perform financial actions for self",
      });
    }

    // ==============================
    // AGENT CANNOT ACT FOR SELF
    // ==============================

    if (
      req.user.role === "agent" &&
      req.user.id === targetUserId
    ) {
      return res.status(403).json({
        success: false,

        message:
          "Agent cannot perform financial actions for self",
      });
    }

    next();
  };
