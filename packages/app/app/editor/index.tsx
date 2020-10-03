import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import type { EditorDidMount, MonacoEditorProps } from "react-monaco-editor";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

import { SavantPaneResizeEvent } from "./SavantPaneResizeEvent";

const options = {
  minimap: {
    enabled: false,
  },
};

const MonacoEditor = dynamic(import("react-monaco-editor"), {
  ssr: false,
});

const initialRefValue = {};

export interface EditorProps
  extends Omit<MonacoEditorProps, "editorDidMount"> {}
export function Editor({ width, height, ...rest }: EditorProps) {
  const ref = useRef<{
    editor?: editor.IStandaloneCodeEditor;
    cleanup?: () => void;
  }>(initialRefValue);

  const onMount: EditorDidMount = useCallback((editor) => {
    if (!MonacoEnvironment) {
      throw new Error("MonacoEnvironment is not defined");
    }

    ref.current.editor = editor;

    if (typeof window !== "undefined") {
      const layout = () => editor.layout();

      window.addEventListener("resize", layout);
      const removeInternalResizeEvent = SavantPaneResizeEvent.addEventListener(
        layout
      );

      ref.current.cleanup = () => {
        window.removeEventListener("resize", layout);
        removeInternalResizeEvent();
      };
    }

    MonacoEnvironment.getWorkerUrl = (_moduleId: string, label: string) => {
      if (label === "json") return "_next/static/json.worker.js";
      // if (label === "css") return "_next/static/css.worker.js";
      // if (label === "html") return "_next/static/html.worker.js";
      if (label === "typescript" || label === "javascript")
        return "_next/static/ts.worker.js";
      return "_next/static/editor.worker.js";
    };
  }, []);

  useEffect(() => () => {}, []);

  return (
    <MonacoEditor
      editorDidMount={onMount}
      language="typescript"
      theme="vs-light"
      options={options}
      width={width}
      height={height}
      {...rest}
    />
  );
}
