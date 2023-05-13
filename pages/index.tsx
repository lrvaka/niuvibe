/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";
import { Inter } from "next/font/google";
import NextLink from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { user, error, isLoading } = useUser();

  return (
    <div>
      <div
        id="backdrop"
        className="fixed z-40  w-screen h-screen top-0 left-0 flex flex-col gap-20 items-center justify-center overflow-hidden"
      >
        <div className="text-center">
          <h1 id="title" className="font-bold text-6xl text-green-50">
            NiuVibe
          </h1>
          <h2 id="sub-title" className="text-xl text-green-50">
            Find love on the open sea
          </h2>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <a
                href="/api/auth/login"
                className="px-2 py-3 bg-sky-900 text-center rounded-xl text-white text-lg"
              >
                Login
              </a>
              <button className="px-2 py-3 rounded-xl text-white text-lg">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Define getServerSideProps, a Next.js function that runs on the server before the page is sent to the browser.
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Call getSession to get the current user's session.
  // getSession is asynchronous, so we need to use 'await' to wait for it to complete.
  const session = await getSession(context.req, context.res);

  // Check if the session exists and it has a user. If so, the user is logged in.
  if (session && session.user) {
    // If the user is logged in, we redirect them to the "/home" page.
    // The 'permanent: false' option means that this is a temporary redirect, not a permanent one.
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  // If the user is not logged in, we return the session as a prop to the HomePage component.
  // This allows the component to use the session data if it needs to.
  // If the user is not logged in, the session will be null.
  return {
    props: { user: session || null }, // will be passed to the page component as props
  };
};
