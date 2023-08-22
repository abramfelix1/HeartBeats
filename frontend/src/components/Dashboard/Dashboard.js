import React, { useEffect, useState } from "react";
import Navigation from "../Navigation";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

export default function Dashboard() {
  //   const dispatch = useDispatch();
  //   const [isLoaded, setIsLoaded] = useState(false);
  //   useEffect(() => {
  //     dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  //   }, [dispatch]);

  return (
    <div class="bg-[#FCF7F8] w-screen h-screen flex justify-center items-center  bg-gradient-to-r from-white via-sky-500 to-sky-500">
      {/* <Navigation isLoaded={isLoaded}></Navigation> */}
      <div>
        <p>TYPE SOMETHING HERE</p>
      </div>
    </div>
  );
}
