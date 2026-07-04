import { motion } from "framer-motion";
import {
  Bug,
  Sparkles,
  FlaskConical,
  BookOpenText,
  Copy,
} from "lucide-react";

import LoadingAnimation from "../common/LoadingAnimation";
import Button from "../common/Button";

import "./ResultPanel.css";

const TABS = [
  { id: "explain", label: "Explanation", icon: BookOpenText },
  { id: "bugs", label: "Bugs", icon: Bug },
  { id: "optimize", label: "Optimized", icon: Sparkles },
  { id: "tests", label: "Test Cases", icon: FlaskConical },
];

export default function ResultPanel({
  loading,
  result,
  activeTab,
  setActiveTab,
}) {
  if (loading) {
    return (
      <div className="result-panel glass">
        <LoadingAnimation />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-panel glass result-empty">
        <div className="result-empty-icon">
          <Sparkles size={26} />
        </div>
        <h3>Your AI review will appear here</h3>
        <p>
          Paste code on the left, choose what you want checked, and run the
          analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="result-panel glass">
      {/* SCORE */}
      <div className="result-score-row">
        <div className="result-score">
          <span className="result-score-num">{result.score}</span>
          <span className="result-score-max">/100</span>
        </div>

        <div className="result-score-meta">
          <p className="result-score-label">Code quality score</p>

          <div className="result-score-tags">
            <span className="tag tag-perf">
              Performance {result.performance}
            </span>
            <span className="tag tag-sec">
              Security {result.security}
            </span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="result-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`result-tab ${
              activeTab === id ? "result-tab-active" : ""
            }`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="result-content mono"
      >
        {activeTab === "explain" &&
          result.explanation.map((line, i) => (
            <div key={i} className="result-line">
              <span className="result-line-no">{i + 1}</span>
              {line}
            </div>
          ))}

        {activeTab === "bugs" &&
          (result.bugs.length ? (
            result.bugs.map((b, i) => (
              <div key={i} className="result-issue">
                <span className="result-issue-sev">
                  {b.severity}
                </span>
                <div>
                  <p className="result-issue-title">{b.title}</p>
                  <p className="result-issue-desc">{b.detail}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="result-clean">
              No bugs detected — nice work.
            </p>
          ))}

        {activeTab === "optimize" && (
          <pre>{result.optimizedCode}</pre>
        )}

        {activeTab === "tests" && (
          <pre>{result.tests}</pre>
        )}
      </motion.div>

      {/* ACTIONS */}
      <div className="result-actions">
        <Button
          variant="secondary"
          size="sm"
          icon={Copy}
          onClick={() =>
            navigator.clipboard.writeText(result.optimizedCode)
          }
        >
          Copy code
        </Button>
      </div>
    </div>
  );
}