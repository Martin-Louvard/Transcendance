import ProfileCard from "./ProfileCard";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import Form from "../Authentication/Form";
import { setUser } from "../Authentication/userReducer";

const FriendsCard = () =>{
    const storedFriends = useAppSelector((state) => state.user.friends);
    const storedSymetricFriends = useAppSelector((state) => state.user.friendUserFriends);
    const user = useAppSelector((state) => state.user);
    const [showFriend, setShowFriend] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(Object)
    const [friends, setFriends] = useState(storedFriends)
    const [symetricFriends, setSymetricFriends] = useState(storedSymetricFriends)
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const [allFriends, setAllFriends] = useState(Array);
    const dispatch = useAppDispatch();

    
    useEffect(() => {
      const fetchFriendsWithInfos = async () => {
        const friendsWithInfos = await Promise.all(
          storedFriends.map(async (item) => {
            const response = await fetch(`http://localhost:3001/users/id/${item.friend_id}?id=${item.friend_id}`);
            const data = await response.json();
            return data;
          })
        );
        setFriends(friendsWithInfos);
      };
    
      fetchFriendsWithInfos();
    }, [storedFriends]);

    useEffect(() => {
      const fetchSymetricFriendsWithInfos = async () => {
        const SymetricriendsWithInfos = await Promise.all(
          storedSymetricFriends.map(async (item) => {
            const response = await fetch(`http://localhost:3001/users/id/${item.user_id}?id=${item.user_id}`);
            const data = await response.json();
            return data;
          })
        );
        setSymetricFriends(SymetricriendsWithInfos);
      };
    
      fetchSymetricFriendsWithInfos();
    }, [storedSymetricFriends]);

    useEffect(() => {
      const all = friends.concat(symetricFriends)
      all.sort((a, b) => (a.username > b.username ? 1 : -1))
      setAllFriends(all)
    }, [friends, symetricFriends]);


    const addFriend = async (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault();
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          friend_username: newFriendUsername
         })
      };

      try{
        const response = await fetch(`http://localhost:3001/users/${user.username}/friends`, requestOptions)
        if (response.ok)
        {
          const result = await response.json()
          const isLoggedIn = true
          dispatch(setUser({...result, isLoggedIn}));
        }
        else if (response.status === 404)
          alert("User not found")
        else if (response.status === 406)
          alert("You can't add yourself as a friend")
      }catch(err) {
        console.log("coucou de erreur")

        alert(err);
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.id === "FriendUsername" ? setNewFriendUsername(event.target.value): 
       ()=>{}
     };

    const displayFriendProfile = (userFriend: object) =>{
      setShowFriend(true)
      setSelectedFriend(userFriend)
    }

    const friendList = () =>{
      return <div className="friends-card-wrapper">
      <Form onSubmit={addFriend} title="Add a new friend" buttonText="Add">
      <div>
        <input type="FriendUsername" id="FriendUsername" placeholder="Friend's username" value={newFriendUsername} onChange={handleChange} />
      </div>
      </Form>
      <h2>My Friends</h2>
        <ul className="friend-list">
          {allFriends.map((friend, index) => (
            <li className="friend-item" onClick={() => displayFriendProfile(friend)} key={index}>
            <div className='friend-picture'>
                <img src='./default.jpg'/>
            </div>
              <p>{friend.username}</p>
            </li>
          ))}
        </ul>
        </div>
    }


  return (
    <>

        {
          showFriend ? <ProfileCard {...selectedFriend}/> : friendList()
        }

    </>
  );
};

export default FriendsCard