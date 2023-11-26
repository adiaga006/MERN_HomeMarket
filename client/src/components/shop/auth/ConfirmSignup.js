import React, { useState, useContext } from "react";
import { LayoutContext } from "../index";
import { confirmSignupReq } from "./fetchApi";

const ConfirmSignup = ({ emailFromSignUp }) => {
  const { dispatch } = useContext(LayoutContext);
  const [otp, setOtp] = useState("");

  const handleConfirm = async () => {
    try {
      // Gọi hàm confirmSignupReq từ fetchApi.js
      const response = await confirmSignupReq({ email: emailFromSignUp, otp });

      if (response.success) {
        alert(response.success);
        window.location.reload();
        dispatch({ type: "setConfirmedSignup", payload: true });
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Confirm Signup</h2>
      <p>Email: {emailFromSignUp}</p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
      />
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
};

export default ConfirmSignup;
