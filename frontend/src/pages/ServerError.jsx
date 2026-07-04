import { Link } from 'react-router-dom';
import { ScanLine, RotateCcw } from 'lucide-react';
import Button from '../components/common/Button';
import './ErrorPage.css';

export default function ServerError() {
  return (
    <div className="errorpage">
      <div className="errorpage-glow errorpage-glow-danger" />
      <ScanLine size={30} className="errorpage-icon" />
      <h1 className="errorpage-code">500</h1>
      <h2>Something broke on our end</h2>
      <p>Our AI mentor hit an unhandled exception. Try again in a moment.</p>
      <Button icon={RotateCcw} onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );
}
