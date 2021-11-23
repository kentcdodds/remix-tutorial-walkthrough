import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { logout } from "~/utils/session.server";

export let action: ActionFunction = ({ request }) => logout(request);

export let loader: LoaderFunction = () => redirect("/");
