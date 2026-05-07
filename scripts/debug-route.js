import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

const run = async () => {
  try {
    const registerResp = await API.post("/auth/register", {
      name: "Debug User",
      phone: "08000001234",
      password: "password123",
    });
    console.log("REGISTER RESPONSE", registerResp.status);

    const token = registerResp.data.token;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const profileResp = await API.get("/savings/profile");
    console.log("PROFILE RESPONSE", profileResp.status, profileResp.data);
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
