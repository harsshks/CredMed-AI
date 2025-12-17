import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Home, Info, FileCheck } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-teal-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              CredMed AI
            </span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-teal-50 text-teal-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            <Link
              to="/validate"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/validate') 
                  ? 'bg-teal-50 text-teal-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FileCheck size={18} />
              <span>Validate</span>
            </Link>
            
            <Link
              to="/about"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/about') 
                  ? 'bg-teal-50 text-teal-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Info size={18} />
              <span>About</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

