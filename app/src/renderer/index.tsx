import { render } from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { App } from './App';

render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
