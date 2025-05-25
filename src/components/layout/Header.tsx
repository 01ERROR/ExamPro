import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span 
              className="ml-2 text-xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate('/')}
            >
              ExamPro
            </span>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline-block">
                  {user.name}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                leftIcon={<LogOut className="h-4 w-4" />}
                onClick={handleLogout}
              >
                <span className="hidden sm:inline-block">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;