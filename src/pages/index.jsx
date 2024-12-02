import React from 'react';
import Home from './Home';

export {Home};

export const Login = React.lazy(() => import('./Login'));
export const ResetPassword = React.lazy(() => import('./auth/ResetPassword'));
export const ForgotPassword = React.lazy(() => import('./auth/ForgotPassword'));
export const Dashboard = React.lazy(() => import('./Platform'));
export const NotFound = React.lazy(() => import('./404'));
