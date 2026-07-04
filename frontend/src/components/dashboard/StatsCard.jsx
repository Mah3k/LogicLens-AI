import Card from '../common/Card';
import './StatsCard.css';

export default function StatsCard({ icon: Icon, label, value, trend, delay = 0 }) {
  return (
    <Card className="stats-card" hover delay={delay}>
      <div className="stats-card-icon"><Icon size={19} /></div>
      <p className="stats-card-value">{value}</p>
      <p className="stats-card-label">{label}</p>
      {trend && <span className={`stats-card-trend ${trend.startsWith('-') ? 'stats-down' : 'stats-up'}`}>{trend}</span>}
    </Card>
  );
}
