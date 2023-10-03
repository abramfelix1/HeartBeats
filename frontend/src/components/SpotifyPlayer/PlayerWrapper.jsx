import { useContext, useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { refreshSpotifyToken } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../context/themeContext";
import { HowlerContext } from "../../context/howlerContext";
import { WebPlayerContext } from "../../context/webPlayerContext";

export default function PlayerWrapper() {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const { isPlaying } = useContext(HowlerContext);
  const { currentSongId, playSong, pauseSong } = useContext(WebPlayerContext);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);
  const sessionSpotify = useSelector((state) =>
    state.session.user.spotifyId ? state.session.user.spotifyId : null
  );

  useEffect(() => {
    console.log("SEESSION", sessionSpotify);
  }, [sessionSpotify]);

  const getOAuthToken = async (callback) => {
    if (expiresAt > Date.now()) {
      callback(accessToken);

      return;
    }

    const { access_token, expires_in, refresh_token, data } = await dispatch(
      refreshSpotifyToken()
    );

    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setExpiresAt(Date.now() + expires_in * 1000);

    callback(access_token);
  };

  // const handlePlayerCallback = (state) => {
  //   console.log(state.isPlaying);
  //   setIsPlaying(state.isPlaying);
  // };

  return (
    sessionSpotify && (
      <SpotifyPlayer
        getOAuthToken={getOAuthToken}
        token={accessToken}
        showSaveIcon={true}
        uris={currentSongId ? [`spotify:track:${currentSongId}`] : []}
        play={isPlaying}
        styles={
          theme === "dark"
            ? {
                activeColor: "#fff",
                bgColor: "#333",
                color: "#fff",
                loaderColor: "#fff",
                sliderColor: "#1cb954",
                trackArtistColor: "#ccc",
                trackNameColor: "#fff",
              }
            : {
                // activeColor: "#24b85d",
                // bgColor: "#fff",
                // color: "#333",
                // loaderColor: "#fff",
                // sliderColor: "#0080f9",
                // trackArtistColor: "#ccc",
                // trackNameColor: "#fff",
              }
        }
      />
    )
  );
}
