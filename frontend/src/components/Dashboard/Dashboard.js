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

export default function Dashboard() {
  const dispatch = useDispatch();
  const { journalId, setJournalId, journalOpen, editorOpen, setEditorOpen } =
    useContext(JournalContext);
  const { playlistOpen, showPlaylist, isSongRecsShown, setIsSongRecsShown } =
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
      <div className="bg-bkg-body text-txt-1 w-screen h-screen flex flex-col relative">
        <Navigation
          isLoaded={isLoaded}
          navHovered={navHovered}
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        />
        {journalEntry && (
          <div className="">
            <p className="AA">{convertTime(journalEntry.updatedAt)}</p>
          </div>
        )}
        {playlistOpen && <PlaylistContainer />}
        {journalOpen && <JournalContainer />}
        {editorOpen && (
          <div className="flex h-full w-full justify-center">
            <JournalEditor />
          </div>
        )}
        {showPlaylist && (
          <div className="flex h-full right-0 absolute z-[4]">
            <Playlist />
          </div>
        )}
        {isSongRecsShown && (
          <div className="flex h-full items-center">
            <SongsContainer />
          </div>
        )}
      </div>
    </>
  );
}
