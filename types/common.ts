export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
};

export type Post = {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ServerComponentProps = {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

