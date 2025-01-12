import { useNavigate } from "@solidjs/router";
import { logout } from "./authStore";

export default function Logout() {
  const navigate = useNavigate();

  logout();
  navigate("/");

  return null;
}
