import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Brokers from './pages/Brokers';
import BrokerDetail from './pages/BrokerDetail';
import Leads from './pages/Leads';
import Layout from './components/Layout';

const isAuthenticated = () => !!localStorage.getItem('adminToken');

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="brokers" element={<Brokers />} />
          <Route path="brokers/:id" element={<BrokerDetail />} />
          <Route path="leads" element={<Leads />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;