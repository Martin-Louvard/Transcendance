import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllRelatedInfoApi } from '../api.ts';

export const fetchRelatedUserData = createAsyncThunk(
  'session/fetchRelatedUserData',
  async ({userId, access_token}: {userId:number, access_token:string}) => {
    try {
      // Fetch friends data using userId
      const data = await fetchAllRelatedInfoApi(userId, access_token);
        return data
    } catch (error) {
      // Handle error
      console.error('Error fetching related data:', error);
      throw error;
    }
  }
);
