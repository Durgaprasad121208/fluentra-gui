import React, { useState } from 'react';
import {
    Card,
    Table,
    Tag,
    Form,
    Input,
    Select,
    Drawer,
    Alert,
    Segmented,
    Popconfirm,
    notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    Plus,
    Info,
    Check,
    History,
    Eye,
    Pencil,
} from 'lucide-react';
import { SubmitButton, CancelButton } from '../../components/custombutton/CustomButton';
import './AdminUsers.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type AdminRole =
    | 'Super Admin'
    | 'Billing Admin'
    | 'Customer Success Admin'
    | 'Support Admin'
    | 'Platform Operations Admin';

export type AdminStatus = 'Active' | 'Inactive';
export type MfaStatus = 'Enabled' | 'Not set up';

export interface AdminUserItem {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    status: AdminStatus;
    mfa: MfaStatus;
    lastActive: string;
}

export interface PermissionMatrixItem {
    id: string;
    permission: string;
    superAdmin: boolean;
    billingAdmin: boolean;
    customerSuccessAdmin: boolean;
    supportAdmin: boolean;
    platformOpsAdmin: boolean;
}

type AdminTab = 'administrators' | 'permissions';

// ---------------------------------------------------------------------------
// INITIAL DATASETS (Matches Mockup Screenshots 1 & 2)
// ---------------------------------------------------------------------------
const INITIAL_ADMINS: AdminUserItem[] = [
    {
        id: 'admin-1',
        name: 'Pavan Kumar',
        email: 'pavan@fluentralabs.com',
        role: 'Super Admin',
        status: 'Active',
        mfa: 'Enabled',
        lastActive: 'Today, 09:02',
    },
    {
        id: 'admin-2',
        name: 'Marcus Hale',
        email: 'marcus@fluentralabs.com',
        role: 'Billing Admin',
        status: 'Active',
        mfa: 'Enabled',
        lastActive: 'Yesterday',
    },
    {
        id: 'admin-3',
        name: 'Priya Nair',
        email: 'priya@fluentralabs.com',
        role: 'Customer Success Admin',
        status: 'Active',
        mfa: 'Enabled',
        lastActive: '2 days ago',
    },
    {
        id: 'admin-4',
        name: 'Leah Okafor',
        email: 'leah@fluentralabs.com',
        role: 'Support Admin',
        status: 'Active',
        mfa: 'Enabled',
        lastActive: 'Today, 08:47',
    },
    {
        id: 'admin-5',
        name: 'Tomás Reyes',
        email: 'tomas@fluentralabs.com',
        role: 'Platform Operations Admin',
        status: 'Active',
        mfa: 'Not set up',
        lastActive: '4 days ago',
    },
];

const PERMISSIONS_DATA: PermissionMatrixItem[] = [
    {
        id: 'perm-1',
        permission: 'Manage organisations',
        superAdmin: true,
        billingAdmin: false,
        customerSuccessAdmin: true,
        supportAdmin: false,
        platformOpsAdmin: false,
    },
    {
        id: 'perm-2',
        permission: 'Billing & invoices',
        superAdmin: true,
        billingAdmin: true,
        customerSuccessAdmin: false,
        supportAdmin: false,
        platformOpsAdmin: false,
    },
    {
        id: 'perm-3',
        permission: 'Plans & coupons',
        superAdmin: true,
        billingAdmin: true,
        customerSuccessAdmin: false,
        supportAdmin: false,
        platformOpsAdmin: false,
    },
    {
        id: 'perm-4',
        permission: 'Feature management',
        superAdmin: true,
        billingAdmin: false,
        customerSuccessAdmin: true,
        supportAdmin: false,
        platformOpsAdmin: true,
    },
    {
        id: 'perm-5',
        permission: 'Support sessions',
        superAdmin: true,
        billingAdmin: false,
        customerSuccessAdmin: false,
        supportAdmin: true,
        platformOpsAdmin: false,
    },
    {
        id: 'perm-6',
        permission: 'Platform health',
        superAdmin: true,
        billingAdmin: false,
        customerSuccessAdmin: false,
        supportAdmin: false,
        platformOpsAdmin: true,
    },
    {
        id: 'perm-7',
        permission: 'Platform settings',
        superAdmin: true,
        billingAdmin: false,
        customerSuccessAdmin: false,
        supportAdmin: false,
        platformOpsAdmin: true,
    },
    {
        id: 'perm-8',
        permission: 'Manage admins',
        superAdmin: true,
        billingAdmin: false,
        customerSuccessAdmin: false,
        supportAdmin: false,
        platformOpsAdmin: false,
    },
    {
        id: 'perm-9',
        permission: 'View audit logs',
        superAdmin: true,
        billingAdmin: true,
        customerSuccessAdmin: true,
        supportAdmin: true,
        platformOpsAdmin: true,
    },
];

// Dynamic capabilities text helper based on role
const getRoleCanText = (role: AdminRole): string => {
    switch (role) {
        case 'Super Admin':
            return 'Manage organisations, Billing & invoices, Plans & coupons, Feature management, Support sessions, Platform health, Platform settings, Manage admins, View audit logs.';
        case 'Billing Admin':
            return 'Billing & invoices, Plans & coupons, View audit logs.';
        case 'Customer Success Admin':
            return 'Manage organisations, Feature management, View audit logs.';
        case 'Support Admin':
            return 'Support sessions, View audit logs.';
        case 'Platform Operations Admin':
            return 'Feature management, Platform health, Platform settings, View audit logs.';
        default:
            return '';
    }
};

export const AdminUsers: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('administrators');
    const [admins, setAdmins] = useState<AdminUserItem[]>(INITIAL_ADMINS);

    // Drawer states
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState<boolean>(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
    const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState<boolean>(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUserItem | null>(null);

    // Add Admin Selected Role for dynamic subtext
    const [addSelectedRole, setAddSelectedRole] = useState<AdminRole>('Support Admin');

    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Toggle Deactivate / Activate
    const handleToggleStatus = (admin: AdminUserItem) => {
        const nextStatus: AdminStatus = admin.status === 'Active' ? 'Inactive' : 'Active';
        setAdmins((prev) =>
            prev.map((item) =>
                item.id === admin.id ? { ...item, status: nextStatus } : item
            )
        );
        notification.success({
            message: `Admin ${nextStatus === 'Active' ? 'Activated' : 'Deactivated'}`,
            description: `${admin.name} is now ${nextStatus.toLowerCase()}.`,
            placement: 'topRight',
        });
    };

    // Open Edit Role Drawer
    const handleOpenEditRole = (admin: AdminUserItem) => {
        setSelectedAdmin(admin);
        editForm.setFieldsValue({ role: admin.role });
        setIsEditDrawerOpen(true);
    };

    // Save Edited Role
    const handleSaveRole = (values: { role: AdminRole }) => {
        if (!selectedAdmin) return;
        setAdmins((prev) =>
            prev.map((item) =>
                item.id === selectedAdmin.id ? { ...item, role: values.role } : item
            )
        );
        setIsEditDrawerOpen(false);
        notification.success({
            message: 'Role Updated',
            description: `${selectedAdmin.name}'s role updated to ${values.role}.`,
            placement: 'topRight',
        });
    };

    // Open Activity Drawer
    const handleOpenActivity = (admin: AdminUserItem) => {
        setSelectedAdmin(admin);
        setIsActivityDrawerOpen(true);
    };

    // Add New Admin
    const handleAddAdmin = (values: { name: string; email: string; role: AdminRole }) => {
        const newAdmin: AdminUserItem = {
            id: `admin-${Date.now()}`,
            name: values.name,
            email: values.email,
            role: values.role,
            status: 'Active',
            mfa: 'Not set up',
            lastActive: 'Just now',
        };
        setAdmins((prev) => [newAdmin, ...prev]);
        setIsAddDrawerOpen(false);
        addForm.resetFields();
        setAddSelectedRole('Support Admin');
        notification.success({
            message: 'Admin Invited',
            description: `Invitation successfully sent to ${values.email}.`,
            placement: 'topRight',
        });
    };

    // Table Columns: Administrators Tab
    const adminColumns: ColumnsType<AdminUserItem> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 260,
            render: (name: string, record: AdminUserItem) => (
                <div className="admin-name-cell">
                    <span className="admin-primary-name">{name}</span>
                    <span className="admin-email-text">{record.email}</span>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 240,
            render: (role: AdminRole) => (
                <span className="admin-role-text">{role}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: AdminStatus) => {
                if (status === 'Active') {
                    return (
                        <Tag className="admin-status-tag status-active">
                            ● Active
                        </Tag>
                    );
                }
                return (
                    <Tag className="admin-status-tag status-inactive">
                        ● Inactive
                    </Tag>
                );
            },
        },
        {
            title: 'MFA',
            dataIndex: 'mfa',
            key: 'mfa',
            width: 140,
            render: (mfa: MfaStatus) => {
                if (mfa === 'Enabled') {
                    return (
                        <Tag className="admin-mfa-tag mfa-enabled">
                            ● Enabled
                        </Tag>
                    );
                }
                return (
                    <Tag className="admin-mfa-tag mfa-not-setup">
                        ● Not set up
                    </Tag>
                );
            },
        },
        {
            title: 'Last active',
            dataIndex: 'lastActive',
            key: 'lastActive',
            width: 160,
            render: (lastActive: string) => (
                <span className="admin-last-active-text">{lastActive}</span>
            ),
        },
        {
            title: '',
            key: 'actions',
            align: 'right',
            render: (_, record: AdminUserItem) => (
                <div className="admin-actions-cell">
                    <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleOpenActivity(record)}
                        title="View activity"
                    >
                        <Eye size={14} className="admin-btn-icon" />
                    </button>
                    <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleOpenEditRole(record)}
                        title="Edit role"
                    >
                        <Pencil size={13} className="admin-btn-icon" />
                    </button>
                    {record.status === 'Active' ? (
                        <Popconfirm
                            title="Deactivate Administrator"
                            description={`Are you sure you want to deactivate ${record.name}?`}
                            onConfirm={() => handleToggleStatus(record)}
                            okText="Deactivate"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                            placement="topRight"
                        >
                            <button
                                type="button"
                                className="admin-action-btn action-deactivate"
                            >
                                Deactivate
                            </button>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title="Activate Administrator"
                            description={`Are you sure you want to activate ${record.name}?`}
                            onConfirm={() => handleToggleStatus(record)}
                            okText="Activate"
                            cancelText="Cancel"
                            placement="topRight"
                        >
                            <button
                                type="button"
                                className="admin-action-btn action-activate"
                            >
                                Activate
                            </button>
                        </Popconfirm>
                    )}
                </div>
            ),
        },
    ];

    // Table Columns: Permissions By Role Tab
    const permissionColumns: ColumnsType<PermissionMatrixItem> = [
        {
            title: 'Permission',
            dataIndex: 'permission',
            key: 'permission',
            width: 240,
            render: (text: string) => (
                <span className="permission-name-text">{text}</span>
            ),
        },
        {
            title: 'Super Admin',
            dataIndex: 'superAdmin',
            key: 'superAdmin',
            align: 'center',
            render: (hasPerm: boolean) => (
                hasPerm ? <Check size={16} className="perm-check-icon" /> : <span className="perm-dash">—</span>
            ),
        },
        {
            title: 'Billing Admin',
            dataIndex: 'billingAdmin',
            key: 'billingAdmin',
            align: 'center',
            render: (hasPerm: boolean) => (
                hasPerm ? <Check size={16} className="perm-check-icon" /> : <span className="perm-dash">—</span>
            ),
        },
        {
            title: 'Customer Success Admin',
            dataIndex: 'customerSuccessAdmin',
            key: 'customerSuccessAdmin',
            align: 'center',
            render: (hasPerm: boolean) => (
                hasPerm ? <Check size={16} className="perm-check-icon" /> : <span className="perm-dash">—</span>
            ),
        },
        {
            title: 'Support Admin',
            dataIndex: 'supportAdmin',
            key: 'supportAdmin',
            align: 'center',
            render: (hasPerm: boolean) => (
                hasPerm ? <Check size={16} className="perm-check-icon" /> : <span className="perm-dash">—</span>
            ),
        },
        {
            title: 'Platform Operations Admin',
            dataIndex: 'platformOpsAdmin',
            key: 'platformOpsAdmin',
            align: 'center',
            render: (hasPerm: boolean) => (
                hasPerm ? <Check size={16} className="perm-check-icon" /> : <span className="perm-dash">—</span>
            ),
        },
    ];

    return (
        <div className="admin-users-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH ADD ADMIN BUTTON
         ------------------------------------------------------------------- */}
            <div className="admin-header-row">
                <div className="admin-title-group">
                    <h1 className="admin-main-heading">
                        Admin Users
                    </h1>
                    <span className="admin-subtitle">
                        Internal FluentraLabs administrators and what each role can do.
                    </span>
                </div>

                <SubmitButton
                    icon={<Plus size={15} style={{ marginRight: 4 }} />}
                    onClick={() => {
                        addForm.resetFields();
                        setAddSelectedRole('Support Admin');
                        addForm.setFieldsValue({ role: 'Support Admin' });
                        setIsAddDrawerOpen(true);
                    }}
                >
                    Add admin
                </SubmitButton>
            </div>

            {/* Demonstration Alert Banner */}
            <Alert
                message={
                    <span style={{ fontSize: 12 }}>
                        <strong>Demonstration data.</strong> Nothing here reflects real systems; actions only change this prototype's local state.
                    </span>
                }
                type="info"
                showIcon
                icon={<Info size={15} />}
                className="admin-demo-alert"
            />

            {/* Compact Segmented Toggle above Table */}
            <div className="admin-filter-toolbar">
                <Segmented<AdminTab>
                    size="small"
                    value={activeTab}
                    onChange={(val) => setActiveTab(val)}
                    options={[
                        { label: 'Administrators', value: 'administrators' },
                        { label: 'Permissions by role', value: 'permissions' },
                    ]}
                    className="admin-segmented-toggle"
                />
            </div>

            {/* -------------------------------------------------------------------
          TAB 1: ADMINISTRATORS TABLE
         ------------------------------------------------------------------- */}
            {activeTab === 'administrators' && (
                <Card className="admin-table-card" styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={adminColumns}
                        dataSource={admins}
                        rowKey="id"
                        pagination={false}
                        className="admin-table"
                    />
                </Card>
            )}

            {/* -------------------------------------------------------------------
          TAB 2: PERMISSIONS BY ROLE TABLE
         ------------------------------------------------------------------- */}
            {activeTab === 'permissions' && (
                <Card className="admin-table-card" styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={permissionColumns}
                        dataSource={PERMISSIONS_DATA}
                        rowKey="id"
                        pagination={false}
                        className="admin-table permissions-matrix-table"
                    />
                </Card>
            )}

            {/* -------------------------------------------------------------------
          DRAWER: ADD ADMINISTRATOR (Matches User Screenshot)
         ------------------------------------------------------------------- */}
            <Drawer
                title="Add administrator"
                open={isAddDrawerOpen}
                onClose={() => setIsAddDrawerOpen(false)}
                width={420}
                className="admin-drawer"
                footer={
                    <div className="admin-drawer-footer">
                        <button
                            type="button"
                            className="admin-drawer-cancel-btn"
                            onClick={() => setIsAddDrawerOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="admin-drawer-submit-btn"
                            onClick={() => addForm.submit()}
                        >
                            Send invitation
                        </button>
                    </div>
                }
            >
                <Form
                    form={addForm}
                    layout="vertical"
                    onFinish={handleAddAdmin}
                    initialValues={{ role: 'Support Admin' }}
                    className="admin-drawer-form"
                >
                    <Form.Item
                        name="name"
                        label="Full name"
                        rules={[{ required: true, message: 'Please enter administrator name' }]}
                    >
                        <Input className="admin-drawer-input" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Work email"
                        rules={[
                            { required: true, message: 'Please enter work email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input placeholder="name@fluentralabs.com" className="admin-drawer-input" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select
                            className="admin-drawer-select"
                            value={addSelectedRole}
                            onChange={(val) => setAddSelectedRole(val)}
                            options={[
                                { label: 'Super Admin', value: 'Super Admin' },
                                { label: 'Billing Admin', value: 'Billing Admin' },
                                { label: 'Customer Success Admin', value: 'Customer Success Admin' },
                                { label: 'Support Admin', value: 'Support Admin' },
                                { label: 'Platform Operations Admin', value: 'Platform Operations Admin' },
                            ]}
                        />
                    </Form.Item>

                    <div className="admin-role-can-caption">
                        Can: {getRoleCanText(addSelectedRole)}
                    </div>
                </Form>
            </Drawer>

            {/* -------------------------------------------------------------------
          DRAWER: EDIT ROLE
         ------------------------------------------------------------------- */}
            <Drawer
                title={`Edit role: ${selectedAdmin?.name || ''}`}
                open={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                width={420}
                className="admin-drawer"
                footer={
                    <div className="admin-drawer-footer">
                        <button
                            type="button"
                            className="admin-drawer-cancel-btn"
                            onClick={() => setIsEditDrawerOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="admin-drawer-submit-btn"
                            onClick={() => editForm.submit()}
                        >
                            Save changes
                        </button>
                    </div>
                }
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleSaveRole}
                    className="admin-drawer-form"
                >
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select
                            className="admin-drawer-select"
                            options={[
                                { label: 'Super Admin', value: 'Super Admin' },
                                { label: 'Billing Admin', value: 'Billing Admin' },
                                { label: 'Customer Success Admin', value: 'Customer Success Admin' },
                                { label: 'Support Admin', value: 'Support Admin' },
                                { label: 'Platform Operations Admin', value: 'Platform Operations Admin' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Drawer>

            {/* -------------------------------------------------------------------
          DRAWER: ACTIVITY AUDIT LOG
         ------------------------------------------------------------------- */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <History size={18} />
                        <span>Recent Activity: {selectedAdmin?.name}</span>
                    </div>
                }
                placement="right"
                width={440}
                onClose={() => setIsActivityDrawerOpen(false)}
                open={isActivityDrawerOpen}
                className="admin-drawer"
                footer={
                    <div className="admin-drawer-footer">
                        <button
                            type="button"
                            className="admin-drawer-cancel-btn"
                            onClick={() => setIsActivityDrawerOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                }
            >
                {selectedAdmin && (
                    <div className="admin-drawer-content">
                        <div className="admin-drawer-profile-card">
                            <div className="admin-drawer-avatar">
                                {selectedAdmin.name.charAt(0)}
                            </div>
                            <div className="admin-drawer-meta">
                                <span className="admin-drawer-name">{selectedAdmin.name}</span>
                                <span className="admin-drawer-email">{selectedAdmin.email}</span>
                                <Tag className="admin-status-tag status-active" style={{ marginTop: 4 }}>
                                    {selectedAdmin.role}
                                </Tag>
                            </div>
                        </div>

                        <h3 className="admin-drawer-section-title">Session & Actions History</h3>

                        <div className="admin-activity-timeline">
                            <div className="admin-activity-item">
                                <div className="activity-dot" />
                                <div className="activity-body">
                                    <span className="activity-title">Logged in via SSO (MFA Verified)</span>
                                    <span className="activity-time">Today at 09:02 AM · IP 198.51.100.24</span>
                                </div>
                            </div>
                            <div className="admin-activity-item">
                                <div className="activity-dot" />
                                <div className="activity-body">
                                    <span className="activity-title">Updated platform security policies</span>
                                    <span className="activity-time">Yesterday at 04:15 PM · Admin Portal</span>
                                </div>
                            </div>
                            <div className="admin-activity-item">
                                <div className="activity-dot" />
                                <div className="activity-body">
                                    <span className="activity-title">Approved support session for Acme Corp</span>
                                    <span className="activity-time">3 days ago at 11:30 AM · Governance</span>
                                </div>
                            </div>
                            <div className="admin-activity-item">
                                <div className="activity-dot" />
                                <div className="activity-body">
                                    <span className="activity-title">Updated feature flag 'AI Copilot' to GA</span>
                                    <span className="activity-time">5 days ago · Feature Management</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default AdminUsers;
