import { useEffect } from "react";
import Authentication from "../../components/Authentication";
import Dashboard from "../../components/Dashboard";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setFriend } from "../../friendsReducer";

const Home = () => {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch()

    useEffect(()=>{
        const getFriendsInfos = async () => {
            const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json',
             },
            };
        
            try{
              const response = await fetch(`http://localhost:3001/users/friends/{id}?id=${user.id}`, requestOptions);
              if (response.ok)
              {
                const friends = await response.json();
                dispatch(setFriend(friends))
              }
            }catch(err) {
              alert(err);
            }
          }
        getFriendsInfos();
    },[user.id])

    return <>
    {
        user.id && user.id != 0 ?  <Dashboard/> : <Authentication/>
    }
    </>
}
export default Home;