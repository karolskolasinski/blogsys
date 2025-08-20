"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { ActionResponse } from "@/types/common";

export default function Toast(props: Omit<ActionResponse, "data">) {
  const { success, messages } = props;

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    messages.forEach((msg) => success ? toast.success(msg) : toast.error(msg));
  }, [success, messages]);

  return null;
}
