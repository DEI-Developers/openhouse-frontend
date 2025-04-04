import React from 'react';
import {BASE_PATH_URL} from '@config/index';
import LoginForm from '@components/Auth/LoginForm';
import CustomHeader from '@components/UI/CustomHeader';

const Login = () => {
  return (
    <div>
      <CustomHeader title="Iniciar sesión" />
      <div className="flex">
        <div className="flex-1 px-6 md:px-0">
          <LoginForm />
        </div>
        <div className="hidden md:flex flex-1">
          <img
            src={`${BASE_PATH_URL}/uca-bg.jpg`}
            className="h-screen py-8"
            alt="UCA"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
