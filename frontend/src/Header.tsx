import { Show } from "solid-js";
import { isLoggedIn } from "./auth/authStore";
import styles from "./Header.module.css";

function LoggedInLinks() {
  return (
    <>
      <a href="/lists">Lists</a>
      <a href="/logout">Logout</a>
    </>
  );
}

function LoggedOutLinks() {
  return (
    <>
      <a href="/register">Register</a>
      <a href="/login">Login</a>
    </>
  );
}

export default function Header() {
  return (
    <header class={styles.header}>
      <span>Super Note</span>
      <a href="/">Home</a>
      <Show when={isLoggedIn()} fallback={<LoggedOutLinks />}>
        <LoggedInLinks />
      </Show>
    </header>
  );
}
