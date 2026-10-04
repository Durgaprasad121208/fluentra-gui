import React, { useState } from 'react';
import { Layout, Tooltip } from 'antd';
import { DownOutlined, RightOutlined, SwapOutlined } from '@ant-design/icons';
import { menuSections, MenuItem } from '../../data/menuConfig';
import fluentraLogo from '../../assets/logo-COZPA0E_.svg';
import './Sidebar.css';

const { Sider } = Layout;

// Fluentra Logo
const FluentraLogo: React.FC = () => (
  <img src={fluentraLogo} alt="Fluentra Logo" className="logo-network-svg" />
);

export interface SidebarProps {
  activeKey?: string;
  onSelectKey?: (key: string) => void;
  width?: number;
  collapsedWidth?: number;
  collapsed?: boolean;
  collapsible?: boolean;
  userRole?: string;
  onSwitchPortal?: () => void;
  portalSwitchLabel?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeKey = '/dashboard',
  onSelectKey,
  width = 240,
  collapsedWidth = 72,
  collapsed = false,
  collapsible = true,
  userRole = 'SUPER ADMIN',
  onSwitchPortal,
  portalSwitchLabel = 'Switch to Client Portal',
}) => {
  const isCollapsed = collapsed;
  const [selectedKey, setSelectedKey] = useState<string>(activeKey);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (activeKey) {
      setSelectedKey(activeKey);
    }
  }, [activeKey]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    if (onSelectKey) {
      onSelectKey(key);
    }
  };

  const toggleSubmenu = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = !!openSubmenus[item.key];
    const isActive = selectedKey === item.key;
    const labelText = typeof item.label === 'string' ? item.label : item.key;

    const itemContent = (
      <div
        key={item.key}
        className={`sider-menu-item ${isActive ? 'active' : ''} ${isChild ? 'child-item' : ''}`}
        onClick={() => {
          if (hasChildren) {
            setOpenSubmenus((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
          } else {
            handleSelect(item.key);
          }
        }}
      >
        <div className="sider-item-left">
          {item.icon && <span className="sider-item-icon">{item.icon}</span>}
          {!isCollapsed && <span className="sider-item-label">{item.label}</span>}
        </div>
        {item.badge !== undefined && <span className="sider-badge">{item.badge}</span>}
        {!isCollapsed && hasChildren && (
          <span className="submenu-arrow" onClick={(e) => toggleSubmenu(item.key, e)}>
            {isOpen ? <DownOutlined /> : <RightOutlined />}
          </span>
        )}
      </div>
    );

    const wrappedItem = isCollapsed ? (
      <Tooltip key={item.key} title={labelText} placement="right">
        {itemContent}
      </Tooltip>
    ) : (
      itemContent
    );

    if (hasChildren && !isCollapsed && isOpen) {
      return (
        <div key={item.key} className="sider-submenu-group">
          {wrappedItem}
          <div className="sider-submenu-children">
            {item.children?.map((child) => renderItem(child, true))}
          </div>
        </div>
      );
    }

    return wrappedItem;
  };

  return (
    <Sider
      width={width}
      collapsedWidth={collapsedWidth}
      collapsible={collapsible}
      collapsed={isCollapsed}
      trigger={null}
      className="app-sider"
    >
      {/* Brand Header */}
      <div className="sider-logo-container">
        <div className="sider-logo-left">
          <div className="logo-icon-box">
            <FluentraLogo />
          </div>
          {!isCollapsed && (
            <div className="logo-text-box">
              <span className="logo-title">FLUENTRALABS</span>
              <span className="logo-subtitle">{userRole}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="sider-menu-container">
        {menuSections.map((section) => {
          const visibleItems = section.items;
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="sider-menu-section">
              {!isCollapsed && (
                <div className="sider-section-title">{section.title}</div>
              )}
              {visibleItems.map((item) => renderItem(item))}
            </div>
          );
        })}
      </div>

      {/* Bottom Switch Portal Button */}
      <div className="sider-footer-container">
        <button
          type="button"
          className="switch-portal-btn"
          onClick={onSwitchPortal}
          title={isCollapsed ? portalSwitchLabel : undefined}
        >
          <SwapOutlined className="switch-portal-icon" />
          {!isCollapsed && <span>{portalSwitchLabel}</span>}
        </button>
      </div>
    </Sider>
  );
};

export default Sidebar;
