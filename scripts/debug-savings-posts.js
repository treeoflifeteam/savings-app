import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

const run = async () => {
  try {
    const reg = await API.post("/auth/register", {
      name: "Route Debug2",
      phone: "08000001236",
      password: "password123",
    });
    const token = reg.data.token;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const start = await API.post("/savings/cycle/start", {
      dailyAmount: 1000,
      totalDays: 2,
    });
    console.log("START", start.status, start.data.msg || start.data);

    const add = await API.post("/savings/add", {
      days: 1,
      method: "manual",
    });
    console.log("ADD", add.status, add.data.msg || add.data);
  } catch (err) {
    if (err.response) {
      console.error("ERR", err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
};

run();
