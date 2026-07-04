import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck2,
  Gauge,
  TrendingUp,
  ScanSearch,
  ArrowRight,
} from "lucide-react";

import AppLayout from "../components/common/AppLayout";
import StatsCard from "../components/dashboard/StatsCard";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ScoreChart from "../components/charts/ScoreChart";
import { useAuth } from "../context/AuthContext";

import { getDashboardStatsRequest, getHistoryRequest } from "../services/api";

import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalReviews: 0,
    averageScore: 0,
    improvementLevel: "Beginner",
  });

  const [reviews, setReviews] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const statsData = await getDashboardStatsRequest();
      const history = await getHistoryRequest();

      console.log("Dashboard Stats:", statsData);
      console.log("History:", history);

      setStats(statsData);
      setReviews(history);

      // Build chart data
      const chartDataArray = history
        .slice()
        .reverse()
        .map((review) => ({
          label: new Date(review.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
          score: review.score ?? 0,
        }));

      console.log("Chart Data:", chartDataArray);

      setChartData(chartDataArray);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <h2>Loading Dashboard...</h2>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      <div className="dash-welcome">
        <div>
          <h2>
            Welcome back
            {user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h2>

          <p>Here's how your code reviews are progressing.</p>
        </div>

        <Button icon={ScanSearch} onClick={() => navigate("/analyze")}>
          New Analysis
        </Button>
      </div>

      <div className="dash-stats">
        <StatsCard
          icon={FileCheck2}
          label="Total Reviews"
          value={stats.totalReviews}
        />

        <StatsCard
          icon={Gauge}
          label="Average Score"
          value={stats.averageScore}
        />

        <StatsCard
          icon={TrendingUp}
          label="Improvement Level"
          value={stats.improvementLevel}
        />
      </div>

      <div className="dash-grid">
        <Card className="dash-chart-card" hover>
          <div className="dash-card-head">
            <h3>Score Trend</h3>
            <span className="eyebrow">Previous Reviews</span>
          </div>

          <ScoreChart data={chartData} xKey="label" />
        </Card>

        <Card hover>
          <div className="dash-card-head">
            <h3>Recent Reviews</h3>

            <button
              className="dash-viewall"
              onClick={() => navigate("/history")}
            >
              View all <ArrowRight size={13} />
            </button>
          </div>

          <div className="dash-recent-list">
            {reviews.length === 0 ? (
              <p style={{ textAlign: "center", opacity: 0.7 }}>
                No reviews yet.
              </p>
            ) : (
              reviews.slice(0, 4).map((review) => (
                <button
                  key={review.id}
                  className="dash-recent-item"
                  onClick={() => navigate(`/review/${review.id}`)}
                >
                  <div>
                    <p className="dash-recent-title">{review.title}</p>

                    <p className="dash-recent-meta">
                      {review.language} •{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`dash-recent-score ${
                      review.score >= 80
                        ? "good"
                        : review.score >= 60
                          ? "ok"
                          : "low"
                    }`}
                  >
                    {review.score}
                  </span>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
