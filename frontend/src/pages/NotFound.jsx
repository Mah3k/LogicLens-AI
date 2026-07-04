import { Link } from 'react-router-dom';
import { ScanLine, Home } from 'lucide-react';
import Button from '../components/common/Button';
import './ErrorPage.css';

export default function NotFound() {
  return (
    <div className="errorpage">
      <div className="errorpage-glow" />
      <ScanLine size={30} className="errorpage-icon" />
      <h1 className="errorpage-code">404</h1>
      <h2>This page didn't compile</h2>
      <p>The route you're looking for doesn't exist, or may have moved.</p>
      <Link to="/"><Button icon={Home}>Back to home</Button></Link>
    </div>
  );
}
