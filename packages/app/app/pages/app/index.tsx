import { Link, BlitzPage } from "blitz";
import { Suspense, useState } from "react";
import { Flex, Grid } from "@adobe/react-spectrum";

import logout from "app/auth/mutations/logout";
import { useCurrentUser } from "app/users/useCurrentUser";
import { Spreadsheet } from "app/spreadsheet";
import { Editor } from "app/editor";
import { Root } from "app/reusable-ui/Root";
import { SavantPaneResizeEvent } from "app/editor/SavantPaneResizeEvent";
import Layout from "../../layouts/Layout";
import { SplitPanes } from "../../application-ui/SplitPanes";

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
            <strong>Sign Up</strong>Spreadsheet
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

const onDragFinished = (_newSize: number) => {
  SavantPaneResizeEvent.dispatch();
};

const Home: BlitzPage = () => {
  const [editorValue, setEditorValue] = useState<string>("");

  return (
    <Layout title="Savant">
      <main>
        <SplitPanes onDragFinished={onDragFinished}>
          <Spreadsheet />
          <Editor value={editorValue} onChange={setEditorValue} />
        </SplitPanes>
      </main>
    </Layout>
  );
};

export default Home;
