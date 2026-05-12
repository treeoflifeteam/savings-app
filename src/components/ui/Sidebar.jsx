
import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  FaWallet,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaExchangeAlt,
} from "react-icons/fa";

import "../../styles/Sidebar.css";

const Sidebar = ({
  links,
}) => {
  const location =
    useLocation();

  const icons = {
    dashboard:
      <FaChartLine />,
    wallet:
      <FaWallet />,
    users:
      <FaUsers />,
    transactions:
      <FaExchangeAlt />,
    savings:
      <FaMoneyBillWave />,
  };

  return (
    <div className="sidebar">
      <h1 className="sidebar-logo">
  KoloPay
</h1>

      <div className="sidebar-links">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={
              location.pathname ===
              link.path
                ? "active"
                : ""
            }
          >
            {
              icons[
                link.icon
              ]
            }

            <span>
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
