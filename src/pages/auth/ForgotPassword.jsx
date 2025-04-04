import React from 'react';
import {BASE_PATH_URL} from '@config/index';
import CustomHeader from '@components/UI/CustomHeader';
import ForgotPasswordForm from '@components/Auth/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <div>
      <CustomHeader title="Recuperar Contraseña" />
      <div className="flex">
        <div className="flex-1 px-6 md:px-0">
          <ForgotPasswordForm />
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

export default ForgotPassword;
