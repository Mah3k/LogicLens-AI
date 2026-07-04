import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AppLayout.css';

export default function AppLayout({ title, children }) {
  return (
    <div className="applayout">
      <Sidebar />
      <div className="applayout-main">
        <Topbar title={title} />
        <div className="applayout-content">{children}</div>
      </div>
    </div>
  );
}
