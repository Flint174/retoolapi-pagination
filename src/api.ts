import { BASE_URL, PAGINATION_STEP } from "./utils/constants";
import { User } from "./utils/types";

export async function getUsers(page: number): Promise<User[]> {
  try {
    const resp = await fetch(
      `${BASE_URL}?_page=${page}&_limit=${PAGINATION_STEP}`
    );
    return resp.ok ? await resp.json() : [];
  } catch (err) {
    console.error(err);
  }
  return [];
}

export async function deleteUser(id: string) {
  try {
    const resp = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    return resp.ok;
  } catch (err) {
    console.error(err);
  }
  return false;
}

export async function addUser(): Promise<Pick<User, "id"> | undefined> {
  try {
    const resp = await fetch(BASE_URL, {
      method: "POST",
    });
    return resp.ok ? await resp.json() : undefined;
  } catch (err) {
    console.error(err);
  }
  return undefined;
}

export async function editUser(user: User) {
  console.log("edig user", user);
  try {
    const resp = await fetch(`${BASE_URL}/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return resp.ok;
  } catch (err) {
    console.error(err);
  }
  return false;
}
