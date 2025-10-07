import { User } from "@src/types/types";
import { USERNAME, PASSWORD } from "@utils/constants";

export function mockLogin(username: string, password: string): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === USERNAME && password === PASSWORD) {
        resolve({ id: "1", username, role: "admin" });
      } else {
        resolve(null);
      }
    }, 300);
  });
}
