import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SavingsProvider } from "./context/SavingsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
  <SavingsProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SavingsProvider>
</AuthProvider>
);