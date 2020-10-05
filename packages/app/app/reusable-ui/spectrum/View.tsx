import { View as SpectrumView } from "@react-spectrum/view";
import { ComponentProps } from "react";
import css from "styled-jsx/css";

const viewCss = css.resolve`
  .column {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
`;

type SpectrumViewProps = ComponentProps<typeof SpectrumView>;

export interface ViewProps extends Omit<SpectrumViewProps, "UNSAFE_className"> {
  className?: string;
  flexDirection?: "column" | "row";
}
export function View({
  children,
  className,
  flexDirection,
  ...rest
}: ViewProps) {
  return (
    <SpectrumView
      {...rest}
      UNSAFE_className={[className, viewCss.className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      <style jsx>{`
        ${viewCss.styles}
      `}</style>
    </SpectrumView>
  );
}
