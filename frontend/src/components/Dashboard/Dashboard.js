import React, { useContext, useEffect, useState } from "react";
import Navigation from "../Navigation";
import JournalContainer from "../Journals.js/JournalContainer";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { getSpotifyUser } from "../../store/spotify";
import Modal from "../../utils/Modal";
import { JournalContext } from "../../context/journalContext";
import SongsContainer from "../Songs/SongsContainer";
import JournalEditor from "../Journals.js/JournalEditor";
import { PlaylistContext } from "../../context/playlistContext";
import PlaylistContainer from "../Playlist/PlaylistContainer";
import Playlist from "../Playlist/Playlist";
import SongRecs from "../Songs/SongRecs";
import { convertTime } from "../../utils/helper";
import JournalNav from "../Journals.js/JournalNav";
import PlaylistNav from "../Playlist/PlaylistNav";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { journalId, journalOpen, editorOpen, journalContent } =
    useContext(JournalContext);
  const { playlistOpen, showPlaylist, isSongRecsShown } =
    useContext(PlaylistContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const journalEntry = useSelector((state) =>
    journalId ? state.journals[journalId] : null
  );

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(getSpotifyUser());
    dispatch(sessionActions.checkLoggedIn());
  }, [dispatch]);

  // useEffect(() => {
  //   console.log("NAV HOVERED: ", navHovered);
  // }, [navHovered]);

  useEffect(() => {
    console.log("DASHBOARD: ", journalOpen);
  }, [journalOpen]);

  // bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7CA8D2] from-0% to-azure-blue to-100% bg-whoite

  return (
    <>
      <Modal />
      <div className="bg-bkg-body flex-row text-txt-1 w-screen h-screen flex  relative">
        <Navigation
          isLoaded={isLoaded}
          navHovered={navHovered}
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        />
        {journalEntry && journalContent && (
          <div className="flex flex-col left-0 top-0 absolute m-4 gap-y-2 w-[30%] h-[25%]">
            <p className="flex text-3xl font-semibold whitespace-nowrap">
              {convertTime(journalEntry.updatedAt)} - {journalEntry.name}
            </p>
            <p className="text-2xl font-semibold truncate">
              "{journalContent}"
            </p>
          </div>
        )}
        {isSongRecsShown && (
          <div className="flex h-full w-full items-center overflow-hidden">
            <SongsContainer />
          </div>
        )}
        {showPlaylist && (
          <div className="flex flex-grow z-[3] h-full w-[55%]">
            <Playlist />
          </div>
        )}
        {playlistOpen && (
          <div className="flex flex-grow z-[3] h-full w-[55%]">
            <PlaylistNav />
          </div>
        )}
        {journalOpen && (
          <div className="flex flex-grow z-[3] h-full w-[55%]">
            <JournalNav />
          </div>
        )}
        {editorOpen && (
          <div className="flex h-full w-full justify-center absolute">
            <JournalEditor />
          </div>
        )}
      </div>
    </>
  );
}
