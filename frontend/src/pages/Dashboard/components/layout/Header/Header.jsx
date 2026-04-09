import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import { Icons } from '../../common/Icons/Icons';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
 
      if (refreshToken) {
        await AxiosInstance.post('/users/logout/', {
          refresh: refreshToken,
        });
      }
 
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

 
      toast.success('تم تسجيل الخروج بنجاح', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
      });

 
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Error during logout:', error);

 
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      toast.warning('تم تسجيل الخروج محلياً', {
        position: 'top-center',
        autoClose: 2000,
      });

 
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    }
  };

  return (
    <header className="app-header">
      <div className="header-actions">
        {isAuthenticated && (
          <button className="btn-logout" onClick={handleLogout}>
            <Icons.Logout />
            <span>تسجيل الخروج</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;