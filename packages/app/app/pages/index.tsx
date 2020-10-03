import { Link, BlitzPage } from 'blitz';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import SplitPane from 'react-split-pane';
import { Flex, Grid } from '@adobe/react-spectrum';

import Layout from 'app/layouts/Layout';
import logout from 'app/auth/mutations/logout';
import { useCurrentUser } from 'app/users/useCurrentUser';
import { Spreadsheet } from 'app/spreadsheet';
import { Editor } from 'app/editor';
import { ChangeHandler } from 'react-monaco-editor';
import { Root } from 'app/reusable-ui/Root';

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

const Home: BlitzPage = () => {
  const [editorValue, setEditorValue] = useState<string>('');

  return (
    <Root>
      <main>
        {/* <div style={{ marginTop: '1rem', marginBottom: '5rem' }}>
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </div> */}

        <SplitPane split="vertical" minSize={30}>
          <Spreadsheet />
          <Editor value={editorValue} onChange={setEditorValue} />
        </SplitPane>
      </main>
      <footer>
        <p>
          Made with 💕 by <a href="twitter.com/aleksandrasays">Aleksandra</a>{' '}
          and <a href="twitter.com/hasparus">Piotr</a>.
        </p>
      </footer>
      {/* split pane styles */}
      <style jsx global>
        {`
          .Resizer {
            --dragbarColor: rgba(0, 0, 0, 0.1);
            --dragbarHoveredColor: rgba(0, 0, 0, 0.5);

            background: #000;
            opacity: 0.2;
            z-index: 1;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            -moz-background-clip: padding;
            -webkit-background-clip: padding;
            background-clip: padding-box;
          }

          .Resizer:hover {
            -webkit-transition: all 2s ease;
            transition: all 2s ease;
          }

          .Resizer.horizontal {
            height: 11px;
            margin: -5px 0;
            border-top: 5px solid var(--dragbarColor);
            border-bottom: 5px solid var(--dragbarColor);
            cursor: row-resize;
            width: 100%;
          }

          .Resizer.horizontal:hover {
            border-top: 5px solid var(--dragbarHoveredColor);
            border-bottom: 5px solid var(--dragbarHoveredColor);
          }

          .Resizer.vertical {
            width: 11px;
            margin: 0 -5px;
            border-left: 5px solid var(--dragbarColor);
            border-right: 5px solid var(--dragbarColor);
            cursor: col-resize;
          }

          .Resizer.vertical:hover {
            border-left: 5px solid var(--dragbarHoveredColor);
            border-right: 5px solid var(--dragbarHoveredColor);
          }
          .Resizer.disabled {
            cursor: not-allowed;
          }
          .Resizer.disabled:hover {
            border-color: transparent;
          }
        `}
      </style>
    </Root>
  );
};

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
