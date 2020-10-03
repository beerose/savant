import { ReactNode } from "react";
import { Head } from "blitz";

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "savant"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="root">{children}</div>
      <style jsx>
        {`
          #root {
            position: absolute;
            top: 0;
            left 0;
            width: 100vw;
            height: 100vh;

            display: flex;
          }
        `}
      </style>
    </>
  );
};

export default Layout;
