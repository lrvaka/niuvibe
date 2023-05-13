// utils/withNoOnboardingCheck.ts
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { getSession, Session } from "@auth0/nextjs-auth0";
import dbConnect from "./dbConnect";
import User, { IUser } from "../models/User";

export const withNoOnboardingCheck =
  (getServerSidePropsFunc?: GetServerSideProps): GetServerSideProps =>
  async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<any>> => {
    const session: Session | null | undefined = await getSession(
      context.req,
      context.res
    );

    if (session && session.user) {
      await dbConnect();

      // Fetch the user from MongoDB using the Auth0 ID
      const user: IUser | null = await User.findOne({
        auth0Id: session.user.sub,
      });

      // If user exists in DB and required data is present, redirect to home
      if (user && user.name) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }

    // Call the original getServerSideProps function, if it exists
    return getServerSidePropsFunc
      ? await getServerSidePropsFunc(context)
      : { props: {} };
  };
