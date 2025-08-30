import React from "react";

interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width: number;
  height: number;
  fill?: boolean;
}

function Circle({ className = "", width, height, fill = true, ...props }: CircleProps) {
  return (
    <div
      className={`absolute ${className} ${fill ? "bg-primary" : "bg-[#ffe6db]"} rounded-full`}
      style={{ width: `${width}px`, height: `${height}px` }}
      {...props}
    ></div>
  );
}

export default Circle;
