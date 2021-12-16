import invariant from "tiny-invariant";

const base64 = (value: string) => Buffer.from(value).toString("base64");

export const getCredentials = () => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  invariant(typeof SPOTIFY_CLIENT_ID === "string", "invalid client id");
  invariant(typeof SPOTIFY_CLIENT_SECRET === "string", "invalid client secret");

  return [SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET];
};

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export const getAccessToken = async (
  clientId: string,
  clientSecret: string
): Promise<string> => {
  const URI = "https://accounts.spotify.com/api/token";
  const token = base64(`${clientId}:${clientSecret}`);

  const method = "POST";
  const body = "grant_type=client_credentials";
  const headers = {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await fetch(URI, { method, body, headers });

  if (!res.ok) throw Error(`Couldn't get access token: ${res.statusText}`);

  const data: TokenResponse = await res.json();

  return data.access_token;
};

export const client = (accessToken: string) => {
  return {
    getAlbum: (id: string) =>
      get({
        uri: `https://api.spotify.com/v1/albums/${id}?market=US`,
        accessToken,
      }),
    getArtist: (id: string) =>
      get({
        uri: `https://api.spotify.com/v1/artists/${id}?market=US`,
        accessToken,
      }),
  };
};

const get = async ({
  uri,
  accessToken,
}: {
  uri: string;
  accessToken: string;
}) => {
  const method = "get";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(uri, { method, headers });
  const data = await res.json();

  return data;
};
