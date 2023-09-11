import React, { useCallback, useContext, useEffect, useState } from "react";
import Navigation from "../Navigation";
import JournalContainer from "../Journals.js/JournalContainer";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import {
  getRecSongs,
  getSpotifyUser,
  resetRecSongsAction,
} from "../../store/spotify";
import Modal from "../../utils/Modal";
import { JournalContext } from "../../context/journalContext";
import SongsContainer from "../Songs/SongsContainer";
import JournalEditor from "../Journals.js/JournalEditor";
import { PlaylistContext } from "../../context/playlistContext";
import PlaylistContainer from "../Playlist/PlaylistContainer";
import Playlist from "../Playlist/Playlist";
import SongRecs from "../Songs/SongRecs";
import { convertTime, convertTime2 } from "../../utils/helper";
import JournalNav from "../Journals.js/JournalNav";
import PlaylistNav from "../Playlist/PlaylistNav";
import { ReactComponent as ComposeIcon } from "../../images/icons/outline/compose2.svg";
import { ReactComponent as RefreshIcon } from "../../images/icons/outline/refresh.svg";
import { getEnergy, getValence } from "../../utils/journal-analyzer";
import SearchSpotify from "../Songs/SearchSpotify";
import { ErrorContext } from "../../context/ErrorContext";
import { ModalContext } from "../../context/ModalContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default function Dashboard() {
  const dispatch = useDispatch();
  const {
    journalId,
    journalOpen,
    editorOpen,
    setEditorOpen,
    journalContent,
    filterOpen,
  } = useContext(JournalContext);
  const { playlistOpen, showPlaylist, isSongRecsShown, setIsSongRecsShown } =
    useContext(PlaylistContext);
  const { errors, setErrors } = useContext(ErrorContext);
  const { type, setType } = useContext(ModalContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const journalEntry = useSelector((state) =>
    journalId ? state.journals[journalId] : null
  );
  const [timer, setTimer] = useState(null);
  const sessionUser = useSelector((state) =>
    state.session.user ? state.session.user.id : null
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

  const getSongs = useCallback(
    (query) => {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        console.log("DISPATCH VALUE: ", query);
        dispatch(getRecSongs(query)).catch(async (res) => {
          const data = await res.json();
          console.log(data.errors);
          setErrors(data.errors);
          setType("ERROR");
        });
        setTimer(null);
      }, 300);
      setTimer(newTimer);
    },
    [dispatch, timer]
  );

  const recSongsHandler = (e) => {
    if (journalContent && journalId) {
      dispatch(resetRecSongsAction());
      getSongs({
        filter: journalEntry.filter,
      });
    }
  };

  useEffect(() => {
    recSongsHandler();
  }, [journalId]);

  if (!sessionUser) return <Redirect to="/home" />;

  return (
    <>
      <Modal />
      <div className="font-poppins bg-bkg-body flex-row text-txt-1 w-screen h-screen flex  relative cursor-default">
        <Navigation
          isLoaded={isLoaded}
          navHovered={navHovered}
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        />
        {journalEntry && journalContent ? (
          <div className="flex flex-col left-0 top-0 absolute mt-4 ml-4 w-[30%] h-[25%] z-[3] pointer-events-none ">
            <p className="flex text-3xl font-medium whitespace-nowrap">
              {convertTime2(journalEntry.updatedAt)} - {journalEntry.name}
            </p>
            <div className="flex flex-row w-full gap-x-2 items-center pointer-events-none select-none">
              <p className="text-2xl font-medium truncate">
                "{journalContent}"
              </p>
              <button className="cursor-pointer w-10">
                <ComposeIcon
                  className="w-8 cursor-pointer fill-txt-1 hover:scale-105 pointer-events-auto"
                  onClick={(e) => {
                    setEditorOpen(true);
                  }}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-[100%] h-full items-center justify-center overflow-hidden gap-y-2 z-9">
            {
              <p className="text-2xl font-medium select-none">
                Find songs write away!
              </p>
            }
            <ComposeIcon
              className="hover:cursor-pointer fill-txt-1 hover:scale-105"
              onClick={(e) => {
                setEditorOpen(true);
              }}
            />
          </div>
        )}
        {isSongRecsShown && journalEntry && journalContent ? (
          <>
            <div className="flex h-full w-full items-center overflow-hidden relative">
              {journalEntry.filter.songs.length === 0 &&
              journalEntry.filter.genres.length === 0 &&
              journalEntry.filter.artists.length === 0 ? (
                <div className="text-txt-1 flex w-full items-center justify-center text-2xl font-medium select-none">
                  Select filters to begin your music journey!{" "}
                </div>
              ) : (
                <SongsContainer />
              )}
              <div
                className="absolute w-full h-fit flex flex-col items-center justify-center
            2xl:bottom-32 xl:bottom-8 lg:bottom-4 md:bottom-2 select-none pointer-events-none"
              >
                <RefreshIcon
                  className="fill-txt-1 w-10 hover:scale-105 hover:cursor-pointer pointer-events-auto"
                  onClick={recSongsHandler}
                />
                <p className="text-txt-1 select-none">Refresh Songs</p>
              </div>
            </div>
          </>
        ) : (
          <div className=""></div>
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
            {filterOpen && <SearchSpotify />}
          </div>
        )}
      </div>
    </>
  );
}
