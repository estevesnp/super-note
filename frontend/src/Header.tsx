import { Show } from "solid-js";
import { isLoggedIn } from "./auth/authStore";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header class={styles.header}>
      <span>Super Note</span>
      <a href="/">Home</a>
      <Show
        when={isLoggedIn()}
        fallback={
          <>
            <a href="/register">Register</a>
            <a href="/login">Login</a>
          </>
        }
      >
        <a href="/logout">Logout</a>
      </Show>
    </header>
  );
}
