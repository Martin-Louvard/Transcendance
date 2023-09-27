import '../UserProfileCards/Cards.scss'
import React , { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setContentToShow, setSessionUser } from '../../redux/sessionSlice';
import toast from 'react-hot-toast'
import { ContentOptions } from '../../Types';


const TwoFACard: React.FC = () => {
    const user = useAppSelector((state) => state.session.user)
    const access_token = useAppSelector((state) => state.session.access_token);
    const [twoFaQrcode, setTwoFaQrcode] = useState<string>('');
    const dispatch = useAppDispatch();
    const [codeInput, setCodeInput] = useState<string>('');

    useEffect(()=>{
        generateQr()
    },[])

    const generateQr = async () =>{
        const requestOptions = {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${access_token}`},
        };
  
        try{
          const response = await fetch(`http://10.33.4.5:3001/2fa/${user?.username}/generate`, requestOptions)
          if (response.ok) {
            const blobData = await response.blob();
            const blobText = await blobData.text()
            setTwoFaQrcode(blobText);
  
          }
        }catch(err) {
          console.log(err);
        }
      }

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
          },
          body: JSON.stringify({
            twoFactorAuthenticationCode: codeInput
            })
        };
  
        try{
          const response = await fetch(`http://10.33.4.5:3001/2fa/${user?.username}/turn-on`, requestOptions)
          if (response.ok)
          {
            const result = await response.json()
            dispatch(setSessionUser(result));
            toast.success("2fa enabled")
            dispatch(setContentToShow(ContentOptions.PROFILE))
          }
        }catch(err) {
          console.log(err);
        }
      }

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        if (event.target.id === 'code') {
          setCodeInput(event.target.value);
        }
      }

      const QrCode = ()=> {
        return(
          <div className="twofa">
            <p>Scan this QRcode with the google authenticator app and enter your code below</p>
            <img src={twoFaQrcode}/>
            <form onSubmit={handleSubmit}>
              <input type="text" id="code" value={codeInput} onChange={handleChange} placeholder='code...' ></input>
              <button type="submit">Confirm</button>
            </form>
          </div>
        )
      }

  return (
    <>
      <div className="card-wrapper" style={{marginTop:"10vh"}}>
        {twoFaQrcode.length ? QrCode() : <>Server Error</>}
      </div>
    </>
  );
};

export default TwoFACard;
