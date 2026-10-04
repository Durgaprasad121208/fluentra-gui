import React from 'react';
import { Layout, Input, Button, Avatar, Badge } from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  PlusOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { ShieldCheck } from 'lucide-react';
import './Header.css';

const { Header: AntHeader } = Layout;

export interface HeaderProps {
  roleBadgeText?: string;
  searchPlaceholder?: string;
  dateRangeLabel?: string;
  userInitials?: string;
  notificationCount?: number;
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
  onSearch,
  onDateRangeClick,
  onQuickActionsClick,
  onNotificationsClick,
  onProfileClick,
}) => {
  return (
    <AntHeader className="app-header">
      {/* Top Accent Line */}
      <div className="header-top-accent" />

      <div className="header-content">
        {/* Left Section */}
        <div className="header-left">
          {/* Role Pill Badge */}
          <div className="role-pill-badge">
            <ShieldCheck size={14} className="shield-icon" />
            <span className="role-pill-text">{roleBadgeText}</span>
          </div>

          {/* Search Input */}
          <div className="search-wrapper">
            <Input
              prefix={<SearchOutlined className="search-icon" />}
              placeholder={searchPlaceholder}
              className="search-input"
              allowClear
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          {/* Date Range Selector */}
          <Button
            className="date-range-btn"
            icon={<CalendarOutlined className="btn-icon" />}
            onClick={onDateRangeClick}
          >
            {dateRangeLabel}
          </Button>

          {/* Quick Actions Button */}
          <Button
            type="primary"
            className="quick-actions-btn"
            icon={<PlusOutlined className="btn-icon" />}
            onClick={onQuickActionsClick}
          >
            Quick actions
          </Button>

          {/* Notifications Bell */}
          <div className="notification-wrapper" onClick={onNotificationsClick}>
            <Badge
              count={notificationCount}
              size="small"
              className="notification-badge"
            >
              <Button
                type="text"
                shape="circle"
                className="bell-btn"
                icon={<BellOutlined className="bell-icon" />}
              />
            </Badge>
          </div>

          {/* User Profile Avatar */}
          <div className="profile-wrapper" onClick={onProfileClick}>
            <Avatar size={34} className="profile-avatar">
              {userInitials}
            </Avatar>
          </div>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
