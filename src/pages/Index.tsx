
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle redirect from 404.html
    const query = new URLSearchParams(window.location.search);
    const redirectPath = query.get('redirect');
    
    if (redirectPath) {
      // Remove the query parameter
      window.history.replaceState(null, '', window.location.pathname);
      // Navigate to the requested path
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return <LoginForm />;
};

export default Index;
