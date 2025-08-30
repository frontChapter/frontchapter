"use client";

import { useRTL } from "@/hooks/useRTL";
import clsx from "clsx";
import { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, className }) => {
  const [show, setShow] = useState(false);
  const { isRTL } = useRTL();

  return (
    <div
      className={`mb-2 overflow-hidden rounded-xl border border-border ${className}`}
    >
      <button
        className={clsx("relative block w-full bg-theme-light px-4 py-3 text-dark", {
          "text-right": isRTL,
          "text-left": !isRTL,
        })}
        onClick={() => setShow(!show)}
      >
        {title}
        <svg
          className={clsx(
            "absolute top-1/2 m-0 h-4 w-4 -translate-y-1/2",
            {
              "rotate-180": show,
            },
            { "right-4": !isRTL, "left-4": isRTL }
          )}
          x="0px"
          y="0px"
          viewBox="0 0 512.011 512.011"
          xmlSpace="preserve"
        >
          <path
            fill="currentColor"
            d="M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0 s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667 C514.096,145.416,514.096,131.933,505.755,123.592z"
          />
        </svg>
      </button>
      <div className={`px-4 py-3 ${!show && "hidden"}`}>{children}</div>
    </div>
  );
};

export default Accordion;
