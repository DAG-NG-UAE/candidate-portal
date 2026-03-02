import axios from 'axios';
import { dispatch } from '@/redux/dispatchHandle';
import { clearState } from '@/redux/slices/candidate';
import { clearState as clearOfferState } from '@/redux/slices/offer';

// Base URL for your API (can be configured via environment variables)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // Backend url - Base URL should not include specific endpoints like /api or /requisition

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach potentially auth tokens (requisition_Id will be dynamic and passed with each request)
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.message === 'Candidate authentication required. Session expired or invalid.' || error.message === 'You have completed the joining form. Thank you ') {
        //we should probably tell them to verify their token again so do we grey out the pages and show the verify token page
        dispatch(clearState())
        dispatch(clearOfferState())
        window.location.href = '/success';
      }
      console.log(`the error response is => ${error}`)
    
    }  else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error);
    }
      
      return Promise.reject(error);
  }
  
  
);

export default axiosInstance;
