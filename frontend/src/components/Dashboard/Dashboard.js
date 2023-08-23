import React, { useEffect, useState } from "react";
import Navigation from "../Navigation";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div class="bg-[#FCF7F8] w-screen h-screen flex bg-gradient-to-r from-white via-sky-400 via-30% to-sky-400 overflow-hidden">
      <Navigation isLoaded={isLoaded}></Navigation>
      <div class="flex justify-center items-center w-full h-full">
        <p>PAGES HERE</p>
      </div>
    </div>
  );
}
