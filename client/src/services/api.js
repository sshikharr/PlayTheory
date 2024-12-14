/**
 * API service for fetching data from different endpoints
 * Centralizes all API calls in one place for better maintainability
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchDataFromEndpoint = async (endpoint, params) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/${endpoint}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};