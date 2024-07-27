import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { axiosApi } from "./utils/axios";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn(provider, options) {
      const response = await axiosApi.get(
        `/api/user-accounts?filters[email][$eq]=${provider.user?.email}`
      );
      const result = response?.data?.data;
      if (result?.length === 0) {
        await axiosApi.post("/api/user-accounts", {
          data: {
            email: provider?.user?.email,
            name: provider?.user?.name,
            imageUrl: provider?.user?.image,
          },
        });
      }
      return true; // Return true to proceed with the login
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access token to the token right after signin
      // if (account && account.access_token && account.refresh_token) {
      // 	token.refresh_token = account.refresh_token;
      // 	token.accessToken = account.access_token;
      // }
      if (user?.id) {
        token.id = user.id;
      }
      if (user?.username) {
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      if (token?.username) {
        session.username = token.username;
      }
      // Add access token to the session object
      // if (token.accessToken) {
      // 	session.accessToken = token.accessToken;
      // }
      // if (token.refresh_token) {
      // 	session.refresh_token = token.refresh_token;
      // }
      return session;
    },
  },
});
