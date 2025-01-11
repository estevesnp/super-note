import { useNavigate } from "@solidjs/router";
import RegisterForm from "../components/RegisterForm";
import { UserCreds } from "./types";
import { registerUser } from "../api/endpoints";

function Register() {
  const navigate = useNavigate();

  function handlerRegister(user: UserCreds): void {
    registerUser(user)
      .then(() => navigate("/"))
      .catch((e: Error) => {
        if (e.message === "User already exists") {
          alert(e.message);
        } else {
          console.error(e.message);
        }
      });
  }

  return (
    <>
      <h1>Register</h1>
      <RegisterForm handleRegister={handlerRegister} />
    </>
  );
}

export default Register;
