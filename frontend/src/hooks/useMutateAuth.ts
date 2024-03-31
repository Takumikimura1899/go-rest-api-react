import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { useError } from './useError';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { Credential } from '../types';

export const useMutateAuth = () => {
  const navigate = useNavigate();
  const resetEditedTask = useStore((state) => state.resetEditedTask);
  const { switchErrorHandling } = useError();

  const loginMutation = useMutation(
    async (user: Credential) =>
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/login`, user),
    {
      onSuccess: () => {
        navigate('/todo');
      },
      onError: (error: any) => {
        if (error.response.data.message) {
          switchErrorHandling(error.response.data.message);
        } else {
          switchErrorHandling(error.response.data);
        }
      },
    }
  );

  const registerMutation = useMutation(
    async (user: Credential) =>
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/signup`,
        user
      ),
    {
      onError: (error: any) => {
        if (error.response.data.message) {
          switchErrorHandling(error.response.data.message);
        } else {
          switchErrorHandling(error.response.data);
        }
      },
    }
  );

  const logoutMutation = useMutation(
    async () =>
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/logout`),
    {
      onSuccess: () => {
        resetEditedTask();
        navigate('/');
      },
      onError: (error: any) => {
        if (error.response.data.message) {
          switchErrorHandling(error.response.data.message);
        } else {
          switchErrorHandling(error.response.data);
        }
      },
    }
  );
  return { loginMutation, registerMutation, logoutMutation };
};
