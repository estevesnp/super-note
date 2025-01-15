import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "./App";
import Home from "./Home";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import "./index.css";
import Lists from "./lists/Lists";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />

      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />

      <Route path="/lists" component={Lists} />
    </Router>
  ),
  root,
);
