import { useNavigate } from "@solidjs/router";
import RegisterForm from "./components/RegisterForm";
import { UserCreds } from "./types";
import { registerUser } from "../api/endpoints";
import { isLoggedIn, login } from "./authStore";

export default function Register() {
  const navigate = useNavigate();

  if (isLoggedIn()) {
    navigate("/");
    return null;
  }

  function handleRegister(creds: UserCreds): void {
    registerUser(creds)
      .then((token) => {
        login(token.jwt);
        navigate("/");
      })
      .catch((e: Error) => {
        if (e.message === "user already exists") {
          alert(`Username ${creds.username} already exists`);
        } else {
          console.error(e.message);
        }
      });
  }

  return (
    <>
      <h1>Register</h1>
      <RegisterForm handleRegister={handleRegister} />
    </>
  );
}
