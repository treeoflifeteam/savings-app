import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

const randomPhone = `0800000${Math.floor(1000 + Math.random() * 9000)}`;
const password = "password123";
const name = "Withdraw Test User";

const log = (label, data) => {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(data, null, 2));
};

const run = async () => {
  try {
    // Register user
    const registerResp = await API.post("/auth/register", {
      name,
      phone: randomPhone,
      password,
    });
    log("REGISTER RESPONSE", registerResp.data);

    // Login
    const loginResp = await API.post("/auth/login", {
      phone: randomPhone,
      password,
    });
    log("LOGIN RESPONSE", loginResp.data);

    const token = loginResp.data.token;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Start cycle
    const startCycleResp = await API.post("/savings/cycle/start", {
      dailyAmount: 1000,
      totalDays: 3,
    });
    log("START CYCLE RESPONSE", startCycleResp.data);

    // Complete cycle
    const addSavingsResp = await API.post("/savings/add", {
      days: 3,
      method: "manual",
    });
    log("COMPLETE CYCLE RESPONSE", addSavingsResp.data);

    // Check profile after completion
    const profileResp = await API.get("/savings/profile");
    log("PROFILE AFTER COMPLETION", profileResp.data);

    // Test 1: Valid withdrawal
    console.log("\n--- TEST 1: Valid withdrawal of 500 ---");
    const withdrawResp1 = await API.post("/savings/withdraw", { amount: 500 });
    log("WITHDRAW 500 RESPONSE", withdrawResp1.data);

    // Check profile after withdrawal
    const profileAfterWithdraw1 = await API.get("/savings/profile");
    log("PROFILE AFTER WITHDRAW 500", profileAfterWithdraw1.data);

    // Test 2: Withdraw remaining balance
    console.log("\n--- TEST 2: Withdraw remaining balance ---");
    const withdrawResp2 = await API.post("/savings/withdraw", { amount: 1500 });
    log("WITHDRAW 1500 RESPONSE", withdrawResp2.data);

    // Check profile after second withdrawal
    const profileAfterWithdraw2 = await API.get("/savings/profile");
    log("PROFILE AFTER WITHDRAW 1500", profileAfterWithdraw2.data);

    // Test 3: Try to withdraw when balance is 0 (should fail)
    console.log("\n--- TEST 3: Withdraw from zero balance (should fail) ---");
    try {
      const withdrawResp3 = await API.post("/savings/withdraw", {
        amount: 100,
      });
      log("WITHDRAW FROM ZERO RESPONSE", withdrawResp3.data);
    } catch (err) {
      log("WITHDRAW FROM ZERO ERROR", err.response.data);
    }

    // Test 4: Try to withdraw negative amount (should fail)
    console.log("\n--- TEST 4: Withdraw negative amount (should fail) ---");
    try {
      const withdrawResp4 = await API.post("/savings/withdraw", {
        amount: -100,
      });
      log("WITHDRAW NEGATIVE RESPONSE", withdrawResp4.data);
    } catch (err) {
      log("WITHDRAW NEGATIVE ERROR", err.response.data);
    }

    // Test 5: Try to withdraw zero amount (should fail)
    console.log("\n--- TEST 5: Withdraw zero amount (should fail) ---");
    try {
      const withdrawResp5 = await API.post("/savings/withdraw", { amount: 0 });
      log("WITHDRAW ZERO RESPONSE", withdrawResp5.data);
    } catch (err) {
      log("WITHDRAW ZERO ERROR", err.response.data);
    }

    // Test 6: Try to withdraw more than balance (should fail)
    console.log("\n--- TEST 6: Withdraw more than balance (should fail) ---");
    // First add some balance back
    await API.post("/savings/add", { days: 1, method: "manual" });
    await API.post("/savings/add", { days: 2, method: "manual" });

    const profileWithBalance = await API.get("/savings/profile");
    console.log(`Current balance: ${profileWithBalance.data.walletBalance}`);

    try {
      const withdrawResp6 = await API.post("/savings/withdraw", {
        amount: profileWithBalance.data.walletBalance + 1000,
      });
      log("WITHDRAW TOO MUCH RESPONSE", withdrawResp6.data);
    } catch (err) {
      log("WITHDRAW TOO MUCH ERROR", err.response.data);
    }

    console.log("\n=== ALL WITHDRAWAL TESTS COMPLETED ===");
  } catch (err) {
    if (err.response) {
      log("ERROR RESPONSE", err.response.data);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
};

run();
