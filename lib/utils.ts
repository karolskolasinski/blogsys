import { ActionResponse } from "@/types/common";

export async function toBase64(file: File) {
  const buf = await file?.arrayBuffer();
  const b64 = Buffer.from(buf)?.toString("base64");
  return `data:${file.type};base64,${b64}`;
}

export const initialActionState: ActionResponse = {
  success: false,
  messages: [],
};
