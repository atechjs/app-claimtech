import { Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import authServ from "../services/auth.service";


export default function Page() {
  const router = useRouter();
  const [utente, setUtente] = useState(null);

  useEffect(() => {
    const currentUser = authServ.getCurrentUser();
    setUtente(currentUser);

    if (!currentUser) {
      router.push("/login"); // Redirect to login page if the user is not logged in
    }
    else
    {
      router.push("/home");
    }
  }, [router]);


}
