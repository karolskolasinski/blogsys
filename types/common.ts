export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  createdAt: Date;
  avatarId?: string;
};

export type Post = {
  id?: string;
  title: string;
  cover: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Account = {
  id?: string;
  login: string;
  password: string;
  iv: string;
  tag: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ServerComponentProps = {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type ActionRes<T = unknown> = {
  success: boolean;
  messages: string[];
  data?: T;
};
