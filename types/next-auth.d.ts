import "next-auth";
import { User } from "@/types/common";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
