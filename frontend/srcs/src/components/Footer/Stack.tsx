import React from 'react';
import './Stack.scss';

const Stack: React.FC = () => {
  const reactLogo = '/react.svg';
  const viteLogo = '/vite.svg';
  const nestLogo = '/nest.svg';
  const threeLogo = '/three.svg';

  return (
    <div id="stack-logos">
      <label id="stack-logos-label">Made With</label>
      <a href="https://nestjs.com/" target="_blank" rel="noopener noreferrer">
        <img src={nestLogo} className="logo" alt="NestJs logo" />
      </a>
      <a href="https://threejs.org/" target="_blank" rel="noopener noreferrer">
        <img src={threeLogo} className="logo" alt="Three.js logo" />
      </a>
      <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
  );
};

export default Stack;
