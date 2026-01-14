import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="p-4">
      <nav className="mb-4 flex gap-4">
        <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
        <Link to="/register" className="btn btn-accent">Register</Link>
      </nav>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
