import { FC, FormEventHandler, useEffect, useState } from "react";
import { User } from "../../utils/types";
import styles from "./form.module.css";

interface FormProps {
  user?: User;
  onSubmit: (newUser: User) => void;
}

const userInitialState: User = {
  id: "",
  access: false,
  birthDate: "",
  email: "",
  lastName: "",
  name: "",
};

const birdDateFormatter = (user: User) =>
  user.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : "";

export const Form: FC<FormProps> = ({ user = userInitialState, onSubmit }) => {
  const [state, setState] = useState<User>({
    ...user,
    birthDate: birdDateFormatter(user),
  });
  const input = (key: keyof Omit<User, "access">, label: string) => (
    <>
      <label htmlFor={key}>{label}: </label>
      <input
        id={key}
        name={key}
        value={state[key] || ""}
        onChange={(e) =>
          setState((prev) => ({ ...prev, [key]: e.target.value }))
        }
      />
    </>
  );

  useEffect(() => {
    setState({
      ...user,
      birthDate: birdDateFormatter(user),
    });
  }, [user]);

  const submitHandle: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("submit", state);
    onSubmit({ ...userInitialState, ...state });
  };

  return (
    <form className={styles.container} onSubmit={submitHandle}>
      {input("id", "ID")}
      <label htmlFor="access">Access: </label>
      <input
        name="access"
        id="access"
        type="checkbox"
        checked={!!state.access}
        onChange={(e) =>
          setState((prev) => ({ ...prev, access: e.target.checked }))
        }
      />
      {input("name", "Name")}
      {input("lastName", "Last Name")}
      <label htmlFor="birthDate">Birth Date: </label>
      <input
        name="birthDate"
        id="birthDate"
        type="date"
        value={state.birthDate || ""}
        onChange={(e) => {
          setState((prev) => ({ ...prev, birthDate: e.target.value }));
        }}
      />
      {input("email", "Email")}
      <button type="submit">ok</button>
    </form>
  );
};
