import { ScanLine, Code2, Globe, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="navbar-logo"><ScanLine size={20} /> LogicLens <em>AI</em></span>
          <p>An AI-powered code mentor for developers who want to ship cleaner code, faster.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="/login">Sign in</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="mailto:hello@logiclens.ai">Contact</a>
          </div>
        </div>
        <div className="footer-social">
          <a href="#" aria-label="GitHub"><Code2 size={17} /></a>
          <a href="#" aria-label="LinkedIn"><Globe size={17} /></a>
          <a href="mailto:hello@logiclens.ai" aria-label="Email"><Mail size={17} /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© 2026 LogicLens AI. Built for developers, by a developer.</div>
      </div>
    </footer>
  );
}
