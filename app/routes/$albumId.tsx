import { useLoaderData, json, Link } from "remix";
import { getCredentials, getAccessToken } from "~/lib/spotify.server";

import type { MetaFunction, LoaderFunction } from "remix";

type Album = {
  resources: Array<{ name: string; url: string }>;
  demos: Array<{ name: string; to: string }>;
};

export let loader: LoaderFunction = async ({ params: { albumId } }) => {
  // const [clientId, clientSecret] = getCredentials();
  // const token = await getAccessToken(clientId, clientSecret);

  // console.log(token);
  // console.log({ albumId });

  return null;
};

export let meta: MetaFunction = () => {
  return {
    title: "Album Info",
    description: "Welcome to remix!",
  };
};

export default function Index() {
  let data = useLoaderData<Album>();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-5xl text-center font-extrabold">Album Info</h1>
    </main>
  );
}
