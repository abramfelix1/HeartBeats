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
            <form class="items-center space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="credential">Username or Email</label>
                <input
                  class="w-[500px] h-[45px] rounded-lg"
                  type="text"
                  id="credential"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  class="w-[500px] h-[45px] rounded-lg"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                class="bg-slate-500 w-[500px] h-[45px] rounded-lg"
                type="submit"
              >
                Log In
              </button>
              <div class="flex justify-center">
                <p className="mr-2">Don't Have an account?</p>
                <p>Sign Up</p>
              </div>
            </form>
            <div class="flex items-center my-4">
              <div class="w-[235px] border-t border-slate-300 mr-2"></div>
              <p>Or</p>
              <div class="w-[235px] border-t border-slate-300 ml-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
