import { ComponentProps } from 'react';

export function Root(props: ComponentProps<'div'>) {
  return (
    <>
      <div id="root" {...props}></div>
      <style jsx>
        {`
          #root {
            position: absolute;
            top: 0;
            left 0;
            width: 100vw;
            height: 100vh;
          }
        `}
      </style>
    </>
  );
}
