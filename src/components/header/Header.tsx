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
} from 'lucide-react';
import { SubmitButton } from '../custombutton/CustomButton';
import { useTheme } from '../../theme/ThemeContext';
import './Header.css';

const { Header: AntHeader } = Layout;

export interface HeaderProps {
  roleBadgeText?: string;
  searchPlaceholder?: string;
  dateRangeLabel?: string;
  userInitials?: string;
  notificationCount?: number;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onSearch?: (value: string) => void;
  onDateRangeClick?: () => void;
  onQuickActionsClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  roleBadgeText = 'FLUENTRALABS SUPER ADMIN',
  searchPlaceholder = 'Search organisations, users...',
  dateRangeLabel = 'Last 30 days',
  userInitials = 'PK',
  notificationCount = 4,
  isSidebarCollapsed = false,
  onToggleSidebar,
  onSearch,
  onDateRangeClick,
  onQuickActionsClick,
  onNotificationsClick,
  onProfileClick,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <AntHeader className="app-header">
      {/* Top Bright Green Accent Line */}
      <div className="header-top-accent-line" />

      <div className="header-main-bar">
        {/* Left Section: Sidebar Closer/Toggle, Divider, Role Badge & Search Bar */}
        <div className="header-left-section">
          {/* Sidebar Toggle/Closer Button */}
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

          {/* Role Pill Badge */}
          <div className="role-pill-container">
            <ShieldCheck size={13} className="role-shield-icon" />
            <span className="role-pill-label">{roleBadgeText}</span>
          </div>

          {/* Search Input Box */}
          <div className="header-search-container">
            <Input
              prefix={<Search size={14} className="search-prefix-icon" />}
              placeholder={searchPlaceholder}
              className="header-search-input"
              allowClear
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Right Section: Actions & User Profile */}
        <div className="header-right-section">
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
                <span className="notification-red-badge">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </div>
          </div>

          {/* User Profile Avatar with Green Border */}
          <div
            className="header-avatar-wrapper"
            onClick={onProfileClick}
            role="button"
            tabIndex={0}
            title="User Profile"
          >
            <div className="user-avatar-circle">
              <span className="user-avatar-initials">{userInitials}</span>
            </div>
          </div>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
