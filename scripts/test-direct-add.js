import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

const run = async () => {
  try {
    const reg = await API.post("/api/auth/register", {
      name: "Direct Debug",
      phone: "08000001237",
      password: "password123",
    });
    const token = reg.data.token;
    const start = await API.post(
      "/api/savings/cycle/start",
      { dailyAmount: 1000, totalDays: 2 },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("START", start.status, start.data.msg);
    const add = await API.post(
      "/api/savings/add",
      { days: 1, method: "manual" },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("ADD", add.status, add.data.msg);
  } catch (err) {
    if (err.response) {
      console.error("ERR", err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
};

run();
