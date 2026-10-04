import React from 'react';
import {
  AppstoreOutlined,
  BankOutlined,
  TeamOutlined,
  LineChartOutlined,
  CreditCardOutlined,
  TagOutlined,
  FileTextOutlined,
  PercentageOutlined,
  DashboardOutlined,
  FlagOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import {
  SUPER_ADMIN,
  BILLING_ADMIN,
  CUSTOMER_SUCCESS_ADMIN,
  SUPPORT_ADMIN,
  PLATFORM_OPERATIONS_ADMIN,
  ORGANISATION_OWNER,
  ORGANISATION_ADMIN,
  PROJECT_MANAGER,
  ARCHITECT,
  DEVELOPER,
  VIEWER,
  Role,
} from './role';

export interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
  roles?: Role[];
  children?: MenuItem[];
}

export interface MenuSection {
  title: string;
  roles?: Role[];
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      {
        key: '/dashboard',
        label: 'Platform Dashboard',
        icon: <AppstoreOutlined />,
      },
    ],
  },
  {
    title: 'CUSTOMERS',
    items: [
      {
        key: '/customers/organisations',
        label: 'Organisations',
        icon: <BankOutlined />,
      },
      {
        key: '/customers/users',
        label: 'Users',
        icon: <TeamOutlined />,
      },
      {
        key: '/customers/activity',
        label: 'Customer Activity',
        icon: <LineChartOutlined />,
      },
    ],
  },
  {
    title: 'REVENUE',
    items: [
      {
        key: '/revenue/subscriptions',
        label: 'Subscriptions',
        icon: <CreditCardOutlined />,
      },
      {
        key: '/revenue/pricing',
        label: 'Plans & Pricing',
        icon: <TagOutlined />,
      },
      {
        key: '/revenue/invoices',
        label: 'Billing & Invoices',
        icon: <FileTextOutlined />,
      },
      {
        key: '/revenue/discounts',
        label: 'Coupons & Discounts',
        icon: <PercentageOutlined />,
      },
    ],
  },
  {
    title: 'PLATFORM',
    items: [
      {
        key: '/platform/usage',
        label: 'Usage & Utilisation',
        icon: <DashboardOutlined />,
      },
      {
        key: '/platform/features',
        label: 'Feature Management',
        icon: <FlagOutlined />,
      },
      {
        key: '/platform/environments',
        label: 'Environments',
        icon: <DatabaseOutlined />,
      },
    ],
  },
];
