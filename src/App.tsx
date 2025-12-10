import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import PageIndex from './pages/index';
import PageBlog from './pages/blog';

import './App.scss';

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
  }
];

function App() {
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
