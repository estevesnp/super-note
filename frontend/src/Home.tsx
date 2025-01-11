import { createSignal, For } from "solid-js";
import { getUsers } from "./api/endpoints";
import { User } from "./api/types";
import styles from "./Home.module.css";

function Home() {
  const [users, setUsers] = createSignal<Array<User>>([]);

  getUsers()
    .then((apiUsers) => setUsers(apiUsers))
    .catch((err) => console.error("error fetching users", err));

  return (
    <>
      <div id="users">
        <For each={users()}>
          {(user) => (
            <div class={styles.user}>
              <p>ID: {user.id}</p>
              <p>Username: {user.username}</p>
              <p>Created At: {user.created_at}</p>
            </div>
          )}
        </For>
      </div>
    </>
  );
}

export default Home;
