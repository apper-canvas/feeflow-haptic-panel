import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "Home" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Fees", href: "/fees", icon: "CreditCard" },
    { name: "Payments", href: "/payments", icon: "Wallet" },
    { name: "Invoices", href: "/invoices", icon: "FileText" }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-surface shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 font-display">FeeFlow</h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-surface shadow-xl border-r border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 font-display">FeeFlow</h1>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;