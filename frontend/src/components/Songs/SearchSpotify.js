import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation, FreeMode } from "swiper/modules";
import {
  getSpotifyGenre,
  resetSearch,
  resetSearchAction,
  spotifySearch,
} from "../../store/spotify";
import "swiper/css";
import "swiper/css/navigation";
import { HowlerContext } from "../../context/howlerContext";
import { BsStopCircle, BsPlayCircle, BsQuestionCircle } from "react-icons/bs";

export default function SearchSpotify() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { stopSound, playSound, remainingTime, currentPlaying, isPlaying } =
    useContext(HowlerContext);
  const [timer, setTimer] = useState(null);
  const [topResHover, setTopResHover] = useState(null);
  const artists = useSelector((state) =>
    state.spotify.search ? state.spotify.search.artists : null
  );
  const songs = useSelector((state) =>
    state.spotify.search ? state.spotify.search.tracks : null
  );

  useEffect(() => {
    dispatch(getSpotifyGenre());
  }, []);

  const search = useCallback(
    (query) => {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        console.log("DISPATCH VALUE: ", query);
        dispatch(spotifySearch(query));
        setTimer(null);
      }, 500);
      setTimer(newTimer);
    },
    [dispatch, timer]
  );

  const inputHandler = (e) => {
    setQuery(e.target.value);
    console.log("SEARCH INPUT: ", e.target.value);
    if (e.target.value) {
      search(e.target.value);
    } else {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
      dispatch(resetSearchAction());
    }
  };

  return (
    <div className="bg-bkg-card flex-col justify-center rounded-r-3xl w-[28rem] z-[3] my-20 shadow-xl overflow-hiddne">
      <div className="flex gap-x-2 p-4 items-center ">
        <input
          value={query}
          onChange={inputHandler}
          placeholder="Search Artists or Songs"
          className="bg-bkg-button pl-8 p-2 w-full rounded-full  border-2 border-transparent outline-none focus:border-text-txt-hover caret-text-txt-hover"
        />
        {/* <div>
          <p>Select Genres</p>
        </div> */}
      </div>
      <div className="flex flex-col h-full w-full pb-24 ">
        {query ? (
          <div className="playlist flex flex-col w-full overflow-y-scroll">
            {artists && (
              <div className="flex flex-col mx-2">
                <div
                  key={artists.items[0].id}
                  className="flex flex-row bg-bkg-nav hover:cursor-pointer hover:bg-bkg-button rounded-r-3xl select-none"
                >
                  <img
                    src={artists.items[0].images[0]?.url}
                    alt={artists.items[0].name}
                    className="w-36 h-36"
                  />
                  <div className="flex flex-col py-2 px-4 w-full">
                    <div className="flex justify-between items-center">
                      <p className="flex text-txt-1 font-semibold">
                        Top Result
                      </p>
                      <p className="flex text-txt-1 font-semibold w-fit py-[1px]  px-2  rounded-xl bg-bkg-card">
                        Artist
                      </p>
                    </div>
                    <div className="flex h-full w-full items-center max-w-[15rem] min-w-[15rem]">
                      <p className="text-txt-1 text-xl font-bold">
                        {artists.items[0].name}
                      </p>
                    </div>
                  </div>
                </div>
                {artists.items.length > 1 && (
                  <div className="flex flex-row">
                    <Swiper
                      spaceBetween={8}
                      slidesPerView={3}
                      onSlideChange={() => console.log("slide change")}
                      onSwiper={(swiper) => console.log(swiper)}
                      mousewheel={true}
                      // navigation={true}
                      freeMode={true}
                      // centeredSlides={true}
                      modules={[FreeMode, Mousewheel, Navigation]}
                      effect="fade"
                    >
                      {artists.items.slice(1).map((artist, index) => (
                        <SwiperSlide key={artist.id}>
                          <div className="flex flex-col items-center max-w-[8rem] min-w-[8rem] hover:cursor-pointer hover:scale-105 m-4 select-none">
                            <img
                              src={artist.images[0]?.url}
                              alt={artist.name}
                              className="w-24 h-24"
                            />
                            <p
                              className={`truncate text-txt-1 text-lg text-semibold ${
                                artist.name.length > 17 && "w-full"
                              }`}
                            >
                              {artist.name}
                            </p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
            )}
            {songs && (
              <div className="flex flex-col mx-2">
                <div
                  key={songs.items[0].id}
                  className={`flex flex-row bg-bkg-nav hover:cursor-pointer hover:bg-bkg-button rounded-r-3xl select-none
                  `}
                  onMouseEnter={() => setTopResHover(true)}
                  onMouseLeave={() => setTopResHover(false)}
                >
                  <img
                    src={songs.items[0].album.images[0]?.url}
                    alt={songs.items[0].name}
                    className="w-36 h-36"
                  />
                  <div className="flex flex-col py-2 px-4 w-full">
                    <div className="flex justify-between items-center">
                      <p className="flex text-txt-1 font-semibold">
                        Top Result
                      </p>
                      <p className="flex text-txt-1 font-semibold w-fit py-[1px]  px-2 rounded-xl bg-bkg-card">
                        Song
                      </p>
                    </div>
                    <div className="flex flex-col h-full w-full justify-center">
                      <div className="flex w-full">
                        <div className="flex flex-col h-full w-full justify-center max-w [15rem] min-w-[15rem]">
                          <p className="text-txt-1 text-xl font-bold items-center truncate">
                            {songs.items[0].name}
                          </p>
                          <p className="text-lg text-txt-1 font-semibold items-center truncate">
                            {songs.items[0].artists[0].name}
                          </p>
                        </div>
                      </div>
                      {songs.items[0].preview_url ? (
                        <div className="flex w-full items-center justify-end">
                          <button
                            onClick={() => {
                              if (
                                isPlaying &&
                                currentPlaying === songs.items[0].id
                              ) {
                                stopSound();
                              } else {
                                playSound(
                                  songs.items[0].preview_url,
                                  songs.items[0].id
                                );
                              }
                            }}
                          >
                            <div className="flex items-center">
                              {isPlaying &&
                              currentPlaying === songs.items[0].id ? (
                                <BsStopCircle className="text-bkg-text text-2xl hover:text-txt-hover hover:scale-105" />
                              ) : (
                                <BsPlayCircle className=" text-bkg-text text-2xl hover:text-txt-hover hover:scale-105" />
                              )}
                            </div>
                          </button>
                          {isPlaying &&
                            currentPlaying === songs.items[0].id && (
                              <p className="pl-2">{remainingTime}</p>
                            )}
                        </div>
                      ) : (
                        <BsPlayCircle className="text-gray-300 text-2xl" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col ">
                  {songs.items.slice(1).map((song, index) => (
                    <div key={song.id}>
                      <div
                        key={song.id}
                        className="flex flex-row m-4 items-center w-full hover:cursor-pointer hover:bg-bkg-button max-w-[25rem] min-w-[25rem] bg-bkg-nav"
                      >
                        <img
                          src={song.album.images[0]?.url}
                          alt={song.name}
                          width="50"
                          className="w-24 h-24"
                        />
                        <div className="w-full truncate px-4">
                          <p className="text-txt-1 font-semibold w-full truncate">
                            {song.name}
                          </p>
                          <p className="text-txt-1 text-lg w-full truncate">
                            {song.artists[0].name}
                          </p>
                        </div>
                        <div className="px-4">
                          {song.preview_url ? (
                            <div className="flex items-center">
                              <button
                                onClick={() => {
                                  if (isPlaying && currentPlaying === index) {
                                    stopSound();
                                  } else {
                                    playSound(song.preview_url, index);
                                  }
                                }}
                              >
                                <div className="flex items-center">
                                  {isPlaying && currentPlaying === index ? (
                                    <BsStopCircle className="text-bkg-text text-2xl hover:text-txt-hover hover:scale-105" />
                                  ) : (
                                    <BsPlayCircle className=" text-bkg-text text-2xl hover:text-txt-hover hover:scale-105" />
                                  )}
                                </div>
                              </button>
                              {isPlaying && currentPlaying === index && (
                                <p className="pl-2">{remainingTime}</p>
                              )}
                            </div>
                          ) : (
                            <BsPlayCircle className="text-gray-300 text-2xl" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full items-center  mt-10">
            <p className="text-txt-1 font-semibold">Select up to 5 filters.</p>
            <p className="text-txt-1 font-semibold">
              {" "}
              Choose from your favorite artists, songs, or genres.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
