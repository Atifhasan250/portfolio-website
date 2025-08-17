interface LogomarkProps {
  size?: number;
  className?: string;
}

export default function Logomark({ size = 40, className = "" }: LogomarkProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#E5E7EB', stopOpacity: 0.9}} />
          <stop offset="100%" style={{stopColor: '#9CA3AF', stopOpacity: 0.8}} />
        </linearGradient>
      </defs>
      
      {/* Diamond/Star shaped logomark centered */}
      <g transform="translate(20, 20)">
        {/* Top diamond */}
        <path 
          d="M0 -15 L7 -6 L0 3 L-7 -6 Z" 
          fill="url(#logoGradientLarge)" 
          opacity="0.95"
          className="transition-all duration-300 hover:opacity-100"
        />
        {/* Right diamond */}
        <path 
          d="M15 0 L6 7 L-3 0 L6 -7 Z" 
          fill="url(#logoGradientLarge)" 
          opacity="0.8"
          className="transition-all duration-300 hover:opacity-95"
        />
        {/* Bottom diamond */}
        <path 
          d="M0 15 L-7 6 L0 -3 L7 6 Z" 
          fill="url(#logoGradientLarge)" 
          opacity="0.95"
          className="transition-all duration-300 hover:opacity-100"
        />
        {/* Left diamond */}
        <path 
          d="M-15 0 L-6 -7 L3 0 L-6 7 Z" 
          fill="url(#logoGradientLarge)" 
          opacity="0.8"
          className="transition-all duration-300 hover:opacity-95"
        />
        
        {/* Inner highlight */}
        <circle 
          cx="0" 
          cy="0" 
          r="3" 
          fill="#FFFFFF" 
          opacity="0.3"
          className="transition-all duration-300 hover:opacity-50"
        />
      </g>
    </svg>
  );
}