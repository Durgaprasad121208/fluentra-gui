import React from 'react';
import { Layout, Input } from 'antd';
import {
  ShieldCheck,
  Search,
  Calendar,
  Plus,
  Bell,
  PanelLeft,
  Moon,
  ChevronsUpDown,
} from 'lucide-react';
import { SubmitButton } from '../custombutton/CustomButton';
import { useTheme } from '../../theme/ThemeContext';
import {
  SUPER_ADMIN,
  BILLING_ADMIN,
  CUSTOMER_SUCCESS_ADMIN,
  SUPPORT_ADMIN,
  PLATFORM_OPERATIONS_ADMIN,
} from '../../data/role';
import './Header.css';

const { Header: AntHeader } = Layout;

export interface HeaderProps {
  userRole?: string;
  roleBadgeText?: string;
  searchPlaceholder?: string;
  dateRangeLabel?: string;
  userInitials?: string;
  notificationCount?: number;
  isSidebarCollapsed?: boolean;
  workspaceCode?: string;
  workspaceName?: string;
  categoryName?: string;
  pageName?: string;
  environmentName?: string;
  onToggleSidebar?: () => void;
  onSearch?: (value: string) => void;
  onDateRangeClick?: () => void;
  onQuickActionsClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onWorkspaceClick?: () => void;
  onEnvironmentClick?: () => void;
}

const CONTROL_PLANE_ROLES = [
  SUPER_ADMIN.toLowerCase(),
  BILLING_ADMIN.toLowerCase(),
  CUSTOMER_SUCCESS_ADMIN.toLowerCase(),
  SUPPORT_ADMIN.toLowerCase(),
  PLATFORM_OPERATIONS_ADMIN.toLowerCase(),
  'super admin',
  'billing admin',
  'customer success admin',
  'support admin',
  'platform operations admin',
];

export const Header: React.FC<HeaderProps> = ({
  userRole = 'Super Admin',
  roleBadgeText,
  searchPlaceholder,
  dateRangeLabel = 'Last 30 days',
  userInitials,
  notificationCount = 4,
  isSidebarCollapsed = false,
  workspaceCode = 'THA',
  workspaceName = 'ThermalAI',
  categoryName = 'Workspace',
  pageName = 'Overview',
  environmentName = 'Development',
  onToggleSidebar,
  onSearch,
  onDateRangeClick,
  onQuickActionsClick,
  onNotificationsClick,
  onProfileClick,
  onWorkspaceClick,
  onEnvironmentClick,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  // Determine if active role belongs to Control Plane or Client Portal
  const isControlPlane = CONTROL_PLANE_ROLES.some((r) =>
    userRole.toLowerCase().includes(r)
  );

  const formattedRoleBadge =
    roleBadgeText || `FLUENTRALABS ${userRole.toUpperCase()}`;
  const effectiveInitials = userInitials || (isControlPlane ? 'PK' : 'DM');
  const effectiveSearchPlaceholder =
    searchPlaceholder ||
    (isControlPlane ? 'Search organisations, users...' : 'Search...');

  return (
    <AntHeader className={`app-header ${isControlPlane ? 'is-control-plane' : 'is-client-portal'}`}>
      {/* Top Bright Green Accent Line */}
      <div className="header-top-accent-line" />

      <div className="header-main-bar">
        {/* ====================================================================
            LEFT SECTION
           ==================================================================== */}
        <div className="header-left-section">
          {/* Sidebar Closer / Toggle Button */}
          <button
            type="button"
            className={`sidebar-toggle-btn ${isSidebarCollapsed ? 'is-collapsed' : ''}`}
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle Sidebar"
          >
            <PanelLeft size={16} className="sidebar-toggle-icon" />
          </button>

          {/* Vertical Divider */}
          <div className="header-section-divider" />

          {/* Control Plane: Role Pill Badge & Search */}
          {isControlPlane ? (
            <>
              <div className="role-pill-container">
                <ShieldCheck size={13} className="role-shield-icon" />
                <span className="role-pill-label">{formattedRoleBadge}</span>
              </div>

              <div className="header-search-container control-plane-search">
                <Input
                  prefix={<Search size={14} className="search-prefix-icon" />}
                  placeholder={effectiveSearchPlaceholder}
                  className="header-search-input"
                  allowClear
                  onChange={(e) => onSearch && onSearch(e.target.value)}
                />
              </div>
            </>
          ) : (
            /* Client Portal: Workspace Breadcrumb Navigation */
            <div className="client-breadcrumb-container">
              {/* Workspace Selector Dropdown Pill */}
              <button
                type="button"
                className="workspace-selector-pill"
                onClick={onWorkspaceClick}
                title="Select Workspace"
              >
                <span className="workspace-tag-badge">{workspaceCode}</span>
                <span className="workspace-title-text">{workspaceName}</span>
                <ChevronsUpDown size={12} className="workspace-chevron-icon" />
              </button>

              <span className="breadcrumb-slash-divider">/</span>
              <span className="breadcrumb-category-text">{categoryName}</span>
              <span className="breadcrumb-slash-divider">/</span>
              <span className="breadcrumb-page-text">{pageName}</span>
            </div>
          )}
        </div>

        {/* ====================================================================
            RIGHT SECTION
           ==================================================================== */}
        <div className="header-right-section">
          {isControlPlane ? (
            /* Control Plane Right Controls */
            <>
              {/* Date Range Selector */}
              <button
                type="button"
                className="date-range-button"
                onClick={onDateRangeClick}
              >
                <Calendar size={14} className="date-range-icon" />
                <span>{dateRangeLabel}</span>
              </button>

              {/* Quick Actions Submit Button */}
              <SubmitButton
                className="header-quick-action-btn"
                icon={<Plus size={14} strokeWidth={2.5} className="quick-actions-icon" />}
                onClick={onQuickActionsClick}
              >
                Quick actions
              </SubmitButton>
            </>
          ) : (
            /* Client Portal Right Controls */
            <>
              {/* Client Portal Search Bar with Keyboard Shortcut */}
              <div className="client-search-container">
                <Input
                  prefix={<Search size={14} className="search-prefix-icon" />}
                  suffix={<span className="search-kbd-badge">⌘K</span>}
                  placeholder={effectiveSearchPlaceholder}
                  className="client-search-input"
                  allowClear
                  onChange={(e) => onSearch && onSearch(e.target.value)}
                />
              </div>

              {/* Environment Selector Dropdown Button */}
              <button
                type="button"
                className="environment-selector-btn"
                onClick={onEnvironmentClick}
                title="Active Environment"
              >
                <span className="environment-dot-indicator">●</span>
                <span className="environment-name-label">{environmentName}</span>
                <ChevronsUpDown size={12} className="environment-chevron-icon" />
              </button>
            </>
          )}

          {/* Theme Color Change Button with Lucide Moon Icon */}
          <button
            type="button"
            className="header-theme-toggle-btn"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            <Moon size={16} className="theme-toggle-icon moon-icon" />
          </button>

          {/* Notifications Bell */}
          <div
            className="header-bell-wrapper"
            onClick={onNotificationsClick}
            role="button"
            tabIndex={0}
            title="Notifications"
          >
            <div className="bell-icon-container">
              <Bell size={16} className="header-bell-icon" />
              {notificationCount > 0 && (
                <span className={isControlPlane ? 'notification-red-badge' : 'notification-blue-dot'}>
                  {isControlPlane ? (notificationCount > 99 ? '99+' : notificationCount) : ''}
                </span>
              )}
            </div>
          </div>

          {/* User Profile Avatar with Green Border Ring */}
          <div
            className="header-avatar-wrapper"
            onClick={onProfileClick}
            role="button"
            tabIndex={0}
            title="User Profile"
          >
            <div className="user-avatar-circle">
              <span className="user-avatar-initials">{effectiveInitials}</span>
            </div>
          </div>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
