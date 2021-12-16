import invariant from "tiny-invariant";
import { useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";

import { getCredentials, getAccessToken, getAlbum } from "~/lib/spotify.server";

export const loader: LoaderFunction = async ({ params: { albumId } }) => {
  invariant(typeof albumId === "string", "invalid album id");

  const [clientId, clientSecret] = getCredentials();

  const accessToken = await getAccessToken(clientId, clientSecret);
  const album = await getAlbum({ albumId, accessToken });

  return album;
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.name} by ${data.artists[0].name}`,
    description: `Get to know ${data.name} a little bit better`,
    "twitter:image": data.images[0].url,
    "twitter:card": "summary_large_image",
  };
};

const formatLength = (ms: number) => {
  const date = new Date(ms);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  return `${minutes}:${seconds}`;
};

export default function Index() {
  let data = useLoaderData();

  const cover = data.images[0];
  const artist = data.artists[0];

  return (
    <>
      <header className="mb-16">
        <h1 className="text-5xl text-center font-extrabold">Album Info</h1>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <img
              src={cover.url}
              width={cover.width}
              height={cover.height}
              className="mb-4"
            />
            <p>
              {data.name} <span>by</span> {artist.name}
            </p>
            <p>
              Released on {data.release_date} via {data.label}
            </p>
            <p>
              Spotify URL:{" "}
              <a href={data.href} target="_blank">
                {data.href}
              </a>
            </p>
          </div>
          <div className="flex-1">
            <h2 className="mb-4">Tracklist</h2>
            <ul>
              {data.tracks.items.map((track) => (
                <li>
                  {track.name} ({formatLength(track.duration_ms)})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
