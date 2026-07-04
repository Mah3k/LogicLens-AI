import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ScanLine } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <ScanLine size={22} strokeWidth={2.4} />
          <span>LogicLens <em>AI</em></span>
        </Link>

        <nav className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>

        <div className="navbar-actions">
          <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Get started</Button>
        </div>

        <button className="navbar-burger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          className="navbar-mobile"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <Button variant="secondary" full onClick={() => navigate('/login')}>Log in</Button>
          <Button variant="primary" full onClick={() => navigate('/register')}>Get started</Button>
        </motion.div>
      )}
    </header>
  );
}
