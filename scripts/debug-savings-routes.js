import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

const run = async () => {
  try {
    const reg = await API.post("/auth/register", {
      name: "Route Debug",
      phone: "08000001235",
      password: "password123",
    });
    const token = reg.data.token;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const profile = await API.get("/savings/profile");
    console.log("PROFILE", profile.status, JSON.stringify(profile.data));
  } catch (err) {
    if (err.response) {
      console.error("ERR", err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
};

run();
