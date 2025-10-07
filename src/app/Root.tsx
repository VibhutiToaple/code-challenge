import { useEffect, useState } from "react";
import { isLoggedIn } from "@utils/auth";
import LoginComponent from "@components/LoginComponent";

import App from "./App";

const Root = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    const handler = () => setLoggedIn(isLoggedIn());
    window.addEventListener("login-success", handler);
    return () => window.removeEventListener("login-success", handler);
  }, []);

  if (!loggedIn) {
    return (
      <LoginComponent
        onLoginSuccess={() => {
          localStorage.setItem("isLoggedIn", "true");
          window.dispatchEvent(new Event("login-success"));
        }}
      />
    );
  }

  return <App />;
};

export default Root;
