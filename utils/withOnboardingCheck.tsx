// utils/withOnboardingCheck.ts
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { getSession, Session } from "@auth0/nextjs-auth0";
import dbConnect from "./dbConnect";
import User, { IUser } from "../models/User";

export const withOnboardingCheck =
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
        userId: session.user.sub,
      });

      // If user doesn't exist in DB or required data is missing, redirect to onboarding
      if (!user || !user.name) {
        return {
          redirect: {
            destination: "/onboarding",
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
