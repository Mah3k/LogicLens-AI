import { useState } from "react";
import { Lock, Trash2 } from "lucide-react";

import AppLayout from "../components/common/AppLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useToast } from "../components/common/Toast";

import {
  changePasswordRequest,
  deleteAccountRequest,
} from "../services/api";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "./Settings.css";

export default function Settings() {
  const { showToast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (
      !passwords.current ||
      !passwords.next ||
      !passwords.confirm
    ) {
      showToast("Please fill in all password fields.", "error");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      setLoading(true);

      await changePasswordRequest({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });

      showToast("Password updated successfully.", "success");

      setPasswords({
        current: "",
        next: "",
        confirm: "",
      });
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Failed to update password.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure?\n\nThis will permanently delete your account and all your reviews."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteAccountRequest();

      showToast("Account deleted successfully.", "success");

      logout();

      navigate("/login");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Could not delete account.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <div className="settings-list">

        {/* Change Password */}
        <Card hover>
          <div className="settings-head">
            <Lock size={18} />
            <h3>Change Password</h3>
          </div>

          <form
            className="auth-form settings-form"
            onSubmit={handlePasswordUpdate}
          >
            <Input
              label="Current Password"
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  current: e.target.value,
                })
              }
            />

            <Input
              label="New Password"
              type="password"
              value={passwords.next}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  next: e.target.value,
                })
              }
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirm: e.target.value,
                })
              }
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card hover className="settings-danger">
          <div className="settings-head">
            <Trash2 size={18} />
            <h3>Danger Zone</h3>
          </div>

          <div className="settings-row">
            <div>
              <p className="settings-row-title">
                Delete Account
              </p>

              <p className="settings-row-sub">
                Permanently delete your account and all saved reviews.
              </p>
            </div>

            <Button
              variant="danger-outline"
              size="sm"
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </Card>

      </div>
    </AppLayout>
  );
}