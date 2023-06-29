import React from 'react';

interface LoginProps {
  // Define any props you need for the Login
}

const Login: React.FC<LoginProps> = () => {

  return (
    <div className="card-block">
      <div className="card">
        <button onClick={() => console.log('login clicked')}>
          Login
        </button>
      </div>
      <div className="card">
        <button onClick={() => console.log('signup clicked')}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default Login;