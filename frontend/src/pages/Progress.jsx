import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import AppLayout from "../components/common/AppLayout";
import Card from "../components/common/Card";
import ScoreChart from "../components/charts/ScoreChart";
import ActivityChart from "../components/charts/ActivityChart";
import ProgressBar from "../components/common/ProgressBar";
import { getProgressRequest } from "../services/api";
import "./Progress.css";

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState({
    scoreHistory: [],
    activity: [],
    skills: {
      readability: 0,
      bugFreeRate: 0,
      testing: 0,
      optimization: 0,
    },
    insights: [],
  });

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      const data = await getProgressRequest();
      setProgress(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout title="Progress">
        <Card>
          <h3>Loading progress...</h3>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Progress">
      <div className="progress-grid">
        <Card hover>
          <div className="dash-card-head">
            <h3>Score Improvement</h3>
            <span className="eyebrow">Latest Reviews</span>
          </div>

          <ScoreChart data={progress.scoreHistory} xKey="date" />
        </Card>

        <Card hover>
          <div className="dash-card-head">
            <h3>Coding Activity</h3>
            <span className="eyebrow">Last 7 Days</span>
          </div>

          <ActivityChart data={progress.activity} />
        </Card>
      </div>

      <Card hover className="progress-skills">
        <h3>Skill Improvement</h3>

        <div className="progress-skills-grid">
          <ProgressBar
            label="Code Readability"
            value={progress.skills.readability}
            color="signal"
          />

          <ProgressBar
            label="Bug-free Rate"
            value={progress.skills.bugFreeRate}
            color="signal"
          />

          <ProgressBar
            label="Testing"
            value={progress.skills.testing}
            color="signal"
          />

          <ProgressBar
            label="Optimization"
            value={progress.skills.optimization}
            color="signal"
          />
        </div>
      </Card>

      <Card hover className="progress-insights">
        <div className="dash-card-head">
          <h3>AI Insights</h3>
        </div>

        <div className="progress-insights-list">
          {progress.insights.map((line, i) => (
            <div key={i} className="progress-insight">
              <Sparkles size={15} />
              <p>{line}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
}
