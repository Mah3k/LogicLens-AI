import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  ShieldCheck,
  Gauge,
} from 'lucide-react';

import AppLayout from '../components/common/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingAnimation from '../components/common/LoadingAnimation';
import { useToast } from '../components/common/Toast';

import { getReviewRequest } from '../services/api';

import './ReviewResult.css';

export default function ReviewResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReview();
  }, [id]);

  async function loadReview() {
    try {
      const data = await getReviewRequest(id);
      setReview(data);
    } catch (err) {
      showToast(err.message || 'Unable to load review.', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout title="Review Result">
        <LoadingAnimation />
      </AppLayout>
    );
  }

  if (!review) {
    return (
      <AppLayout title="Review Result">
        <h2>Review not found.</h2>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Review Result">
      <button
        className="review-back"
        onClick={() => navigate('/history')}
      >
        <ArrowLeft size={14} />
        Back to history
      </button>

      <Card className="review-head">
        <div>
          <h2>{review.title}</h2>

          <p className="review-meta">
            {review.language} •{' '}
            {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="review-ratings">
          <div className="review-rating">
            <Gauge size={16} />

            <div>
              <p className="review-rating-num">
                {review.score}
              </p>

              <p>Quality Score</p>
            </div>
          </div>

          <div className="review-rating">
            <ShieldCheck size={16} />

            <div>
              <p className="review-rating-num">
                {review.securityRating}
              </p>

              <p>Security</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="review-sections">

        <Card hover>
          <h3>Line-by-line Explanation</h3>

          <div className="review-explain">
            {review.explanation?.map((line, index) => (
              <div
                key={index}
                className="result-line mono"
              >
                <span className="result-line-no">
                  {index + 1}
                </span>

                {line}
              </div>
            ))}
          </div>
        </Card>

        <Card hover>
          <h3>Detected Issues & Recommended Fixes</h3>

          {review.bugs?.length ? (
            review.bugs.map((bug, index) => (
              <div
                key={index}
                className="result-issue"
              >
                <span className="result-issue-sev">
                  {bug.severity}
                </span>

                <div>
                  <p className="result-issue-title">
                    {bug.title}
                  </p>

                  <p className="result-issue-desc">
                    {bug.detail}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="result-clean">
              No issues found in this review.
            </p>
          )}
        </Card>

        <Card
          hover
          className="review-optimized"
        >
          <h3>Optimized Code</h3>

          <pre className="mono">
            {review.optimizedCode}
          </pre>

          <div className="review-actions">
            <Button
              variant="secondary"
              size="sm"
              icon={Copy}
              onClick={() => {
                navigator.clipboard.writeText(
                  review.optimizedCode
                );

                showToast(
                  'Copied to clipboard.',
                  'success'
                );
              }}
            >
              Copy Code
            </Button>
          </div>
        </Card>

        <Card hover>
          <h3>Generated Test Cases</h3>

          <pre className="mono">
            {review.tests}
          </pre>
        </Card>

      </div>
    </AppLayout>
  );
}