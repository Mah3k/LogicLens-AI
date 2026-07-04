import { motion } from 'framer-motion';
import './LoadingAnimation.css';

export default function LoadingAnimation({ label = 'Analyzing your code…' }) {
  const dots = [0, 1, 2];
  return (
    <div className="loadinganim">
      <div className="loadinganim-rings">
        <span className="ring ring-1" />
        <span className="ring ring-2" />
        <span className="ring ring-3" />
      </div>
      <p className="loadinganim-label">
        {label}
        <span className="loadinganim-dots">
          {dots.map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            >
              .
            </motion.span>
          ))}
        </span>
      </p>
    </div>
  );
}
