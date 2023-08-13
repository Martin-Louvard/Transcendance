const login2fa = async (code: string | null, user: Object) =>{

    console.log(user)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.access_token}` },
      body: JSON.stringify({
        twoFactorAuthenticationCode: code
       })
    };
    try{
      const response = await fetch(`http://localhost:3001/2fa/${user.username}/login`, requestOptions);
      if (response.ok)
      {
        const user2fa = await response.json();
        user2fa.access_token = user.access_token
        return user2fa
      }
    }catch(err) {
      console.log(err);
    }

  }

export default login2fa