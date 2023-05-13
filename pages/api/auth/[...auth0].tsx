// pages/api/auth/[...auth0].tsx
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default handleAuth({
  login: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Call the login handler with the necessary parameters
      await handleLogin(req, res, {
        authorizationParams: {
          audience: process.env.AUTH0_AUDIENCE as string, // or AUTH0_AUDIENCE
        },
        returnTo: "/home", // add this line to redirect user after login
      });
    } catch (error: any) {
      // Handle or throw the error as needed
      console.error(error);
      res.status(error.status || 500).end(error.message);
    }
  },
});
