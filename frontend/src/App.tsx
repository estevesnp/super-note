import type { JSX } from "solid-js";
import styles from "./App.module.css";

type AppProps = {
  children?: JSX.Element;
};

function App({ children }: AppProps) {
  return (
    <>
      <header class={styles.header}>
        <span>Super Note</span>
        <a href="/">Home</a>
        <a href="/register">Register</a>
      </header>

      {children}
    </>
  );
}

export default App;
