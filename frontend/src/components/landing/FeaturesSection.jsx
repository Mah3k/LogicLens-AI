import { BookOpenText, Bug, Sparkles, FlaskConical, Gauge } from 'lucide-react';
import Card from '../common/Card';
import './FeaturesSection.css';

const FEATURES = [
  { icon: BookOpenText, title: 'AI Code Explanation', desc: 'Line-by-line breakdowns of what your code actually does, in plain language.' },
  { icon: Bug, title: 'Bug Detection', desc: 'Catches logic errors, edge cases, and silent failures before your reviewer does.' },
  { icon: Sparkles, title: 'Optimization', desc: 'Rewrites slow or messy code into a cleaner, faster version with reasoning.' },
  { icon: FlaskConical, title: 'Test Generation', desc: 'Generates unit tests covering typical, edge, and failure cases automatically.' },
  { icon: Gauge, title: 'Code Scoring', desc: 'A quality score with performance and security ratings you can track over time.' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-head">
          <span className="eyebrow">What it does</span>
          <h2>Five reviews. One paste.</h2>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Card key={f.title} hover glow={i === 0} className="feature-card" delay={i * 0.06}>
              <div className="feature-icon"><f.icon size={20} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
