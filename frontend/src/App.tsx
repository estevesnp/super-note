import { JSX } from "solid-js";
import Header from "./Header";

type AppProps = {
  children?: JSX.Element;
};

export default function App({ children }: AppProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
