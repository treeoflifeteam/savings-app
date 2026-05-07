import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });

const run = async () => {
  try {
    const phone = "08000002000";
    const password = "password123";

    const loginResp = await API.post("/api/auth/login", {
      phone,
      password,
    });
    console.log("LOGIN", loginResp.status);

    const token = loginResp.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    const addResp = await API.post(
      "/api/savings/add",
      { days: 30, method: "manual" },
      { headers },
    );
    console.log("ADD SAVINGS", addResp.status, addResp.data.msg);
  } catch (err) {
    if (err.response) {
      console.error(
        "ERROR",
        err.response.status,
        JSON.stringify(err.response.data, null, 2),
      );
    } else {
      console.error(err.message);
    }
  }
};

run();
