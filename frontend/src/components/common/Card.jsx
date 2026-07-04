import { motion } from 'framer-motion';
import './Card.css';

export default function Card({ children, className = '', hover = false, glow = false, as = 'div', delay = 0 }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={`card ${hover ? 'card-hover' : ''} ${glow ? 'card-glow' : ''} ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}
