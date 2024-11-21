import React from 'react';
import Home from './Home';

export {Home};

export const Login = React.lazy(() => import('./Login'));
export const Dashboard = React.lazy(() => import('./Platform'));
