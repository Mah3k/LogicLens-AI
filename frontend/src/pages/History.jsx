import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileSearch, Pencil, Trash2, X } from "lucide-react";

import AppLayout from "../components/common/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useToast } from "../components/common/Toast";

import {
  getHistoryRequest,
  renameReviewRequest,
  deleteReviewRequest,
} from "../services/api";

import "./History.css";

const FILTERS = ["All", "Java", "JavaScript", "Python"];

export default function History() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const [renameOpen, setRenameOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedReview, setSelectedReview] = useState(null);

  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const data = await getHistoryRequest();

      setHistory(data);
    } catch (err) {
      console.error(err);

      showToast("Unable to load review history.", "error");
    } finally {
      setLoading(false);
    }
  }
  function openRename(review) {
    setSelectedReview(review);

    setNewTitle(review.title);

    setRenameOpen(true);
  }

  function openDelete(review) {
    setSelectedReview(review);

    setDeleteOpen(true);
  }

  async function renameReview() {
    if (!newTitle.trim()) {
      showToast("Title cannot be empty.", "error");

      return;
    }

    try {
      await renameReviewRequest(selectedReview.id, newTitle);

      showToast("Review renamed.", "success");

      setRenameOpen(false);

      loadHistory();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function deleteReview() {
    try {
      await deleteReviewRequest(selectedReview.id);

      showToast("Review deleted.", "success");

      setDeleteOpen(false);

      loadHistory();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  const filtered = useMemo(() => {
    return history.filter(
      (r) =>
        (filter === "All" || r.language === filter) &&
        r.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [history, filter, query]);

  if (loading) {
    return (
      <AppLayout title="Review History">
        <h3>Loading reviews...</h3>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Review History">
      <div className="history-bar">
        <div className="history-search">
          <Search size={16} />
          <input
            placeholder="Search reviews..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="history-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`analyzer-chip ${
                filter === f ? "analyzer-chip-active" : ""
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="history-empty glass">
          <FileSearch size={26} />
          <h3>No Reviews Found</h3>
          <p>You haven't analyzed any code yet.</p>
        </div>
      ) : (
        <div className="history-grid">
          {filtered.map((r, i) => (
            <Card key={r.id} hover delay={i * 0.03} className="history-card">
              <div className="history-card-top">
                <span className="history-lang">{r.language}</span>

                <span
                  className={`dash-recent-score ${
                    r.score >= 80 ? "good" : r.score >= 60 ? "ok" : "low"
                  }`}
                >
                  {r.score}
                </span>
              </div>

              <div
                className="history-main"
                onClick={() => navigate(`/review/${r.id}`)}
              >
                <p className="history-title">{r.title}</p>

                <p className="history-date">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="history-actions">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Pencil}
                  onClick={() => openRename(r)}
                >
                  Rename
                </Button>

                <Button
                  size="sm"
                  variant="danger-outline"
                  icon={Trash2}
                  onClick={() => openDelete(r)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Rename Modal */}

      {renameOpen && (
        <div className="history-modal">
          <div className="history-modal-card">
            <div className="history-modal-head">
              <h3>Rename Review</h3>

              <button onClick={() => setRenameOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <input
              className="history-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="history-modal-buttons">
              <Button variant="secondary" onClick={() => setRenameOpen(false)}>
                Cancel
              </Button>

              <Button onClick={renameReview}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}

      {deleteOpen && (
        <div className="history-modal">
          <div className="history-modal-card">
            <h3>Delete this review?</h3>

            <p>This action cannot be undone.</p>

            <div className="history-modal-buttons">
              <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>

              <Button variant="danger" onClick={deleteReview}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
