import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import logo from "../../images/heartBeatLogo.png";
import spotifyLogo from "../../images/Spotify_Icon_RGB_Green.png";

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
    <div class="bg-sky-500 relative ">
      <div className="bg-login bg-cover bg-no-repeat absolute inset-0"></div>
      <div class="flex justify-center items-center w-screen h-screen">
        <div class="flex relative bg-[#FFFFFC] w-[80%] h-[80%] rounded-3xl">
          <div class="flex flex-col justify-center items-center pl-20 py-20 w-[40%]">
            <h1>Welcome Back!</h1>
            <div class="h-[20px] my-4">
              {errors.credential && (
                <p className="error-message">{errors.credential}</p>
              )}
            </div>
            <form
              class="flex flex-col gap-y-6 justify-center items-center"
              onSubmit={handleSubmit}
            >
              <div class="flex flex-col">
                <label htmlFor="credential">Username or Email</label>
                <input
                  class="w-96 h-11 rounded-lg"
                  type="text"
                  id="credential"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  required
                />
              </div>
              <div class="flex flex-col">
                <label htmlFor="password">Password</label>
                <input
                  class="w-96 h-11 rounded-lg"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                class="bg-white w-96 h-11 rounded-lg border-[1px] border-black"
                type="submit"
              >
                Log In
              </button>
              <div class="flex gap-2 justify-center">
                <p>Don't Have an account?</p>
                <p class="text-blue-500 hover:cursor-pointer">Sign Up</p>
              </div>
            </form>
            <div class="flex items-center my-4">
              <div class="w-[180px] border-t border-slate-300 mr-2"></div>
              <p>Or</p>
              <div class="w-[180px] border-t border-slate-300 ml-2"></div>
            </div>
            <div class="flex flex-col justify-center items-center space-y-6">
              <button class="bg-white w-96 h-11 rounded-lg border-[1px] border-black">
                <div class="flex flex-row gap-x-3 justify-center items-center relative">
                  <BiSolidUserCircle class="text-[35px] text-gray-500 absolute left-5" />
                  <p>Continue with Demo</p>
                </div>
              </button>
              <button class="bg-white w-96 h-11 rounded-lg border-[1px] border-black">
                <div class="flex flex-row gap-x-3 justify-center items-center relative">
                  <img
                    src={spotifyLogo}
                    alt="spotifyLogo"
                    class="w-[30px] absolute left-5"
                  />
                  <p>Continue with Spotify</p>
                </div>
              </button>
            </div>
          </div>
          <div class="flex flex-col justify-center items-center w-full">
            <img src={logo} alt="logo" class="w-[200px]" />
            <p>
              CONVERT THIS TO SVG LATER, FIND FONT FOR TITLE,FILL WHITESPACE W/
              BACKGROUND IMG(MAKE ONE LATER)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
