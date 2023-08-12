const login = async (username: string, password: string) =>{

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password
       })
    };

    try{
      const response = await fetch('http://localhost:3001/auth/login', requestOptions);
      if (response.ok)
      {
        const data = await response.json();
        return data;
      }
    }catch(err) {
      console.log(err);
    }
  }

export default login;