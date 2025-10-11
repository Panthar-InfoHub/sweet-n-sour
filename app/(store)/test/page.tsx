import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
};

export default page;
