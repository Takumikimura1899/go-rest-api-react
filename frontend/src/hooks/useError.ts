import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import axios from 'axios';
import { CsrfToken } from '../types';

export const useError = () => {
  const navigate = useNavigate();
  const resetEditedTask = useStore((state) => state.resetEditedTask);
  const getCsrfToken = async () => {
    const { data } = await axios.get<CsrfToken>(
      `${import.meta.env.VITE_REACT_APP_API_URL}/csrf`
    );
    axios.defaults.headers['X-CSRF-Token'] = data.csrf_token;
  };
  const switchErrorHandling = (message: string) => {
    switch (message) {
      case 'invalid csrf token':
        getCsrfToken();
        alert('CSRF token is invalid, please try again');
        break;
      case 'invalid or expired jwt':
        alert('access token expired, please login');
        resetEditedTask();
        navigate('/');
        break;
      case 'missing or malformed jwt':
        alert('access token is not valid, please login');
        resetEditedTask();
        navigate('/');
        break;
      case 'duplicated key not allowed':
        alert('email already exists, please use another one');
        break;
      case 'crypto/bcrypt: hashedPassword is not the hash of the given password':
        alert('password is not correct');
        break;
      case 'record not found':
        alert('email is not correct');
        break;
      default:
        alert(message);
    }
  };
  return { switchErrorHandling };
};
