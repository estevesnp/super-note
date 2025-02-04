import { createSignal } from "solid-js";
import styles from "./form.module.css";

import { validateInput } from "../../validations";
import { UserCreds } from "../types";

export type RegisterFormProps = {
  handleRegister: (creds: UserCreds) => void;
};

export default function RegisterForm({ handleRegister }: RegisterFormProps) {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");

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

    const confirmPassValidation = validateInput(confirmPassword(), 8);
    if (!confirmPassValidation.valid) {
      alert(
        `Password Confirmation not valid: ${confirmPassValidation.error ?? "error"}`,
      );
      return;
    }

    if (password() != confirmPassword()) {
      alert("Passwords don't match");
      return;
    }

    handleRegister({ username: username(), password: password() });
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
      <div class={styles.form_input}>
        <label for="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword()}
          onInput={(e) => setConfirmPassword(e.currentTarget.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
