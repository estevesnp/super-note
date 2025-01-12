import { createSignal } from "solid-js";
import styles from "./form.module.css";
import { validateInput } from "../../validations";
import { UserCreds } from "../types";

export type LoginFormProps = {
  handleLogin: (creds: UserCreds) => void;
};

export default function LoginForm({ handleLogin }: LoginFormProps) {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  function handleSubmit(event: Event) {
    event.preventDefault();

    const userValidation = validateInput(username(), 4);
    if (!userValidation.valid) {
      alert(`Username not valid: ${userValidation.error ?? "error"}`);
      return;
    }

    const passValidation = validateInput(password(), 8);
    if (!passValidation.valid) {
      alert(`Password not valid: ${passValidation.error ?? "error"}`);
      return;
    }

    handleLogin({ username: username(), password: password() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div class={styles.form_input}>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
      </div>
      <div class={styles.form_input}>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
