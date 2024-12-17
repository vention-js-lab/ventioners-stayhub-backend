export const LOGO_TEMPLATE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 60" width="240" height="48">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF385C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF6B6B;stop-opacity:0.8" />
    </linearGradient>
    <filter id="shadowEffect" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#888" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <g transform="translate(0, 5)" filter="url(#shadowEffect)">
    <circle cx="20" cy="20" r="18" 
            fill="white" 
            stroke="url(#logoGradient)" 
            stroke-width="2"/>
            
    <path d="M20 10 
             L30 20
             L28 20
             L28 30
             L12 30
             L12 20
             L10 20 Z" 
          fill="url(#logoGradient)"/>
    
    <rect x="18" y="24" 
          width="4" height="6" 
          fill="white"/>
  </g>
  
  <g transform="translate(45, 0)">
    <text x="0" y="35" 
          font-family="'Inter', Arial, sans-serif" 
          font-weight="800" 
          font-size="32" 
          letter-spacing="-1.5"
          text-anchor="start">
      <tspan fill="#2D2D2D">Stay</tspan><tspan fill="#FF385C">Hub</tspan>
    </text>
  </g>
</svg>`;
