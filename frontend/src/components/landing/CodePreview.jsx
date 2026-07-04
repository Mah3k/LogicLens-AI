import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, CheckCircle2, Sparkles } from 'lucide-react';
import './CodePreview.css';

const CODE_LINES = [
  'function getDiscount(user, cart) {',
  '  let total = 0;',
  '  for (let i = 0; i <= cart.length; i++) {',
  '    total += cart[i].price;',
  '  }',
  '  return total * 0.9;',
  '}',
];

const ANNOTATIONS = [
  { afterLine: 3, type: 'bug', text: 'Off-by-one: i <= length will read past the array.' },
  { afterLine: 6, type: 'suggest', text: 'Discount rate is hardcoded — pull from config.' },
  { afterLine: 7, type: 'score', text: 'Quality score: 74/100' },
];

export default function CodePreview() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleAnnotations, setVisibleAnnotations] = useState([]);

  useEffect(() => {
    if (visibleLines < CODE_LINES.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 260);
      return () => clearTimeout(t);
    }
    ANNOTATIONS.forEach((a, i) => {
      setTimeout(() => setVisibleAnnotations((prev) => [...prev, a.afterLine]), 500 + i * 650);
    });
  }, [visibleLines]);

  const iconFor = (type) => (type === 'bug' ? Bug : type === 'suggest' ? Sparkles : CheckCircle2);

  return (
    <div className="preview glass-strong">
      <div className="preview-bar">
        <span /><span /><span />
        <p className="preview-filename mono">discount.js</p>
      </div>
      <div className="preview-body">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            <div className="preview-line">
              <span className="preview-line-no">{i + 1}</span>
              <span className="mono">{line}</span>
            </div>
            <AnimatePresence>
              {ANNOTATIONS.filter((a) => a.afterLine === i + 1 && visibleAnnotations.includes(a.afterLine)).map((a, idx) => {
                const Icon = iconFor(a.type);
                return (
                  <motion.div
                    key={idx}
                    className={`preview-annotation preview-annotation-${a.type}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={13} /><span>{a.text}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ))}
        {visibleLines < CODE_LINES.length && <span className="preview-cursor" />}
      </div>
    </div>
  );
}
