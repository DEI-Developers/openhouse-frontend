import React from 'react';
import {Link} from 'react-router-dom';
import {BASE_PATH_URL} from '@config/index';
import {RiArrowGoBackLine} from 'react-icons/ri';
import CustomHeader from '@components/UI/CustomHeader';

const NotFound = () => {
  return (
    <div>
      <CustomHeader title="404 Error" />
      <div className="flex">
        <div className="flex items-center flex-1">
          <div className="pl-8 lg:pl-32 mt-32 md:mt-0">
            <p className="font-medium text-primary">404 Error</p>
            <h1 className="font-bold text-3xl text-center tracking-wide my-1">
              Página no encontrada
            </h1>
            <p className="text-gray-500 mb-5">
              Lo sentimos, la página que buscas no existe.
            </p>
            <div>
              <Link
                to="/"
                className="inline-flex px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 hover:bg-gray-100"
              >
                <RiArrowGoBackLine className="text-xl" />
                <span>Regresar</span>
              </Link>
            </div>
          </div>
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

export default NotFound;
