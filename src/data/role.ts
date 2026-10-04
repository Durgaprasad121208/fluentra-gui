export const SUPER_ADMIN = 'Super Admin';
export const BILLING_ADMIN = 'Billing Admin';
export const CUSTOMER_SUCCESS_ADMIN = 'Customer Success Admin';
export const SUPPORT_ADMIN = 'Support Admin';
export const PLATFORM_OPERATIONS_ADMIN = 'Platform Operations Admin';
export const ORGANISATION_OWNER = 'Organisation Owner';
export const ORGANISATION_ADMIN = 'Organisation Admin';
export const PROJECT_MANAGER = 'Project Manager';
export const ARCHITECT = 'Architect';
export const DEVELOPER = 'Developer';
export const VIEWER = 'Viewer';

export type Role =
  | typeof SUPER_ADMIN
  | typeof BILLING_ADMIN
  | typeof CUSTOMER_SUCCESS_ADMIN
  | typeof SUPPORT_ADMIN
  | typeof PLATFORM_OPERATIONS_ADMIN
  | typeof ORGANISATION_OWNER
  | typeof ORGANISATION_ADMIN
  | typeof PROJECT_MANAGER
  | typeof ARCHITECT
  | typeof DEVELOPER
  | typeof VIEWER;
