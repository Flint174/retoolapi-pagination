import { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "./app.module.css";
import { User } from "./utils/types";
import { clsx } from "clsx";
import { addUser, deleteUser, editUser, getUsers } from "./api";
import { PAGINATION_STEP } from "./utils/constants";
import { Form } from "./components/form/form";

interface TableField {
  key: keyof User;
  value: string;
}

interface Sort {
  key: keyof User;
  direction: 1 | -1;
}

const fields: TableField[] = [
  { key: "id", value: "ID" },
  { key: "access", value: "Access" },
  { key: "name", value: "Name" },
  { key: "lastName", value: "Last Name" },
  { key: "email", value: "Email" },
  { key: "birthDate", value: "Birth Date" },
];

export const App: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sort, setSort] = useState<Sort | null>(null);

  const nextHandler = () => setPage((prev) => prev + 1);

  const prevHandler = () => setPage((prev) => prev - 1);

  const deleteHandler = async () => {
    if (
      user &&
      window.confirm(`Do you really want to delete "${user.id}" user?`)
    ) {
      setLoading(true);
      const resp = await deleteUser(user.id);
      setLoading(false);
      resp && (await getHandler(page));
    }
  };

  const getHandler = async (param: number) => {
    setLoading(true);
    const resp = await getUsers(param);
    setUsers(resp);
    setUser(null);
    setLoading(false);
    setSort(null);
  };

  const isDisabled = (value: boolean = false) => value || loading;

  const addHandler = async () => {
    setLoading(true);
    const resp = await addUser();
    setLoading(false);
    if (resp) {
      setUser({ ...resp, access: false });
      editHandler();
    }
  };

  const editHandler = () => {
    dialogRef.current?.showModal();
  };

  const submitHandler = async (newUser: User) => {
    console.log({ newUser });
    dialogRef.current?.close();
    console.log({ newUser });
    setLoading(true);
    const resp = !!newUser && (await editUser(newUser));
    setLoading(false);
    resp && (await getHandler(page));
  };

  const tableColumns = useMemo(
    () =>
      fields.map((field) => (
        <th
          scope="col"
          key={field.key}
          className={clsx({
            [styles["arrow--down"]]:
              sort && sort.key === field.key && sort.direction > 0,
            [styles["arrow--up"]]:
              sort && sort.key === field.key && sort.direction < 0,
          })}
          onClick={() =>
            setSort((prev) =>
              prev && prev.key === field.key
                ? {
                    ...prev,
                    direction: prev && prev.direction > 0 ? -1 : 1,
                  }
                : { key: field.key, direction: 1 }
            )
          }
        >
          {field.value}
        </th>
      )),
    [sort]
  );

  const tableData = useMemo(
    () =>
      users.map((user_el) => (
        <tr
          key={user_el.id}
          onClick={() => setUser(user_el)}
          className={clsx({
            [styles["selected-row"]]: user && user_el.id === user.id,
          })}
        >
          {fields.map((field) => (
            <td key={field.key}>{user_el[field.key]?.toString() ?? ""}</td>
          ))}
        </tr>
      )),
    [users, user]
  );

  useEffect(() => {
    getHandler(page);
  }, [page]);

  useEffect(() => {
    if (sort) {
      setUsers((prev) =>
        prev
          .slice()
          .sort((a, b) =>
            (a[sort.key] || "") < (b[sort.key] || "")
              ? sort.direction
              : -sort.direction
          )
      );
    }
  }, [sort]);

  return (
    <main>
      <h1>Retool API pagination test</h1>
      <table className={styles.table}>
        <caption>
          <div className={styles["control-panel"]}>
            <div className={styles["navigation"]}>
              <button disabled={isDisabled(page < 2)} onClick={prevHandler}>
                {"<<"}
              </button>
              <span>page {page}</span>
              <button
                disabled={isDisabled(users.length < PAGINATION_STEP)}
                onClick={nextHandler}
              >
                {">>"}
              </button>
            </div>
            <div className={styles["button-group"]}>
              <button disabled={isDisabled()} onClick={addHandler}>
                add
              </button>
              <button disabled={isDisabled(!user)} onClick={editHandler}>
                edit
              </button>
              <button disabled={isDisabled(!user)} onClick={deleteHandler}>
                delete
              </button>
            </div>
          </div>
        </caption>
        <thead>
          <tr>{tableColumns}</tr>
        </thead>
        <tbody>{tableData}</tbody>
      </table>
      <dialog ref={dialogRef} className={styles.dialog}>
        <Form {...(user ? { user } : {})} onSubmit={submitHandler} />
      </dialog>
    </main>
  );
};
