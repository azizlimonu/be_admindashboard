import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error on getUser = ${error}`);
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Hardcoded values soon will updated and use the current year month and days by the query
    const currentMonth = "October";
    const currentYear = 2021;
    const currentDay = 2021 - 10 - 11;

    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdOn: -1 });

    const overallStat = await OverallStat.find({ year: currentYear });

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat[0];

    const thisMonthStats = overallStat[0].monthlyData
      .find(({ month }) => {
        return month === currentMonth
      });

    const todayStats = overallStat[0].dailyData
      .find(({ date }) => {
        return date === currentDay;
      });

    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
      transactions,
    });
  } catch (error) {
    console.log(`Error on getDashboardStats = ${error}`);
    res.status(500).json({ message: error.message });
  }
};  