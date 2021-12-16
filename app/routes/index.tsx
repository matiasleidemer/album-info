import invariant from "tiny-invariant";

import { Form, redirect } from "remix";

import type { MetaFunction, ActionFunction, LoaderFunction } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const albumUrl = form.get("albumUrl");

  invariant(typeof albumUrl === "string", "invalid album id");

  const url = new URL(albumUrl).pathname.split("/").slice(-1)[0];

  return redirect(`/${url}`);
};

export const meta: MetaFunction = () => {
  return {
    title: "Album Info",
    description: "Get to know your albums better",
  };
};

export default function Index() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-5xl text-center font-extrabold mb-16">Album Info</h1>

      <div className="flex justify-center">
        <Form method="post" className="w-2/4">
          <fieldset className="mb-8">
            <label htmlFor="albumUrl" className="font-bold">
              Spotify album URL:
            </label>
            <p>
              <input
                type="text"
                name="albumUrl"
                id="albumUrl"
                placeholder="https://open.spotify.com/album/4fW7CblaSvdhPWmcCFgZbQ?si=CtA_eAGETxWbjcnSjyIDTA"
                className="placeholder:italic placeholder:text-gray-400 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              />
            </p>
          </fieldset>
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
