export type User = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

export type ServerComponentProps = {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};
