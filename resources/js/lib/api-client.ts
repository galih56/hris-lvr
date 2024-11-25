import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/apps/authentication/paths';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { useCallback, useRef } from 'react';


function authRequestInterceptor(config: InternalAxiosRequestConfig) {  
  if (config.data) {
    config.data = decamelizeKeys(config.data);
  }
  if (config.params) {
    config.params = decamelizeKeys(config.params);
  }

  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    // Camelize the response data
    response.data = camelizeKeys(response.data);

    const data = response.data;
    let message = data?.message;
    
    // Handle specific error statuses
    if (data?.status === "error") {
      const errors = Object.keys(data.errors || {});
      if (errors.length > 0) {
        message = data.errors[errors[0]];
      }
    }

    if (message) {
      showToastWithThrottle(data?.status, message);
    }

    return response.data; 
  },
  (error) => {
    let message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });
    if(error.response){
      if (error.response.status === 401) {
        // Handle unauthorized errors, log out and redirect to login page
        const status = error.response?.data?.status || '';
        message = error.response?.data?.message || message;
        showToastWithThrottle(status, message);
      }
    
    
      if (error.response?.status === 403) {
        const searchParams = new URLSearchParams();
        const redirectTo =
          searchParams.get('redirectTo') || window.location.pathname;
          window.location.href = paths.auth.login.getHref(redirectTo);
      } 
      if (error.response?.status === 403) {
        // Redirect to login if not authorized
        window.location.href = paths.auth.login.getHref();
      }
    }else{
      // Handle network errors
      if (message === 'Network Error') {
        message = 'Maaf, terjadi masalah dengan koneksi jaringan. Silakan coba lagi nanti.';
        showToastWithThrottle('error', message);
      }else {
        showToastWithThrottle('error', message);
      }
    } 
    return Promise.reject(error);
  },
);


// Throttle notifications to prevent spamming the user
let lastErrorTime = 0;
const showToastWithThrottle = (status: string, message: string) => {
  const currentTime = new Date().getTime();
  if (currentTime - lastErrorTime > 3000) { // Throttle by 3 seconds
    switch (status) {
      case 'success':
        useNotifications.getState().addNotification({
          type: 'success',
          title: 'Success',
          message: message,
        });
        break;
      case 'error':
        useNotifications.getState().addNotification({
          type: 'error',
          title: 'Error',
          message: message,
        });
        break;
      default:
        break;
    }
    lastErrorTime = currentTime;
  }
};
