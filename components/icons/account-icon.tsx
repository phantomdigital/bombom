import type { SVGProps } from "react";

type AccountIconProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  size?: number | string;
  strokeWidth?: number | string;
};

export default function AccountIcon({
  size = 32,
  strokeWidth = 14,
  ...props
}: AccountIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill="none"
      {...props}
    >
      <circle
        cx="128"
        cy="96"
        r="64"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M32 216c19.37-33.47 54.55-56 96-56s76.63 22.53 96 56"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
