import './Skeleton.css';

export function Skeleton({ width = '100%', height = '16px', radius = '8px', className = '' }) {
  return <div className={`skeleton ${className}`} style={{ width, height, borderRadius: radius }} />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card glass">
      <Skeleton width="40%" height="13px" />
      <Skeleton width="65%" height="26px" />
      <Skeleton width="90%" height="10px" />
    </div>
  );
}
