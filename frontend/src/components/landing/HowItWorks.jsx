import { UploadCloud, Cpu, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import './HowItWorks.css';

const STEPS = [
  { n: '01', icon: UploadCloud, title: 'Upload code', desc: 'Paste a snippet or drop a file in any supported language.' },
  { n: '02', icon: Cpu, title: 'AI analysis', desc: 'LogicLens explains, scores, and rewrites it in seconds.' },
  { n: '03', icon: TrendingUp, title: 'Improve skills', desc: 'Track your score over time and watch the bug count drop.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="howitworks">
      <div className="container">
        <div className="features-head">
          <span className="eyebrow">The flow</span>
          <h2>Three steps, every time</h2>
        </div>
        <div className="howitworks-grid">
          {STEPS.map((s, i) => (
            <Card key={s.n} hover delay={i * 0.08} className="step-card">
              <span className="step-num mono">{s.n}</span>
              <div className="step-icon"><s.icon size={20} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </Card>
          ))}
          <div className="howitworks-line" />
        </div>
      </div>
    </section>
  );
}
