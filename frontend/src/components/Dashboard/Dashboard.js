import React, { useContext, useEffect, useState } from "react";
import Navigation from "../Navigation";
import JournalContainer from "../Journals.js/JournalContainer";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { getSpotifyUser } from "../../store/spotify";
import Modal from "../../utils/Modal";
import { JournalContext } from "../../context/journalContext";
import SongsContainer from "../Songs/SongsContainer";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { journalOpen } = useContext(JournalContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [navHovered, setNavHovered] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(getSpotifyUser());
    dispatch(sessionActions.checkLoggedIn());
  }, [dispatch]);

  useEffect(() => {
    console.log("NAV HOVERED: ", navHovered);
  }, [navHovered]);

  useEffect(() => {
    console.log("DASHBOARD: ", journalOpen);
  }, [journalOpen]);

  return (
    <>
      <Modal />
      <div className="w-screen h-screen flex bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7CA8D2] from-0% to-azure-blue to-100%">
        <Navigation
          isLoaded={isLoaded}
          navHovered={navHovered}
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        />
        {journalOpen && <JournalContainer />}
        <SongsContainer />
      </div>
    </>
  );
}
