import React, { Fragment, useState, useContext } from "react";
import { loginReq } from "./fetchApi";
import { LayoutContext } from "../index";
import PasswordReset from "./PasswordReset";

const Login = (props) => {
  const { data: layoutData, dispatch: layoutDispatch } =
    useContext(LayoutContext);

  const [data, setData] = useState({
    email: "",
    password: "",
    error: false,
    loading: true,
    showPasswordReset: false,
  });

  const alert = (msg) => <div className="text-xs text-red-500">{msg}</div>;

  const formSubmit = async () => {
    setData({ ...data, loading: true });
    try {
      let responseData = await loginReq({
        email: data.email,
        password: data.password,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
        });
      } else if (responseData.token) {
        setData({ email: "", password: "", loading: false, error: false });
        localStorage.setItem("jwt", JSON.stringify(responseData));
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLostPassword = () => {
    setData({ ...data, showPasswordReset: true });
  };

  const handleResetSuccess = () => {
    setData({ ...data, showPasswordReset: false });
  };

  return (
    <Fragment>
      <div className="text-center text-2xl mb-6">Login</div>
      {layoutData.loginSignupError ? (
        <div className="bg-red-200 py-2 px-4 rounded">
          You need to login for checkout. Haven't accont? Create new one.
        </div>
      ) : (
        ""
      )}
      {data.showPasswordReset ? (
        <PasswordReset onResetSuccess={handleResetSuccess} />
      ) : (
        <form className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name">
              Email address
              <span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) => {
                setData({ ...data, email: e.target.value, error: false });
                layoutDispatch({ type: "loginSignupError", payload: false });
              }}
              value={data.email}
              type="text"
              id="name"
              className={`${!data.error ? "" : "border-red-500"
                } px-4 py-2 focus:outline-none border`}
            />
            {!data.error ? "" : alert(data.error)}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">
              Password<span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) => {
                setData({ ...data, password: e.target.value, error: false });
                layoutDispatch({ type: "loginSignupError", payload: false });
              }}
              value={data.password}
              type="password"
              id="password"
              className={`${!data.error ? "" : "border-red-500"
                } px-4 py-2 focus:outline-none border`}
            />
            {!data.error ? "" : alert(data.error)}
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
            <div className="flex items-center space-x-2">
              {" "}
              {/* Updated this line */}
            </div>

            <button
              onClick={handleLostPassword}
              className="block text-white-600"
            >
              Lost your password?
            </button>
          </div>
          <div
            onClick={(e) => formSubmit()}
            style={{ background: "#303031" }}
            className="font-medium px-4 py-2 text-white text-center cursor-pointer"
          >
            Login
          </div>
        </form>
      )}
    </Fragment>
  );
};

export default Login;
