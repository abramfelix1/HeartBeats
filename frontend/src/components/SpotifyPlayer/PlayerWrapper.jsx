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
  const { isPlaying, setIsPlaying } = useContext(HowlerContext);
  const { playlistUris, setCurrentSongId, setPlaylistUris } =
    useContext(WebPlayerContext);
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

  const handlePlayerCallback = (state) => {
    setIsPlaying(state.isPlaying);
    if (state.track && state.track.id && playlistUris.length > 1) {
      setCurrentSongId(state.track.id);

      if (
        `spotify:track:${state.track.id}` ===
        playlistUris[playlistUris.length - 1]
      ) {
        const reorderedUris = [
          `spotify:track:${state.track.id}`,
          ...playlistUris.slice(0, playlistUris.length - 1),
        ];
        setPlaylistUris(reorderedUris);
      }
    }
  };

  return (
    sessionSpotify && (
      <SpotifyPlayer
        key={theme}
        getOAuthToken={getOAuthToken}
        callback={handlePlayerCallback}
        token={accessToken}
        showSaveIcon={true}
        // uris={currentSongId ? [`spotify:track:${currentSongId}`] : []}
        uris={playlistUris}
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
