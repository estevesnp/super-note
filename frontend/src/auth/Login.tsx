import { useNavigate } from "@solidjs/router";
import { loginUser } from "../api/endpoints";
import LoginForm from "./components/LoginForm";
import { UserCreds } from "./types";
import { login } from "./authStore";

export default function Login() {
  const navigate = useNavigate();

  function handleLogin(creds: UserCreds) {
    loginUser(creds)
      .then((token) => {
        login(token.jwt);
        navigate("/");
      })
      .catch((e: Error) => {
        console.error(e.message);
        alert("Unable to login");
      });
  }
  return (
    <>
      <h1>Login</h1>
      <LoginForm handleLogin={handleLogin} />
    </>
  );
}
