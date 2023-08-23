import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

// import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
    <div class="bg-sky-500">
      <div class="flex justify-center items-center w-screen h-screen ">
        <div class="flex bg-white w-[80%] h-[80%] rounded-3xl">
          <div class="flex flex-col justify-center items-center pl-20 py-20 w-[40%]">
            <h1 class="mb-20">Welcome Back!</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="credential">Username or Email</label>
                <input
                  type="text"
                  id="credential"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  required
                  class="w-[500px]"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {errors.credential && (
                <p className="error-message">{errors.credential}</p>
              )}
              <button type="submit" class="w-[500px]">
                Log In
              </button>
              <div class="flex">
                <p className="mr-2">Don't Have an account?</p>
                <p>Sign Up</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
