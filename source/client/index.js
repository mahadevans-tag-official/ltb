import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'client/style/index.scss';
import _Route from './Route';

createRoot(document.getElementById('viewer')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<_Route />} />
    </Routes>
  </BrowserRouter>
);
