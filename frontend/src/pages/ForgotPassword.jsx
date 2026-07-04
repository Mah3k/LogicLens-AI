import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ScanLine,
  ArrowLeft,
  Mail,
  KeyRound,
  Lock,
  CheckCircle2,
} from "lucide-react";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useToast } from "../components/common/Toast";

import {
  forgotPasswordRequest,
  verifyOtpRequest,
  resetPasswordRequest,
  resendOtpRequest,
} from "../services/api";

import "./AuthLayout.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step !== 2) return;

    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, step]);

  async function sendOtp(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await forgotPasswordRequest(email);

      showToast("OTP sent successfully.", "success");

      setStep(2);

      setTimer(30);

      setCanResend(false);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await verifyOtpRequest(email, otp);

      showToast("OTP verified successfully.", "success");

      setStep(3);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    try {
      setLoading(true);

      await resendOtpRequest(email);

      showToast("A new OTP has been sent.", "success");

      setTimer(30);

      setCanResend(false);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await resetPasswordRequest(email, otp, newPassword);

      showToast("Password changed successfully.", "success");

      setStep(4);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-glow" />

        <Link to="/" className="auth-side-logo">
          <ScanLine size={22} />
          <span>
            LogicLens <em>AI</em>
          </span>
        </Link>

        <div className="auth-side-quote">
          <p>Forgot your password?</p>

          <span>
            Verify your email with an OTP and securely create a new password.
          </span>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <Link to="/login" className="auth-form-back">
            <ArrowLeft size={14} />
            Back to Login
          </Link>

          {step === 1 && (
            <>
              <h2>Forgot Password</h2>

              <p className="auth-form-sub">
                Enter your registered email address.
              </p>

              <form className="auth-form" onSubmit={sendOtp}>
                <Input
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  full
                  size="lg"
                  loading={loading}
                >
                  Send OTP
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Verify OTP</h2>

              <p className="auth-form-sub">
                Enter the 6-digit OTP sent to
                <br />
                <strong>{email}</strong>
              </p>

              <form className="auth-form" onSubmit={verifyOtp}>
                <Input
                  label="OTP"
                  icon={KeyRound}
                  value={otp}
                  required
                  onChange={(e) => setOtp(e.target.value)}
                />

                <Button
                  type="submit"
                  full
                  size="lg"
                  loading={loading}
                >
                  Verify OTP
                </Button>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "18px",
                  }}
                >
                  {canResend ? (
                    <button
                      type="button"
                      className="auth-link-button"
                      onClick={resendOtp}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="auth-form-sub">
                      Resend OTP in <strong>{timer}s</strong>
                    </p>
                  )}
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Create New Password</h2>

              <p className="auth-form-sub">
                Choose a strong password for your account.
              </p>

              <form className="auth-form" onSubmit={resetPassword}>
                <Input
                  label="New Password"
                  icon={Lock}
                  type="password"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  full
                  size="lg"
                  loading={loading}
                >
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {step === 4 && (
            <>
              <CheckCircle2
                size={40}
                color="var(--signal)"
                style={{ marginBottom: "18px" }}
              />

              <h2>Password Reset Successfully</h2>

              <p className="auth-form-sub">
                Your password has been updated successfully.
                <br />
                You can now login using your new password.
              </p>

              <Button
                full
                size="lg"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}