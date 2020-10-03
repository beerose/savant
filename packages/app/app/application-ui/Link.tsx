import { Link as BlitzLink } from "blitz";
import { ComponentProps } from "react";

import { Link as SpectrumLink } from "../reusable-ui/spectrum";

type BlitzLinkProps = ComponentProps<typeof BlitzLink>;
type SpectrumLinkProps = ComponentProps<typeof SpectrumLink>;
type AnchorProps = Pick<ComponentProps<"a">, "target" | "href" | "children">;

interface StyledAnchorProps
  extends Omit<SpectrumLinkProps, "children">,
    AnchorProps {}
function StyledAnchor({ href, target, children, ...rest }: StyledAnchorProps) {
  return (
    <SpectrumLink {...rest}>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a href={href} target={target}>
        {children}
      </a>
    </SpectrumLink>
  );
}

interface LinkProps
  extends Omit<BlitzLinkProps, "children">,
    Omit<StyledAnchorProps, "href"> {}

/**
 * @see https://blitzjs.com/docs/link
 * @see https://react-spectrum.adobe.com/react-spectrum/Link.html
 */
export function Link({
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  target,
  ...rest
}: LinkProps) {
  if (
    typeof href === "string" &&
    href.match(/^(https?:|\/\/|#|mailto:|javascript:)/)
  ) {
    return <StyledAnchor href={href} {...rest} />;
  }

  return (
    <BlitzLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      <StyledAnchor target={target} {...rest} />
    </BlitzLink>
  );
}
