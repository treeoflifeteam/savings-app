
export const calculateCycleEndDate =
  ({
    cycleType,
    durationCount,
  }) => {
    const startDate =
      new Date();

    const endDate =
      new Date(startDate);

    switch (cycleType) {
      case "daily":
        endDate.setDate(
          endDate.getDate() +
            durationCount
        );
        break;

      case "weekly":
        endDate.setDate(
          endDate.getDate() +
            durationCount * 7
        );
        break;

      case "monthly":
        endDate.setMonth(
          endDate.getMonth() +
            durationCount
        );
        break;

      case "fixed":
        endDate.setMonth(
          endDate.getMonth() +
            durationCount
        );
        break;
    }

    return {
      startDate,
      endDate,
    };
  };
