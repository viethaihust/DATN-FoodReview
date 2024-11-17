"use client";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    toast.error(error.message);
  }, [error]);
  return <div>Có gì đấy sai sai :(</div>;
}
