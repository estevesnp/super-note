import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "./App";
import Home from "./Home";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
    </Router>
  ),
  root,
);
