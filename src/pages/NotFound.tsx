
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-4xl font-bold mb-2 text-pawsBlue">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-6">
            We couldn't find the page you were looking for. It might have been moved or deleted.
          </p>
          <Link to="/" className="inline-block">
            <Button>
              <HomeIcon className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
