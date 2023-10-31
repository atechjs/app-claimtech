import React from "react";
import { useRouter } from "next/router";
import authServ from "../services/auth.service";
const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (authServ.utenteNonLoggato()) {
      router.push("/login");
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
