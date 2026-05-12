const EmptyState = ({ title, subtitle, icon = "🛈", action }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{subtitle}</p>
    {action && <div className="empty-action">{action}</div>}
  </div>
);

export default EmptyState;
