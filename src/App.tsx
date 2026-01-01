import React from 'react';
import './App.scss';

import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import PageIndex from './pages/index';
import PageBlog from './pages/blog';
import PageToy from './pages/toy';

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
];

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {pages.map(obj => 
          <Route path={obj.path} element={obj.element} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
