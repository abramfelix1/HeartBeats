import { useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { refreshSpotifyToken } from "../../store/session";
import { useDispatch } from "react-redux";

export default function PlayerWrapper() {
  const dispatch = useDispatch();

  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);

  const getOAuthToken = async (callback) => {
    if (expiresAt > Date.now()) {
      callback(accessToken);

      return;
    }

    const { access_token, expires_in, refresh_token, data } = await dispatch(
      refreshSpotifyToken()
    );
    console.log(data);

    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setExpiresAt(Date.now() + expires_in * 1000);

    callback(access_token);
  };

  return (
    <SpotifyPlayer
      getOAuthToken={getOAuthToken}
      token={accessToken}
      showSaveIcon={true}
      uris={["spotify:track:5zwwW9Oq7ubSxoCGyW1nbY"]}
    />
  );
}
