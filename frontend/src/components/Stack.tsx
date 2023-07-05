const Stack = () =>{
  const reactLogo = '/react.svg'
  const viteLogo = '/vite.svg'
  const nestLogo = '/nest.svg'
  const threeLogo = '/three.svg'

    return (
        <div id='stack-logos'>
            <label id='stack-logos-label'>Made With</label>
            <a href="https://nestjs.com/" target="_blank">
              <img src={nestLogo} className="logo" alt="NestJs logo" />
            </a>
            <a href="https://threejs.org/" target="_blank">
              <img src={threeLogo} className="logo" alt="Three.js logo" />
            </a>
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
        </div>
      );
}

export default Stack;