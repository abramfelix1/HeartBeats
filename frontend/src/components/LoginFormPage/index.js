import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import { spotifyLogin } from "../../store/session";
import { getSpotifyUser } from "../../store/spotify";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import logo from "../../images/heartBeatLogo.png";
import spotifyLogo from "../../images/Spotify_Icon_RGB_Green.png";

// import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) =>
    state.session.user ? state.session.user.id : null
  );
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

  const demoClickHandler = (e) => {
    return dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });
  };

  const spotifyClickHandler = async () => {
    await dispatch(spotifyLogin());
  };

  return (
    <div className="text-txt-1 bg-gradient-to-bl from-white via-azure-blue via-50% to-azure-blue relative">
      <div className="bg-login bg-cover bg-no-repeat absolute inset-0"></div>
      <div className="flex justify-center items-center w-screen h-screen overflow-hidden">
        <div className="flex relative bg-bkg-card w-[80%]  rounded-3xl  lg:w-[75%] xl:w-[80%]">
          <div className="flex flex-col w-full items-center pl-20 py-20">
            <h1>Welcome Back!</h1>
            <div className="h-[20px] my-4">
              {errors.credential && (
                <p className="error-message">{errors.credential}</p>
              )}
            </div>
            <form
              className="flex flex-col gap-y-6 items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col">
                <label htmlFor="credential">Username or Email</label>
                <input
                  className="bg-bkg-button focus:border-text-txt-hover border-transparent outline-none caret-text-txt-hover w-96 h-11 rounded-lg"
                  type="text"
                  id="credential"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input
                  className="bg-bkg-button focus:border-text-txt-hover border-transparent outline-none caret-text-txt-hover w-96 h-11 rounded-lg"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="bg-bkg-button hover:border-txt-hover border-bkg-nav  w-96 h-11 rounded-lg border-[1px] "
                type="submit"
              >
                Log In
              </button>
              <div className="flex gap-2 justify-center">
                <p>Don't Have an account?</p>
                <NavLink
                  to="/signup"
                  className="text-blue-500 hover:cursor-pointer"
                >
                  Sign Up
                </NavLink>
              </div>
            </form>
            <div className="flex items-center my-4">
              <div className="w-[180px] border-t border-bkg-nav mr-2"></div>
              <p>Or</p>
              <div className="w-[180px] border-t border-bkg-nav ml-2"></div>
            </div>
            <div className="flex flex-col justify-center items-center space-y-6">
              <button
                className="bg-bkg-button hover:border-txt-hover  w-96 h-11 rounded-lg border-[1px] border-bkg-nav"
                onClick={demoClickHandler}
              >
                <div className="flex flex-row gap-x-3 justify-center items-center relative">
                  <BiSolidUserCircle className="text-[35px] text-txt-1 absolute left-5" />
                  <p>Continue with Demo</p>
                </div>
              </button>
              <button
                className="bg-bkg-button hover:border-txt-hover  w-96 h-11 rounded-lg border-[1px] border-bkg-nav"
                onClick={spotifyClickHandler}
              >
                <div className="flex flex-row gap-x-3 justify-center items-center relative">
                  <img
                    src={spotifyLogo}
                    alt="spotifyLogo"
                    className="w-[30px] absolute left-5"
                  />
                  <p>Continue with Spotify</p>
                </div>
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <img src={logo} alt="logo" className="w-[200px]" />
            <p>CONVERT THIS TO SVG LATER, PUTS GIFs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
