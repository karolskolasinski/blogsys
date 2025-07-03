export type ErrorMessageProps = {
  err: unknown;
};

export default function ErrorMessage(props: ErrorMessageProps) {
  const { err } = props;
  const message = err instanceof Error ? err.message : "Błąd odczytu";
  return <p className="text-red-500">{message}</p>;
}
