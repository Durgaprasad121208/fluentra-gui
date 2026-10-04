import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from './components/layout/MainLayout';
import { ThemeProvider } from './theme/ThemeContext';
import NotificationProvider from './common/NotificationProvider';
import './App.css';

// Page Loader Fallback Component
const PageLoader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 400,
    }}
  >
    <Spin size="large" tip="Loading..." />
  </div>
);

// App Layout Container Wrapper
function AppLayoutWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
}

// Router Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AppLayoutWrapper />,
    children: [
      {
        path: '/dashboard',
        element: <div>Dashboard</div>,
      },
      {
        path: '*',
        element: <Outlet />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090e17',
          color: '#f8fafc',
        }}
      >
        <h2 style={{ fontSize: 32, marginBottom: 8 }}>404 - Page Not Found</h2>
        <p style={{ color: '#94a3b8' }}>The requested page does not exist.</p>
      </div>
    ),
  },
]);

// Main App Component
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
