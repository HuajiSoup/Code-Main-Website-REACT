import React from 'react';
import './App.scss';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Index from './pages/index';

const pages = [
  {
    path: '/',
    element: <Index />,
  },
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
