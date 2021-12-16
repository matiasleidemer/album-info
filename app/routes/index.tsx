import invariant from "tiny-invariant";

import { Form, redirect } from "remix";

import type { MetaFunction, ActionFunction, LoaderFunction } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const albumId = form.get("albumId");

  invariant(typeof albumId === "string", "invalid album id");

  return redirect(`/${albumId}`);
};

export const meta: MetaFunction = () => {
  return {
    title: "Album Info",
    description: "Welcome to remix!",
  };
};

export default function Index() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-5xl text-center font-extrabold">Album Info</h1>

      <Form method="post">
        <label htmlFor="albumId">Album ID</label>
        <input type="text" name="albumId" id="albumId" className="border-2" />

        <button type="submit">Search</button>
      </Form>
    </main>
  );
}
