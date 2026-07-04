import { Quote } from 'lucide-react';
import Card from '../common/Card';
import { testimonials } from '../../utils/mockData';
import './Testimonials.css';

export default function Testimonials() {
  return (
    <section id="about" className="testimonials">
      <div className="container">
        <div className="features-head">
          <span className="eyebrow">Used by developers</span>
          <h2>What early users say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <Card key={t.name} hover delay={i * 0.08} className="testimonial-card">
              <Quote size={20} className="testimonial-quote-icon" />
              <p className="testimonial-text">{t.quote}</p>
              <div className="testimonial-foot">
                <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-role">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
