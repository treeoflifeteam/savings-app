import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

const run = async () => {
  try {
    const loginResp = await API.post("/api/auth/login", {
      phone: "08000001234",
      password: "password123",
    });
    console.log("LOGIN SUCCESS", loginResp.data);

    const token = loginResp.data.token;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const dashboardResp = await API.get("/api/dashboard/user");
    console.log("DASHBOARD SUCCESS", dashboardResp.data);

    const cyclesResp = await API.get("/api/cycles/my-cycles");
    console.log("CYCLES SUCCESS", cyclesResp.data);

    const transactionsResp = await API.get("/api/transactions/");
    console.log("TRANSACTIONS SUCCESS", transactionsResp.data);
  } catch (err) {
    console.error("ERROR", err.response?.data || err.message);
  }
};

run();
