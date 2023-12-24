import React, { useState } from "react";
import { resetPasswordAfterOtp } from "./fetchApi";
import { sendOtpForResetPassword } from "./fetchApi";
import "./style.css";

const PasswordResetForm = ({ email }) => {
  const [otp, setOtp] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleResetPassword = async () => {
    try {
      if (newPassword.length < 8 || newPassword.length > 255) {
        setError("The new password must be between 8 and 255 characters long");
        return;
      }

      // Check if the new password and confirm password match
      if (newPassword !== confirmPassword) {
        setError("The new password and confirm password do not match");
        return;
      }

      const response = await resetPasswordAfterOtp(email, otp, newPassword);

      if (response.success) {
        window.alert("Change Password successfully. Please Login");
        // Reload the page after successful password reset
        window.location.reload();
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="password-reset-form">
      <label htmlFor="otp">
        Enter OTP<span>*</span>
      </label>
      <input
        type="text"
        id="otp"
        key="otp"
        defaultValue={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <label htmlFor="newPassword">
        Enter new password<span>*</span>
      </label>
      <input
        type="password"
        id="newPassword"
        key="newPassword"
        defaultValue={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <label htmlFor="confirmPassword">
        Confirm new password<span>*</span>
      </label>
      <input
        type="password"
        id="confirmPassword"
        key="confirmPassword"
        defaultValue={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

// ... (rest of the code remains the same)


const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    try {
      const response = await sendOtpForResetPassword(email);

      if (response.success) {
        setShowResetForm(true);
        setError(null); 
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error during sending OTP:", error);
      setError("An error occurred. Please try again.");
    }
  };
  return (
    <div className="password-reset-container">
      {!showResetForm ? (
        <div className="email-input-container">
          <label htmlFor="email">
            Enter your email<span>*</span>
          </label>
          <input
            type="text"
            id="email"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <PasswordResetForm email={email} setError={setError} />
      )}
    </div>
  );
};

export default PasswordReset;