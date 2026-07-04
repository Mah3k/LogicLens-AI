import { motion } from 'framer-motion';
import './ProgressBar.css';

export default function ProgressBar({ value = 0, max = 100, label, color = 'violet', size = 'md' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="pbar-wrap">
      {label && (
        <div className="pbar-label-row">
          <span>{label}</span>
          <span className="pbar-value">{pct}%</span>
        </div>
      )}
      <div className={`pbar-track pbar-${size}`}>
        <motion.div
          className={`pbar-fill pbar-fill-${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
