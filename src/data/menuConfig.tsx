import React from 'react';
import {
  // Client Portal Icons
  LayoutGrid,
  FolderKanban,
  FileText,
  ListTodo,
  Sparkles,
  Boxes,
  AppWindow,
  CirclePlay,
  Rocket,
  ScrollText,
  GitBranch,
  ShieldCheck,
  Settings,
  // Control Plane Icons
  LayoutDashboard,
  Building2,
  Users,
  Activity,
  CreditCard,
  Tag,
  Receipt,
  Percent,
  Gauge,
  Flag,
  Server,
  HeartPulse,
  LifeBuoy,
  Sliders,
  UserCog,
  Bell,
  SlidersHorizontal,
  Database,
} from 'lucide-react';
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

const ICON_SIZE = 16;

// ============================================================================
// CLIENT PORTAL MENU CONFIGURATION (Workspace, Engineering, Runtime, Governance, Admin)
// ============================================================================
export const clientPortalMenuSections: MenuSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      {
        key: '/workspace/overview',
        label: 'Overview',
        icon: <LayoutGrid size={ICON_SIZE} />,
      },
      {
        key: '/workspace/projects',
        label: 'Projects',
        icon: <FolderKanban size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'ENGINEERING',
    items: [
      {
        key: '/engineering/requirements',
        label: 'Requirements',
        icon: <FileText size={ICON_SIZE} />,
      },
      {
        key: '/engineering/development-plan',
        label: 'Development Plan',
        icon: <ListTodo size={ICON_SIZE} />,
      },
      {
        key: '/engineering/co-architect',
        label: 'Co-Architect',
        icon: <Sparkles size={ICON_SIZE} />,
      },
      {
        key: '/engineering/architecture',
        label: 'Architecture',
        icon: <Boxes size={ICON_SIZE} />,
      },
      {
        key: '/engineering/frontend-studio',
        label: 'Frontend Studio',
        icon: <AppWindow size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'RUNTIME',
    items: [
      {
        key: '/runtime/executions',
        label: 'Executions',
        icon: <CirclePlay size={ICON_SIZE} />,
      },
      {
        key: '/runtime/deployments',
        label: 'Deployments',
        icon: <Rocket size={ICON_SIZE} />,
      },
      {
        key: '/runtime/logs',
        label: 'Logs',
        icon: <ScrollText size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      {
        key: '/governance/versions',
        label: 'Versions & Changes',
        icon: <GitBranch size={ICON_SIZE} />,
      },
      {
        key: '/governance/approvals',
        label: 'Approvals',
        icon: <ShieldCheck size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'ADMINISTRATION',
    items: [
      {
        key: '/administration/settings',
        label: 'Settings',
        icon: <Settings size={ICON_SIZE} />,
      },
    ],
  },
];

// ============================================================================
// CONTROL PLANE MENU CONFIGURATION (Super Admin & Platform Operations)
// ============================================================================
export const controlPlaneMenuSections: MenuSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      {
        key: '/dashboard',
        label: 'Platform Dashboard',
        icon: <LayoutDashboard size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'CUSTOMERS',
    items: [
      {
        key: '/customers/organisations',
        label: 'Organisations',
        icon: <Building2 size={ICON_SIZE} />,
      },
      {
        key: '/customers/users',
        label: 'Users',
        icon: <Users size={ICON_SIZE} />,
      },
      {
        key: '/customers/activity',
        label: 'Customer Activity',
        icon: <Activity size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'REVENUE',
    items: [
      {
        key: '/revenue/subscriptions',
        label: 'Subscriptions',
        icon: <CreditCard size={ICON_SIZE} />,
      },
      {
        key: '/revenue/pricing',
        label: 'Plans & Pricing',
        icon: <Tag size={ICON_SIZE} />,
      },
      {
        key: '/revenue/invoices',
        label: 'Billing & Invoices',
        icon: <Receipt size={ICON_SIZE} />,
      },
      {
        key: '/revenue/discounts',
        label: 'Coupons & Discounts',
        icon: <Percent size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'PLATFORM',
    items: [
      {
        key: '/platform/usage',
        label: 'Usage & Utilisation',
        icon: <Gauge size={ICON_SIZE} />,
      },
      {
        key: '/platform/features',
        label: 'Feature Management',
        icon: <Flag size={ICON_SIZE} />,
      },
      {
        key: '/platform/environments',
        label: 'Environments',
        icon: <Server size={ICON_SIZE} />,
      },
      {
        key: '/platform/health',
        label: 'Platform Health',
        icon: <HeartPulse size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      {
        key: '/governance/support-access',
        label: 'Support & Access',
        icon: <LifeBuoy size={ICON_SIZE} />,
      },
      {
        key: '/governance/audit-logs',
        label: 'Audit Logs',
        icon: <ScrollText size={ICON_SIZE} />,
      },
      {
        key: '/governance/security-policies',
        label: 'Security & Policies',
        icon: <ShieldCheck size={ICON_SIZE} />,
      },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      {
        key: '/settings/platform',
        label: 'Platform Settings',
        icon: <Sliders size={ICON_SIZE} />,
      },
      {
        key: '/settings/admin-users',
        label: 'Admin Users',
        icon: <UserCog size={ICON_SIZE} />,
      },
      {
        key: '/settings/notifications',
        label: 'Notifications',
        icon: <Bell size={ICON_SIZE} />,
      },
    ],
  },
];

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

/**
 * Returns the relevant menu sections according to the active user role.
 */
export const getMenuSectionsForRole = (role?: string): MenuSection[] => {
  if (!role) return clientPortalMenuSections;
  const normalized = role.toLowerCase();
  const isControlPlane = CONTROL_PLANE_ROLES.some((r) => normalized.includes(r));
  return isControlPlane ? controlPlaneMenuSections : clientPortalMenuSections;
};

// Default export for backward compatibility - Developer Client Portal
export const menuSections: MenuSection[] = clientPortalMenuSections;
