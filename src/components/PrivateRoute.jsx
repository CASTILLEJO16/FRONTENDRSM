import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function PrivateRoute({ children }) {
  const { token } = useContext(AppContext);

  // si NO hay token → lo manda a login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
