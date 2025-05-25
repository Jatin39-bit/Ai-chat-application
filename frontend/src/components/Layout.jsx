import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../context/user.context';
import { useSnackbar } from '../context/snackbar.context';
import Button from './Button';

const Layout = ({ children }) => {
  const { user, setUser } = useContext(userContext);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    
    showSnackbar({
      variant: 'info',
      title: 'Logged out',
      message: 'You have been successfully logged out'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {user && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-indigo-600 font-bold text-xl">
                    DevCollab
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Projects
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Button
                    onClick={handleLogout}
                    variant="primary"
                    size="sm"
                  >
                    Logout
                  </Button>
                </div>
                <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                  <div className="ml-3 relative">
                    <div className="flex items-center">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium text-sm">
                          {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">{user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout; 