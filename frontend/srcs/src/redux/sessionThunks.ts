import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllRelatedInfoApi } from '../api.ts';

export const fetchRelatedUserData = createAsyncThunk(
  'session/fetchRelatedUserData',
  async (userId: string) => {
    try {
      // Fetch friends data using userId
      const data = await fetchAllRelatedInfoApi(userId);
        return data
    } catch (error) {
      // Handle error
      console.error('Error fetching related data:', error);
      throw error;
    }
  }
);
