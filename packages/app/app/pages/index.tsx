import { Link, BlitzPage } from "blitz";
import Layout from "app/layouts/Layout";
import logout from "app/auth/mutations/logout";
import { useCurrentUser } from "app/users/useCurrentUser";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import SplitPane from "react-split-pane";

const TableNoSSR = dynamic(() => import("../reusable-ui/Table"), {
  ssr: false,
});
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
      <>
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
      </>
    );
  }
};

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <div
          className="buttons"
          style={{ marginTop: "1rem", marginBottom: "5rem" }}
        >
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </div>

        <SplitPane>
          <TableNoSSR />
        </SplitPane>
        <div className="buttons" style={{ marginTop: "5rem" }}>
          <a
            className="button"
            href="https://github.com/blitz-js/blitz/blob/master/USER_GUIDE.md?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <a
            className="button-outline"
            href="https://github.com/beerose/savant"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github Repo
          </a>
        </div>
      </main>

      <footer>
        <p>
          Made with 💕 by <a href="twitter.com/aleksandrasays">Aleksandra</a>{" "}
          and <a href="twitter.com/hasparus">Piotr</a>.
        </p>
      </footer>
    </div>
  );
};

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
