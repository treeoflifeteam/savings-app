
import Sidebar from "../components/ui/Sidebar";
import "./DashboardLayout.css";

const DashboardLayout = ({
  links,
  children,
}) => {
  return (
    <div className="dashboard">
      <Sidebar links={links} />

      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
