/**
 * Checks whether the user is currently logged in.
 *
 * @returns {boolean} `true` if the `isLoggedIn` flag in localStorage is set to `"true"`, otherwise `false`.
 */
export const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";
