"use client";
import React, { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.log(`${error}`);
  }, [error]);
  return <div>Error fetching data :(</div>;
}
