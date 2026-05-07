import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });

const run = async () => {
  try {
    const phone = `0800000${Math.floor(1000 + Math.random() * 9000)}`;
    const password = "password123";

    const registerResp = await API.post("/api/auth/register", {
      name: "Full Flow Test",
      phone,
      password,
    });
    console.log("REGISTER", registerResp.status, registerResp.data.msg);

    const loginResp = await API.post("/api/auth/login", {
      phone,
      password,
    });
    console.log("LOGIN", loginResp.status, loginResp.data.msg);

    const token = loginResp.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    const startResp = await API.post(
      "/api/savings/cycle/start",
      { dailyAmount: 1000, totalDays: 3 },
      { headers },
    );
    console.log("START CYCLE", startResp.status, startResp.data.msg);

    const addResp = await API.post(
      "/api/savings/add",
      { days: 3, method: "manual" },
      { headers },
    );
    console.log("COMPLETE CYCLE", addResp.status, addResp.data.msg);

    const profileResp = await API.get("/api/savings/profile", { headers });
    console.log(
      "PROFILE BALANCE",
      profileResp.status,
      profileResp.data.walletBalance,
    );

    const withdrawResp = await API.post(
      "/api/savings/withdraw",
      { amount: 1000 },
      { headers },
    );
    console.log("WITHDRAW", withdrawResp.status, withdrawResp.data.msg);

    const finalProfileResp = await API.get("/api/savings/profile", { headers });
    console.log(
      "FINAL BALANCE",
      finalProfileResp.status,
      finalProfileResp.data.walletBalance,
    );
  } catch (err) {
    if (err.response) {
      console.error("ERROR", err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
};

run();
