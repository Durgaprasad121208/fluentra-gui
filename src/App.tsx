import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { Spin, Card, Breadcrumb } from 'antd';
import MainLayout from './components/layout/MainLayout';
import { ThemeProvider } from './theme/ThemeContext';
import NotificationProvider from './common/NotificationProvider';
import { PlatformDashboard } from './pages/PlatformDashboard/PlatformDashboard';
import { Organisation } from './pages/organisations/Organisation';
import { Users } from './pages/users/Users';
import { CustomerActivity } from './pages/customer-activity/CustomerActivity';
import { Subscription } from './pages/subscriptions/Subscription';
import { PlansPricing } from './pages/plans-pricing/PlansPricing';
import { BillingInvoice } from './pages/billing-invoice/BillingInvoice';
import { Coupons } from './pages/coupons-discounts/Coupons';
import { Usage } from './pages/usage-utilisation/Usage';
import { Features } from './pages/feature-management/Features';
import { Environment } from './pages/environments/Environment';
import { Support } from './pages/support-access/Support';
import { AuditLog } from './pages/audit-logs/AuditLog';
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

// Generic Page Placeholder Component for Current Project Routes
const PagePlaceholder: React.FC<{ title?: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  const location = useLocation();
  const pageTitle =
    title ||
    location.pathname
      .replace(/^\//, '')
      .split('/')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' · ') ||
    'Dashboard';

  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Breadcrumb
        items={[
          { title: 'Fluentra' },
          ...pathParts.map((p) => ({
            title: p.charAt(0).toUpperCase() + p.slice(1),
          })),
        ]}
      />
      <Card
        style={{
          background: '#0f172a',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
        }}
      >
        <h2 style={{ color: '#f8fafc', margin: '0 0 8px 0' }}>{pageTitle}</h2>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          {subtitle || `Overview and metrics for ${location.pathname}`}
        </p>
      </Card>
    </div>
  );
};

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
        element: <PlatformDashboard />,
      },
      // Customers
      {
        path: '/customers/organisations',
        element: <Organisation />,
      },
      {
        path: '/customers/users',
        element: <Users />,
      },
      {
        path: '/customers/activity',
        element: <CustomerActivity />,
      },
      // Revenue
      {
        path: '/revenue/subscriptions',
        element: <Subscription />,
      },
      {
        path: '/revenue/pricing',
        element: <PlansPricing />,
      },
      {
        path: '/revenue/invoices',
        element: <BillingInvoice />,
      },
      {
        path: '/revenue/discounts',
        element: <Coupons />,
      },
      // Platform
      {
        path: '/platform/usage',
        element: <Usage />,
      },
      {
        path: '/platform/features',
        element: <Features />,
      },
      {
        path: '/platform/environments',
        element: <Environment />,
      },
      {
        path: '/platform/health',
        element: (
          <PagePlaceholder
            title="Platform Health"
            subtitle="System uptime, cluster telemetry, and incident history."
          />
        ),
      },
      // Governance
      {
        path: '/governance/support-access',
        element: <Support />,
      },
      {
        path: '/governance/audit-logs',
        element: <AuditLog />,
      },
      {
        path: '/governance/security-policies',
        element: (
          <PagePlaceholder
            title="Security & Policies"
            subtitle="Access control policies, compliance requirements, and MFA enforcement."
          />
        ),
      },
      // Settings
      {
        path: '/settings/platform',
        element: (
          <PagePlaceholder
            title="Platform Settings"
            subtitle="Global tenant configuration, domain settings, and SMTP credentials."
          />
        ),
      },
      {
        path: '/settings/admin-users',
        element: (
          <PagePlaceholder
            title="Admin Users"
            subtitle="Internal staff management, roles, and administrative permissions."
          />
        ),
      },
      {
        path: '/settings/notifications',
        element: (
          <PagePlaceholder
            title="Notifications"
            subtitle="Email templates, webhook endpoints, and alert channels."
          />
        ),
      },
      // Catch-all inside layout for any other navigation paths
      {
        path: '*',
        element: <PagePlaceholder />,
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
