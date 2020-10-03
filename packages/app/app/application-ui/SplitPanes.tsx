import SplitPane, { SplitPaneProps } from "react-split-pane";

interface SplitPanesProps extends Omit<SplitPaneProps, "split" | "minSize"> {
  children: React.ReactNode[];
}
export function SplitPanes(props: SplitPanesProps) {
  return (
    <>
      <SplitPane
        split="vertical"
        // this is actually initial size 🤷
        minSize="50%"
        {...props}
      />
      <style jsx global>
        {`
          .Resizer {
            --dragbarColor: var(--spectrum-global-color-gray-100);
            --dragbarHoveredColor: var(--spectrum-global-color-gray-400);

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
    </>
  );
}
