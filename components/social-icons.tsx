import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      <path d="M14 8h3V4.5h-3.2C10.7 4.5 9 6.3 9 9.2V12H6v3.5h3V22h4v-6.5h3.2L17 12h-4V9.6c0-1 .4-1.6 1-1.6Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.8" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v7M8 7.3v.1M12 17v-4c0-1.8 1-3 2.7-3 1.6 0 2.3 1.1 2.3 3v4M12 10v7" />
    </svg>
  );
}
