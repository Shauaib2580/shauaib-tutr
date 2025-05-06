import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { exportData } = useAppContext();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          try {
            // Validate JSON format
            JSON.parse(content);
            
            // Show confirmation dialog
            if (window.confirm('This will replace all your current data. Are you sure?')) {
              // Import data
              const { importData } = useAppContext();
              importData(content);
            }
          } catch (error) {
            alert('Invalid JSON file. Please select a valid backup file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <GraduationCap className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-bold text-primary-600 dark:text-primary-400">Tutr</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/schedule" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/schedule') 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Schedule
            </Link>
            <Link 
              to="/students" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/students') 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Students
            </Link>
            <Link 
              to="/income" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/income') 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Income
            </Link>
            
            <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
            
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                Data
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block dark:bg-gray-800">
                <button 
                  onClick={exportData}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Export Data
                </button>
                <button 
                  onClick={handleImport}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Import Data
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 mr-2"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/schedule"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/schedule') 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={closeMenu}
            >
              Schedule
            </Link>
            <Link
              to="/students"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/students') 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={closeMenu}
            >
              Students
            </Link>
            <Link
              to="/income"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/income') 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={closeMenu}
            >
              Income
            </Link>
            <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
            <button 
              onClick={() => { exportData(); closeMenu(); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Export Data
            </button>
            <button 
              onClick={() => { handleImport(); closeMenu(); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Import Data
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;