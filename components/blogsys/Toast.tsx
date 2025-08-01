"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { ActionResponse } from "@/types/common";

export default function Toast(props: Omit<ActionResponse, "data">) {
  useEffect(() => {
    const { success, messages } = props;

    if (messages.length === 0) return;

    if (success) {
      messages.forEach((msg) => toast.success(msg));
    } else {
      messages.forEach((msg) => toast.error(msg));
    }
  }, [props]);

  return null;
}
