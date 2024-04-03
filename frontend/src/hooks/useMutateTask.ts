import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useError } from './useError';
import useStore from '../store';
import { Task } from '../types';
import axios from 'axios';

export const useMutateTask = () => {
  const queryClient = useQueryClient();
  const { switchErrorHandling } = useError();
  const resetEditedTask = useStore((state) => state.resetEditedTask);

  const createTaskMutation = useMutation(
    (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) =>
      axios.post<Task>(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks`, task),
    {
      onSuccess: (res) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTasks) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            [...previousTasks, res.data]
          );
        }
        resetEditedTask();
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
  const updateTaskMutation = useMutation(
    (task: Omit<Task, 'created_at' | 'updated_at'>) =>
      axios.put<Task>(
        `${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${task.id}`,
        { title: task.title }
      ),
    {
      onSuccess: (res, variables) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTasks) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTasks.map((task) =>
              task.id === variables.id ? res.data : task
            )
          );
        }
        resetEditedTask();
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
  const deleteTaskMutation = useMutation(
    (id: number) =>
      axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${id}`),
    {
      onSuccess: (_, variables) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTasks) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTasks.filter((task) => task.id !== variables)
          );
        }
        resetEditedTask();
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
  return { createTaskMutation, updateTaskMutation, deleteTaskMutation };
};
