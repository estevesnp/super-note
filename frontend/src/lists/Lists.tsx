import { createSignal, For } from "solid-js";
import { ListDTO } from "../api/types";
import { getLists } from "../api/endpoints";
import { isLoggedIn, logout, user } from "../auth/authStore";
import { useNavigate } from "@solidjs/router";
import List from "./components/List";

export default function Lists() {
  const navigate = useNavigate();

  if (!isLoggedIn()) {
    console.log("logginginasd");
    navigate("/login");
    return;
  }

  const [lists, setLists] = createSignal<Array<ListDTO>>([]);

  getLists()
    .then((apiLists) => setLists(apiLists))
    .catch((err: Error) => {
      if (err.message === "unauthorized") {
        logout();
        navigate("/");
      } else {
        console.error("error fetching lists", err);
      }
    });

  return (
    <>
      <h1>{user()?.username} Lists</h1>
      <div id="lists">
        <For each={lists()}>
          {(list) => <List name={list.name} description={list.description} />}
        </For>
      </div>
    </>
  );
}
