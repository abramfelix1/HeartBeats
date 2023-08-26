import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import { spotifyLogin } from "../../store/session";
import { getSpotifyUser } from "../../store/spotify";
import logo from "../../images/heartBeatLogo.png";
import spotifyLogo from "../../images/Spotify_Icon_RGB_Green.png";

import "./SignupForm.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
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
    <div className="bg-gradient-to-bl from-white via-azure-blue via-50% to-azure-blue relative">
      <div className="bg-login bg-cover bg-no-repeat absolute inset-0"></div>
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="flex relative bg-[#FFFFFC] min-w-[80%] h-[80%] rounded-3xl">
          <div className="flex flex-col justify-center items-center pl-20 py-20 w-[100%]">
            <h1>Sign Up!</h1>
            <div className="flex flex-col items- h-[175px] mb-4">
              {errors.email && <p className="error-message">{errors.email}</p>}
              {errors.username && (
                <p className="error-message">{errors.username}</p>
              )}
              {errors.firstName && (
                <p className="error-message">{errors.firstName}</p>
              )}
              {errors.lastName && (
                <p className="error-message">{errors.lastName}</p>
              )}
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>
            <form
              className="flex flex-col gap-y-6 justify-center items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-row gap-x-6 justify-center items center">
                <div className="flex flex-col">
                  {/* {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )} */}
                  <label htmlFor="email">Email</label>
                  <input
                    className="w-64 h-11 rounded-lg"
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  {/* {errors.username && (
                    <p className="error-message">{errors.username}</p>
                  )} */}
                  <label htmlFor="username">Username</label>
                  <input
                    className="w-64 h-11 rounded-lg"
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-row gap-x-6 justify-center items center">
                <div className="flex flex-col">
                  {/* {errors.firstName && (
                    <p className="error-message">{errors.firstName}</p>
                  )} */}
                  <label htmlFor="firstName">First Name</label>
                  <input
                    className="w-64 h-11 rounded-lg"
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  {/* {errors.lastName && (
                    <p className="error-message">{errors.lastName}</p>
                  )} */}
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    className="w-64 h-11 rounded-lg"
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-row gap-x-6 justify-center items center">
                <div className="flex flex-col">
                  {/* {errors.password && (
                    <p className="error-message">{errors.password}</p>
                  )} */}
                  <label htmlFor="password">Password</label>
                  <input
                    className="w-64 h-11 rounded-lg"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  {/* {errors.confirmPassword && (
                    <p className="error-message">{errors.confirmPassword}</p>
                  )} */}
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    className="w-64 h-11 rounded-lg"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-white w-96 h-11 rounded-lg border-[1px] border-black hover:bg-slate-200"
              >
                Sign Up
              </button>
              <div className="flex gap-2 justify-center">
                <p>Already have an account?</p>
                <NavLink
                  to="/login"
                  className="text-blue-500 hover:cursor-pointer "
                >
                  Log In
                </NavLink>
              </div>
            </form>
            <div className="flex items-center my-4">
              <div className="w-[180px] border-t border-slate-300 mr-2"></div>
              <p>Or</p>
              <div className="w-[180px] border-t border-slate-300 ml-2"></div>
            </div>
            <div className="flex flex-col justify-center items-center space-y-6">
              <button
                className="bg-white w-96 h-11 rounded-lg border-[1px] border-black hover:bg-slate-200"
                onClick={demoClickHandler}
              >
                <div className="flex flex-row gap-x-3 justify-center items-center relative">
                  <BiSolidUserCircle className="text-[35px] text-gray-500 absolute left-5" />
                  <p>Continue with Demo</p>
                </div>
              </button>
              <button
                className="bg-white w-96 h-11 rounded-lg border-[1px] border-black hover:bg-slate-200"
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

export default SignupFormPage;
