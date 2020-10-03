import dynamic from 'next/dynamic';

export const Spreadsheet = dynamic(() => import('./Table'), {
  ssr: false,
});
