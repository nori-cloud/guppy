import { randomUUID } from "crypto";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials);
        return {
          id: randomUUID(),
          name: "John Doe",
          email: credentials?.email,
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);
