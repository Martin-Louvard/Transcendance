const verify = async (token: string) =>{

const requestOptions = {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
	  access_token: token
	 })
  };

  try{
	const response = await fetch('http://localhost:3001/auth/verify', requestOptions);
	if (response.ok)
	{
	  const data = await response.json();
	  return data;
	}
  }catch(err) {
  }
}

export default verify;