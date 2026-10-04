import { ThemeConfig, theme } from 'antd';

/**
 * Centralized Color Tokens & Ant Design Theme Configurations
 * Modifying values here or in global.css updates colors across the entire app.
 */
export const colorTokens = {
  // Primary Brand Theme Palette
  primary: '#22c55e',
  primaryHover: '#16a34a',
  primaryActive: '#15803d',
  primaryLight: '#f0fdf4',
  primaryDark: '#14532d',

  // Status & Utility Colors
  info: '#0284c7',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  avatarBg: '#0f172a',

  // Dark Theme Specific Tokens
  dark: {
    bgBase: '#04080c',
    bgContainer: '#0d171f',
    bgHeader: '#04080c',
    bgSidebar: '#04080c',
    bgSidebarActive: '#1a2630',
    bgCard: '#0d171f',
    bgElevated: '#1a2630',
    border: 'rgba(255, 255, 255, 0.08)',
    borderSecondary: 'rgba(255, 255, 255, 0.15)',
    textPrimary: '#f8fafc',
    textHeading: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#5a6e85',
    textDisabled: '#3e4f61',
  },

  // Light Theme Specific Tokens (Matches Light Mode Screenshot)
  light: {
    bgBase: '#f8fafc',
    bgContainer: '#ffffff',
    bgHeader: '#ffffff',
    bgSidebar: '#ffffff',
    bgSidebarActive: '#ecfdf5',
    bgCard: '#ffffff',
    bgElevated: '#ffffff',
    border: '#e2e8f0',
    borderSecondary: '#cbd5e1',
    textPrimary: '#0f172a',
    textHeading: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    textDisabled: '#cbd5e1',
  },
};

export const darkThemeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: colorTokens.primary,
    colorInfo: colorTokens.info,
    colorSuccess: colorTokens.success,
    colorWarning: colorTokens.warning,
    colorError: colorTokens.error,
    colorBgBase: colorTokens.dark.bgBase,
    colorBgContainer: colorTokens.dark.bgContainer,
    colorBgElevated: colorTokens.dark.bgElevated,
    colorBgLayout: colorTokens.dark.bgBase,
    colorBorder: colorTokens.dark.border,
    colorBorderSecondary: colorTokens.dark.borderSecondary,
    colorText: colorTokens.dark.textPrimary,
    colorTextHeading: colorTokens.dark.textHeading,
    colorTextSecondary: colorTokens.dark.textSecondary,
    colorTextDescription: colorTokens.dark.textMuted,
    colorTextDisabled: colorTokens.dark.textDisabled,
    borderRadius: 8,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  },
  components: {
    Layout: {
      headerBg: colorTokens.dark.bgHeader,
      bodyBg: colorTokens.dark.bgBase,
      siderBg: colorTokens.dark.bgSidebar,
    },
    Button: {
      borderRadius: 8,
    },
    Input: {
      colorBgContainer: colorTokens.dark.bgContainer,
      colorBorder: colorTokens.dark.border,
      activeBorderColor: colorTokens.primary,
      hoverBorderColor: colorTokens.primaryHover,
    },
    Card: {
      colorBgContainer: colorTokens.dark.bgCard,
      colorBorderSecondary: colorTokens.dark.border,
    },
    Table: {
      colorBgContainer: colorTokens.dark.bgContainer,
      headerBg: colorTokens.dark.bgSidebarActive,
      rowHoverBg: colorTokens.dark.bgElevated,
      colorBorderSecondary: colorTokens.dark.border,
    },
    Dropdown: {
      colorBgElevated: colorTokens.dark.bgElevated,
    },
    Modal: {
      colorBgElevated: colorTokens.dark.bgContainer,
    },
  },
};

export const lightThemeConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: colorTokens.primary,
    colorInfo: colorTokens.info,
    colorSuccess: colorTokens.success,
    colorWarning: colorTokens.warning,
    colorError: colorTokens.error,
    colorBgBase: colorTokens.light.bgBase,
    colorBgContainer: colorTokens.light.bgContainer,
    colorBgElevated: colorTokens.light.bgElevated,
    colorBgLayout: colorTokens.light.bgBase,
    colorBorder: colorTokens.light.border,
    colorBorderSecondary: colorTokens.light.borderSecondary,
    colorText: colorTokens.light.textPrimary,
    colorTextHeading: colorTokens.light.textHeading,
    colorTextSecondary: colorTokens.light.textSecondary,
    colorTextDescription: colorTokens.light.textMuted,
    colorTextDisabled: colorTokens.light.textDisabled,
    borderRadius: 8,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  },
  components: {
    Layout: {
      headerBg: colorTokens.light.bgHeader,
      bodyBg: colorTokens.light.bgBase,
      siderBg: colorTokens.light.bgSidebar,
    },
    Button: {
      borderRadius: 8,
    },
    Input: {
      colorBgContainer: colorTokens.light.bgContainer,
      colorBorder: colorTokens.light.border,
      activeBorderColor: colorTokens.primary,
      hoverBorderColor: colorTokens.primaryHover,
    },
    Card: {
      colorBgContainer: colorTokens.light.bgCard,
      colorBorderSecondary: colorTokens.light.border,
    },
    Table: {
      colorBgContainer: colorTokens.light.bgContainer,
      headerBg: '#f8fafc',
      rowHoverBg: '#f1f5f9',
      colorBorderSecondary: colorTokens.light.border,
    },
    Dropdown: {
      colorBgElevated: colorTokens.light.bgElevated,
    },
    Modal: {
      colorBgElevated: colorTokens.light.bgContainer,
    },
  },
};

export default darkThemeConfig;
