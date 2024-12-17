import { LOGO } from './logo-svg';

export const HEADER_TEMPLATE = `
<header style="
  display: flex; 
  align-items: center; 
  padding: 12px 24px; 
  background-color: #ffffff; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-bottom: 1px solid #f0f0f0;
">
  <a href="https://stayhub.live" style="
    text-decoration: none; 
    display: flex; 
    align-items: center;
  ">
    ${LOGO}
  </a>
</header>`;
