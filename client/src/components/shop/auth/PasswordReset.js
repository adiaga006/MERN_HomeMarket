import React, { useState } from "react";
import { resetPasswordAfterOtp } from "./fetchApi";
import { sendOtpForResetPassword } from "./fetchApi";
const PasswordResetForm = ({ email }) => {
  const [otp, setOtp] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleResetPassword = async () => {
    try {
      if (newPassword.length < 8 || newPassword.length > 255) {
        setError("Mật khẩu mới phải có độ dài từ 8 đến 255 ký tự.");
        return;
      }
      const response = await resetPasswordAfterOtp(email, otp, newPassword);

      if (response.success) {
        setSuccessMessage(response.success);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
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

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [error, setError] = useState(null);

const handleSendOtp = async () => {
    try {
      const response = await sendOtpForResetPassword(email);
  
      if (response.success) {
        setShowResetForm(true); // This is a callback to inform the parent component
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error during sending OTP:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {!showResetForm ? (
        <div>
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
        </div>
      ) : (
        <PasswordResetForm email={email} />
      )}
    </div>
  );
};

export default PasswordReset;
