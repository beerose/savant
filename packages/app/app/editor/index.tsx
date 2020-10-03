import dynamic from 'next/dynamic';
import type { MonacoEditorProps } from 'react-monaco-editor';

const options = {
  minimap: {
    enabled: false,
  },
};

const MonacoEditor = dynamic(import('react-monaco-editor'), {
  ssr: false,
});

export interface EditorProps
  extends Omit<MonacoEditorProps, 'editorDidMount'> {}
export function Editor({ width, height, ...rest }: EditorProps) {
  return (
    <MonacoEditor
      editorDidMount={() => {
        if (!MonacoEnvironment) {
          throw new Error('MonacoEnvironment is not defined');
        }

        MonacoEnvironment.getWorkerUrl = (_moduleId: string, label: string) => {
          if (label === 'json') return '_next/static/json.worker.js';
          if (label === 'css') return '_next/static/css.worker.js';
          if (label === 'html') return '_next/static/html.worker.js';
          if (label === 'typescript' || label === 'javascript')
            return '_next/static/ts.worker.js';
          return '_next/static/editor.worker.js';
        };
      }}
      language="typescript"
      theme="vs-light"
      options={options}
      width={width}
      height={height}
      {...rest}
    />
  );
}
