import { Friendships, User, ChatChannels } from "./Types";
import { sessionState } from "./redux/sessionSlice";
/*
export async function fetchChatChannels(userId: number): Promise<ChatChannels[]> {

}; */

export async function fetchAllRelatedInfoApi(userId: number): Promise<sessionState> {
  try {
    const response = await fetch(`http://localhost:3001/users/id/{id}?id=${userId}`);
    const data: sessionState = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


export async function fetchFriendsApi(userId: string): Promise<User[]>  {
    try {
      const response = await fetch(`http://localhost:3001/users/friends/{id}?id=${userId}`);
      const data: User[] = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
  
export async function fetchFriendshipsApi(userId: string): Promise<Friendships[]> {
  try {
    const response = await fetch(`http://localhost:3001/friends/user/{id}?id=${userId}`);
    const data: Friendships[] = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
  
export async function login (username: string, password: string): Promise<User> {
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
    const data: User = await response.json();
    return data;
  }catch(error) {
    throw error;
  }
}

export async function login2fa (code: string | null, user: User, access_token: string): Promise<any> {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}` },
    body: JSON.stringify({
      twoFactorAuthenticationCode: code
     })
  };
  try{
    const response = await fetch(`http://localhost:3001/2fa/${user.username}/login`, requestOptions);
    const data: User = await response.json();
    data.access_token = access_token
    return data
  }catch(error) {
    throw error;
  }

}

export async function login42 (code42: string | null): Promise<User> {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: code42
     })
  };

  try{
    const response = await fetch('http://localhost:3001/auth/42login', requestOptions);
    const data: User = await response.json();
    return data
  }catch(error) {
    throw error;
  }
}
