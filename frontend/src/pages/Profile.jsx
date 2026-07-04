import { useState, useEffect } from "react";
import {
  Mail,
  User as UserIcon,
  FileCheck2,
  Gauge,
  Star,
  ShieldCheck,
  Calendar,
  BadgeCheck,
} from "lucide-react";

import AppLayout from "../components/common/AppLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";

import {
  updateProfileRequest,
  getDashboardStatsRequest,
} from "../services/api";

import "./Profile.css";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");

  const [email, setEmail] = useState(user?.email || "");

  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState({
    totalReviews: 0,
    averageScore: 0,
    improvementLevel: "Beginner",
  });

  useEffect(() => {
    getDashboardStatsRequest()
      .then(setStats)
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const updated = await updateProfileRequest({
        name,
        email,
      });

      updateUser(updated);

      showToast("Profile updated successfully.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout title="Profile">
      <div className="profile-grid">

        {/* Left Card */}

        <Card hover>
          <div className="profile-header">
            <div className="profile-avatar">
              {name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3>{name}</h3>

              <p className="profile-sub">{email}</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              icon={UserIcon}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="field">
              <label className="field-label">
                Account Overview
              </label>

              <div className="profile-overview">

                <div className="profile-overview-item">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Account Status</strong>
                    <span>Active</span>
                  </div>
                </div>

                <div className="profile-overview-item">
                  <BadgeCheck size={18} />
                  <div>
                    <strong>Plan</strong>
                    <span>Free</span>
                  </div>
                </div>

                <div className="profile-overview-item">
                  <Calendar size={18} />
                  <div>
                    <strong>Member Since</strong>
                    <span>2026</span>
                  </div>
                </div>

              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>

        {/* Right Card */}

        <Card hover>

          <h3 className="profile-stats-title">
            Developer Statistics
          </h3>

          <div className="profile-stats">

            <div className="profile-stat">
              <FileCheck2 size={18} />

              <div>
                <p className="profile-stat-num">
                  {stats.totalReviews}
                </p>

                <p>Total Reviews</p>
              </div>
            </div>

            <div className="profile-stat">
              <Gauge size={18} />

              <div>
                <p className="profile-stat-num">
                  {stats.averageScore}
                </p>

                <p>Average Score</p>
              </div>
            </div>

            <div className="profile-stat">
              <Star size={18} />

              <div>
                <p className="profile-stat-num">
                  {stats.improvementLevel}
                </p>

                <p>Skill Level</p>
              </div>
            </div>

            <div className="profile-stat">
              <BadgeCheck size={18} />

              <div>
                <p className="profile-stat-num">
                  {stats.averageScore >= 85
                    ? "Excellent"
                    : stats.averageScore >= 70
                    ? "Good"
                    : "Improving"}
                </p>

                <p>Performance</p>
              </div>
            </div>

          </div>
        </Card>

      </div>
    </AppLayout>
  );
}