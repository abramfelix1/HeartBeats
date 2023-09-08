import React, { useContext, useEffect, useState } from "react";
import Navigation from "../Navigation";
import JournalContainer from "../Journals.js/JournalContainer";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { getRecSongs, getSpotifyUser } from "../../store/spotify";
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
import { ReactComponent as ComposeIcon } from "../../images/icons/outline/compose2.svg";
import { ReactComponent as RefreshIcon } from "../../images/icons/outline/refresh.svg";
import { getEnergy, getValence } from "../../utils/journal-analyzer";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { journalId, journalOpen, editorOpen, setEditorOpen, journalContent } =
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

  const recSongsHandler = (e) => {
    if (journalContent) {
      const energy = getEnergy(journalContent);
      const valence = getValence(journalContent);
      dispatch(
        getRecSongs({
          valence: valence,
          energy: energy,
          genre: "pop",
        })
      );
    }
  };

  return (
    <>
      <Modal />
      <div className="bg-bkg-body flex-row text-txt-1 w-screen h-screen flex  relative cursor-default">
        <Navigation
          isLoaded={isLoaded}
          navHovered={navHovered}
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        />
        {journalEntry && journalContent ? (
          <div className="flex flex-col left-0 top-0 absolute mt-4 ml-4 w-[30%] h-[25%] z-[3]">
            <p className="flex text-3xl font-semibold whitespace-nowrap">
              {convertTime(journalEntry.updatedAt)} - {journalEntry.name}
            </p>
            <div className="flex flex-row w-full gap-x-2 items-center">
              <p className="text-2xl font-semibold truncate">
                "{journalContent}"
              </p>
              <button className="cursor-pointer w-10">
                <ComposeIcon
                  className="w-8 cursor-pointer fill-txt-1 hover:scale-105"
                  onClick={(e) => {
                    setEditorOpen(true);
                  }}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col absolute w-full h-full items-center justify-center overflow-hidden gap-y-2">
            <p className="text-2xl font-semibold select-none">
              Find songs write away!
            </p>
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
              <SongsContainer />
              <div
                className="absolute w-full h-fit flex flex-col items-center justify-center
            2xl:bottom-36 xl:bottom-8 lg:bottom-4 md:bottom-2"
              >
                <RefreshIcon
                  className="fill-txt-1 w-10 hover:scale-105 hover:cursor-pointer"
                  onClick={recSongsHandler}
                />
                <p className="text-txt-1">Refresh Songs</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full opacity-0">a</div>
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
          <div className="flex h-full w-full justify-center absolute ">
            <JournalEditor />
          </div>
        )}
      </div>
    </>
  );
}
