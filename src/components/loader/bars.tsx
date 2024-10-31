import { DEFAULT_WAI_ARIA_ATTRIBUTE } from "@/type.d";

interface BarsProps {
  ariaLabel?: string;
  className?: string;
  show?: boolean;
}

export function Bars({ ariaLabel = "bars-loading", className, show }: BarsProps) {
  const classes = `${show ? "flex justify-center w-full my-20" : "hidden"} ${className || ""}`;
  return (
    <div
      className={classes}
      data-testid="bars-loading"
      aria-label={ariaLabel}
      {...DEFAULT_WAI_ARIA_ATTRIBUTE}
    >
      <svg
        width={80}
        height={80}
        fill="#4fa94d"
        viewBox="0 0 135 140"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="bars-svg"
      >
        <rect y="10" width="15" height="120" rx="6">
          <animate
            attributeName="height"
            begin="0.5s"
            dur="1s"
            values="120;110;100;90;80;70;60;50;40;140;120"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            begin="0.5s"
            dur="1s"
            values="10;15;20;25;30;35;40;45;50;0;10"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="30" y="10" width="15" height="120" rx="6">
          <animate
            attributeName="height"
            begin="0.25s"
            dur="1s"
            values="120;110;100;90;80;70;60;50;40;140;120"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            begin="0.25s"
            dur="1s"
            values="10;15;20;25;30;35;40;45;50;0;10"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="60" width="15" height="140" rx="6">
          <animate
            attributeName="height"
            begin="0s"
            dur="1s"
            values="120;110;100;90;80;70;60;50;40;140;120"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            begin="0s"
            dur="1s"
            values="10;15;20;25;30;35;40;45;50;0;10"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="90" y="10" width="15" height="120" rx="6">
          <animate
            attributeName="height"
            begin="0.25s"
            dur="1s"
            values="120;110;100;90;80;70;60;50;40;140;120"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            begin="0.25s"
            dur="1s"
            values="10;15;20;25;30;35;40;45;50;0;10"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="120" y="10" width="15" height="120" rx="6">
          <animate
            attributeName="height"
            begin="0.5s"
            dur="1s"
            values="120;110;100;90;80;70;60;50;40;140;120"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            begin="0.5s"
            dur="1s"
            values="10;15;20;25;30;35;40;45;50;0;10"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
}
