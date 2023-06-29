import React from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

interface FooterProps {
  // Define any props you need for the Footer
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div id='stack-logos'>
        <label id='stack-logos-label'>Made With</label>
        <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
    </div>
  );
}

export default Footer;