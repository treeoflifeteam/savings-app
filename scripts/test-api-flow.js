import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

const randomPhone = `0800000${Math.floor(1000 + Math.random() * 9000)}`;
const password = "password123";
const name = "Test User";

const log = (label, data) => {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(data, null, 2));
};

const run = async () => {
  try {
    const registerResp = await API.post("/auth/register", {
      name,
      phone: randomPhone,
      password,
    });
    log("REGISTER RESPONSE", registerResp.data);

    const loginResp = await API.post("/auth/login", {
      phone: randomPhone,
      password,
    });
    log("LOGIN RESPONSE", loginResp.data);

    const token = loginResp.data.token;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const startCycleResp = await API.post("/savings/cycle/start", {
      dailyAmount: 1000,
      totalDays: 3,
    });
    log("START CYCLE RESPONSE", startCycleResp.data);

    const addSavingsResp = await API.post("/savings/add", {
      days: 3,
      method: "manual",
    });
    log("COMPLETE CYCLE RESPONSE", addSavingsResp.data);

    const profileResp = await API.get("/savings/profile");
    log("PROFILE AFTER COMPLETION", profileResp.data);

    const withdrawResp = await API.post("/savings/withdraw", {
      amount: 1000,
    });
    log("WITHDRAW RESPONSE", withdrawResp.data);

    const finalProfileResp = await API.get("/savings/profile");
    log("PROFILE AFTER WITHDRAW", finalProfileResp.data);
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
