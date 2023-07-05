import React from 'react';


interface FooterProps {
  // Define any props you need for the Footer
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div id='footer'>
      <p>I'm the footer</p>
    </div>
  );
}

export default Footer;