import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "./App";
import Home from "./Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Router>
  ),
  root,
);
