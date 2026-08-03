/** Low-contrast leaf/growth line pattern — décor only inside CarrotBackground */
const CarrotPattern = ({ className }: { className?: string }) => (
  <div className={className ? `carrot-pattern ${className}` : 'carrot-pattern'} aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern
          id="carrot-growth-pattern"
          x="0"
          y="0"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 4c-2 6-6 10-12 12 4 1 8 3 10 6 2-3 6-5 10-6-6-2-10-6-12-12z"
            fill="#22C55E"
          />
          <path
            d="M24 18c2 8 5 14 7 18"
            stroke="#fe6019"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#carrot-growth-pattern)" />
    </svg>
  </div>
);

export default CarrotPattern;
