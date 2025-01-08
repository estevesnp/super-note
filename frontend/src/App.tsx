import type { JSX } from "solid-js";

import styles from "./App.module.css";

type AppProps = {
  children?: JSX.Element;
};

function App({ children }: AppProps) {
  return (
    <>
      <header class={styles.header}>header</header>
      {children}
      <footer class={styles.footer}>footer</footer>
    </>
  );
}

export default App;
