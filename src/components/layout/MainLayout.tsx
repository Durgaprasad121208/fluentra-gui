import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import './MainLayout.css';

const { Content } = Layout;

export interface MainLayoutProps {
  children?: React.ReactNode;
  activeKey?: string;
  onNavigate?: (key: string) => void;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  userRole?: string;
  userInitials?: string;
  onSearch?: (value: string) => void;
  onSwitchPortal?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeKey: customActiveKey,
  onNavigate: customOnNavigate,
  collapsed: controlledCollapsed,
  onCollapse,
  defaultCollapsed = false,
  collapsible = true,
  userRole: propUserRole,
  userInitials: propUserInitials,
  onSearch,
  onSwitchPortal,
}) => {
  // React Router Navigation with safety
  let routerLocationPath = '/dashboard';
  let navigate: ((to: string) => void) | null = null;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = useLocation();
    routerLocationPath = location.pathname;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const nav = useNavigate();
    navigate = nav;
  } catch {
    // In case component is rendered outside of BrowserRouter
  }

  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(defaultCollapsed);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const currentActivePath = customActiveKey || routerLocationPath || '/dashboard';

  const handleNavigation = (key: string) => {
    if (customOnNavigate) {
      customOnNavigate(key);
    } else if (navigate) {
      navigate(key);
    }
  };

  const handleToggleCollapse = (nextCollapsedState?: boolean) => {
    const updatedState = nextCollapsedState !== undefined ? nextCollapsedState : !isCollapsed;
    if (onCollapse) {
      onCollapse(updatedState);
    } else {
      setInternalCollapsed(updatedState);
    }
  };

  const [currentRole, setCurrentRole] = useState<string>(
    () => propUserRole || localStorage.getItem('userRole') || 'DEVELOPER'
  );

  const activeUserRole = propUserRole || currentRole;
  const isControlPlaneRole = activeUserRole.toLowerCase().includes('admin');
  const activeUserInitials = propUserInitials || (isControlPlaneRole ? 'PK' : 'DM');

  const handlePortalSwitch = () => {
    if (onSwitchPortal) {
      onSwitchPortal();
      return;
    }
    const nextRole = isControlPlaneRole ? 'DEVELOPER' : 'SUPER ADMIN';
    setCurrentRole(nextRole);
    localStorage.setItem('userRole', nextRole);
    if (nextRole === 'DEVELOPER') {
      handleNavigation('/workspace/overview');
    } else {
      handleNavigation('/dashboard');
    }
  };

  return (
    <Layout className="fl-app-frame">
      {/* Navigation Sidebar */}
      <Sidebar
        activeKey={currentActivePath}
        onSelectKey={handleNavigation}
        collapsed={isCollapsed}
        collapsible={collapsible}
        userRole={activeUserRole}
        onSwitchPortal={handlePortalSwitch}
        portalSwitchLabel={isControlPlaneRole ? 'Switch to Developer Portal' : 'Switch to Super Admin'}
      />

      {/* Main Workspace Frame */}
      <Layout className={`fl-workspace-container ${isCollapsed ? 'is-sidebar-collapsed' : ''}`}>
        {/* Top Header Bar */}
        <Header
          userRole={activeUserRole}
          roleBadgeText={`FLUENTRALABS ${activeUserRole.toUpperCase()}`}
          userInitials={activeUserInitials}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebar={() => handleToggleCollapse()}
          onSearch={onSearch}
        />

        {/* Dynamic Page Content Viewport */}
        <Content className="fl-page-viewport">
          <div className="fl-content-canvas">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
