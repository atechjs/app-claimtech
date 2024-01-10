"use client";
import React from "react";
import { useRouter } from "next/router";
import authServ from "../services/auth.service";

const ProtectedRoute = ({ pathname, children }) => {
  const router = useRouter();
  const { asPath } = router;

  React.useEffect(() => {
    if (pathname === null) return;
    if (authServ.utenteNonLoggato()) {
      router.push({
        pathname: "/login",
        query: { pName: asPath },
      });
    }
  }, [pathname]);

  return <>{children}</>;
};

export default ProtectedRoute;
