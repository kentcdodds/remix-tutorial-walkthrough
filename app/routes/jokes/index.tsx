import type { LoaderFunction } from "remix";
import { useLoaderData, Link } from "remix";
import type { Joke } from "@prisma/client";
import { db } from "~/utils/db.server";

type LoaderData = { randomJoke: Joke };

export let loader: LoaderFunction = async () => {
  let count = await db.joke.count();
  let randomRowNumber = Math.floor(Math.random() * count);
  let [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  let data: LoaderData = { randomJoke };
  return data;
};

export default function JokesIndexRoute() {
  let data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
