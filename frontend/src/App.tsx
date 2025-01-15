import { JSX } from "solid-js";
import Header from "./Header";
import { validateToken } from "./auth/authStore";

type AppProps = {
  children?: JSX.Element;
};

export default function App({ children }: AppProps) {
  validateToken();
  return (
    <>
      <Header />
      {children}
    </>
  );
}
