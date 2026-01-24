import React from 'react';
import './App.scss';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { domAnimation, LazyMotion } from 'motion/react';

import PageIndex from './pages/index';
import PageBlog from './pages/blog';
import PageToy from './pages/toy';
import PageError from './pages/error';
import ToyRedirect from './pages/toy/ToyRedirect';

const pages = [
  {
    path: '/',
    element: <PageIndex />,
  },
  {
    path: '/blog',
    element: <PageBlog />
  },
  {
    path: '/blog/:blogID',
    element: <PageBlog />
  },
  {
    path: '/toy',
    element: <PageToy />
  },
  {
    path: '/toy/:slug',
    element: <ToyRedirect />
  }
];

const App: React.FC = () => {
  return (
    <LazyMotion features={domAnimation}>
      <Router>
        <Routes>
          {pages.map(obj =>
            <Route path={obj.path} element={obj.element} />
          )}
          <Route path='*' element={<PageError />} />
        </Routes>
      </Router>
    </LazyMotion>
  );
}

export default App;
