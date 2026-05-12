import "../../styles/global.css";

const SkeletonBlock = ({ width = "100%", height = "16px", className = "" }) => (
  <div className={`skeleton ${className}`} style={{ width, height }}></div>
);

export default SkeletonBlock;
