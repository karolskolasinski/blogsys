import { ActionRes } from "@/types/common";

export async function toBase64(file: File) {
  const buf = await file?.arrayBuffer();
  const b64 = Buffer.from(buf)?.toString("base64");
  return `data:${file.type};base64,${b64}`;
}

export const initialActionState: ActionRes = {
  success: false,
  messages: [],
};

export function handleError(err: unknown, msg: string = "Wystąpił błąd") {
  console.error(err);

  return {
    success: false,
    messages: [err instanceof Error ? err.message : msg],
  };
}
