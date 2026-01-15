import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import useUserStore from '@/store/userStore';
import SelfAssignRoles from './pages/SelfAssignRoles';
import { CONFERENCES_ROUTE, DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, SELF_ASSIGN_ROLES_ROUTE } from './routes';
import Conferences from './pages/Conferences';
import ConferencePapers from './pages/ConferencePapers';
import PaperTimeline from './pages/PaperTimeline';

const queryClient = new QueryClient();

function App() {
  const setUserFromToken = useUserStore((s) => s.setUserFromToken);
  const token = localStorage.getItem('token');
  if (token) {
    setUserFromToken(token);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="p-4">
        <nav className="mb-4 flex gap-4">
          <Link to={DASHBOARD_ROUTE} className="btn btn-primary">
            Dashboard
          </Link>
          <Link to={LOGIN_ROUTE} className="btn btn-secondary">
            Login
          </Link>
          <Link to={REGISTER_ROUTE} className="btn btn-accent">
            Register
          </Link>
        </nav>
        <Routes>
          <Route path={DASHBOARD_ROUTE} element={<Dashboard />} />
          <Route path={LOGIN_ROUTE} element={<Login />} />
          <Route path={REGISTER_ROUTE} element={<Register />} />
          <Route path={SELF_ASSIGN_ROLES_ROUTE} element={<SelfAssignRoles />} />
          <Route path={CONFERENCES_ROUTE} element={<Conferences />} />
          <Route path="/conferences/:conferenceId/papers" element={<ConferencePapers />} />
          <Route path="/conferences/:conferenceId/papers/:paperId/timeline" element={<PaperTimeline />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
