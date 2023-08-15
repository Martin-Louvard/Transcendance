import { Friendships, User } from "../Types";
import { sessionState } from "./sessionSlice";

export async function fetchAllRelatedInfoApi(userId: string) {
  try {
    const response = await fetch(`http://localhost:3001/users/id/{id}?id=${userId}`);
    const data: sessionState = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


export async function fetchFriendsApi(userId: string) {
    try {
      // Replace with actual API call
      const response = await fetch(`http://localhost:3001/users/friends/{id}?id=${userId}`);
      const data: User[] = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  export async function fetchFriendshipsApi(userId: string) {
    try {
      // Replace with actual API call
      const response = await fetch(`http://localhost:3001/friends/user/{id}?id=${userId}`);
      const data: Friendships[] = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  export async function fetchChatChannelsApi(userId: string, type: 'joined' | 'owned' | 'banned') {
    try {
      // Replace with actual API call
      //const response = await fetch(`/api/users/${userId}/chat-channels?type=${type}`);
      //const data = await response.json();
      const data = null
      return data;
    } catch (error) {
      throw error;
    }
  }
  