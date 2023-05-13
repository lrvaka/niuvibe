/* eslint-disable @next/next/no-html-link-for-pages */
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { withOnboardingCheck } from "@/utils/withOnboardingCheck";
import { UserData } from "auth0";

export default function Home({ user }: { user: UserData }) {
  return (
    <div>
      <a href="/api/auth/logout">Logout</a>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export const getServerSideProps = withOnboardingCheck(withPageAuthRequired());
