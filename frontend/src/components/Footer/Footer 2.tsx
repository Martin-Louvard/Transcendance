import React from 'react';
import Stack from './Stack';

interface FooterProps {
  // Define any props you need for the Footer
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div id='footer'>
      <Stack/>
    </div>
  );
}

export default Footer;