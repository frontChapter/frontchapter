import React from 'react';

interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width: number;
  height: number;
  fill?: boolean;
}

const Circle = React.forwardRef<HTMLDivElement, CircleProps>(
  ({ className = '', width, height, fill = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute ${className} ${fill ? 'bg-primary' : 'bg-[#ffe6db]'} rounded-full`}
        style={{ width: `${width}px`, height: `${height}px` }}
        {...props}
      ></div>
    );
  }
);

Circle.displayName = 'Circle';

export default Circle;
