import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import PageIndex from './pages/index';
import PageThings from './pages/things';

import './App.scss';

const pages = [
  {
    path: '/',
    element: <PageIndex />,
  },
  {
    path: '/things',
    element: <PageThings />
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

// function App() {
//   return <ScrollLinked></ScrollLinked>
// }

export default App;
