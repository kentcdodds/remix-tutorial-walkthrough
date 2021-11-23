import { Joke, User } from "@prisma/client";
import { LinksFunction, LoaderFunction, useLoaderData } from "remix";
import { Outlet, Link } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import stylesUrl from "../styles/jokes.css";

export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

type LoaderData = {
  jokeListItems: Array<Pick<Joke, "id" | "name">>;
  user: User | null;
};
export let loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);
  let jokeListItems = await db.joke.findMany({
    take: 5,
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });
  let data: LoaderData = { jokeListItems, user };
  return data;
};

export default function JokesRoute() {
  let data = useLoaderData<LoaderData>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeListItems.map((j) => (
                <li key={j.id}>
                  <Link to={j.id}>{j.name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
