import { BlitzPage } from "blitz";
import React, { Suspense } from "react";

import { Flex, View } from "../reusable-ui/spectrum";
import Layout from "app/layouts/Layout";
import logout from "app/auth/mutations/logout";
import { useCurrentUser } from "app/users/useCurrentUser";
import { Link } from "../application-ui/Link";
import { Spacer } from "../reusable-ui/Spacer";

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser();

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logout();
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    );
  } else {
    return (
      <Flex gap="size-100">
        <Link href="/signup">
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href="/login">
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </Flex>
    );
  }
};

const LandingPage: BlitzPage = () => {
  return (
    <Layout title="Savant">
      <View elementType="main" padding="size-500" flex={1}>
        <Flex direction="column" gap="size-100">
          <div>
            <Suspense fallback="Loading...">
              <UserInfo />
            </Suspense>
          </div>
          <Spacer />
          <footer>
            <p>
              Made with 💕 by{" "}
              <Link isQuiet href="twitter.com/aleksandrasays">
                Aleksandra
              </Link>{" "}
              and{" "}
              <Link isQuiet href="twitter.com/hasparus">
                Piotr
              </Link>
              .
            </p>
          </footer>
        </Flex>
      </View>
    </Layout>
  );
};

export default LandingPage;
