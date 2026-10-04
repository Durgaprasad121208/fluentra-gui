import React, { useState, useMemo } from 'react';
import {
    Card,
    Table,
    Pagination,
    Input,
    Tag,
    Progress,
    Alert,
    Drawer,
    Select,
    Dropdown,
    notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    Plus,
    Search,
    Info,
    MoreHorizontal,
    Building2,
    Trash2,
    Edit,
    Eye,
    Ban,
} from 'lucide-react';
import { SubmitButton, CancelButton } from '../../components/custombutton/CustomButton';
import './Organisation.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type OrgPlan = 'Professional' | 'Enterprise' | 'Starter' | 'Free Trial';
export type OrgStatus = 'Active' | 'Trial' | 'Past due' | 'Cancelled' | 'Suspended';

export interface OrganisationItem {
    id: string;
    name: string;
    adminName: string;
    adminEmail: string;
    plan: OrgPlan;
    users: number;
    projects: number;
    monthlyUsage: number;
    status: OrgStatus;
    created: string;
    phone?: string;
    website?: string;
    industry?: string;
    country?: string;
    city?: string;
}

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASET (12 Prototype Tenants)
// ---------------------------------------------------------------------------
const INITIAL_ORGANISATIONS: OrganisationItem[] = [
    {
        id: 'ORG-001',
        name: 'Acme Corporation',
        adminName: 'Daniel Mercer',
        adminEmail: 'admin@acme.com',
        plan: 'Professional',
        users: 42,
        projects: 9,
        monthlyUsage: 88,
        status: 'Active',
        created: 'Mar 14, 2026',
        country: 'United States',
        city: 'San Francisco',
        industry: 'Technology',
    },
    {
        id: 'ORG-002',
        name: 'Northwind Health',
        adminName: 'Hannah Cole',
        adminEmail: 'h.cole@northwind.health',
        plan: 'Enterprise',
        users: 186,
        projects: 27,
        monthlyUsage: 78,
        status: 'Active',
        created: 'Jan 9, 2026',
        country: 'United States',
        city: 'Seattle',
        industry: 'Healthcare',
    },
    {
        id: 'ORG-003',
        name: 'Bluepeak Logistics',
        adminName: 'Jonas Weber',
        adminEmail: 'jonas@bluepeak.de',
        plan: 'Starter',
        users: 8,
        projects: 2,
        monthlyUsage: 46,
        status: 'Active',
        created: 'Oct 4, 2026',
        country: 'Germany',
        city: 'Hamburg',
        industry: 'Logistics',
    },
    {
        id: 'ORG-004',
        name: 'Helio Retail',
        adminName: 'Mei Tan',
        adminEmail: 'mei@helio.sg',
        plan: 'Free Trial',
        users: 3,
        projects: 1,
        monthlyUsage: 62,
        status: 'Trial',
        created: 'Oct 4, 2026',
        country: 'Singapore',
        city: 'Singapore',
        industry: 'Retail',
    },
    {
        id: 'ORG-005',
        name: 'Quanta Fintech',
        adminName: 'Ravi Menon',
        adminEmail: 'ravi@quanta.io',
        plan: 'Professional',
        users: 29,
        projects: 6,
        monthlyUsage: 71,
        status: 'Past due',
        created: 'May 21, 2026',
        country: 'United Kingdom',
        city: 'London',
        industry: 'Financial Services',
    },
    {
        id: 'ORG-006',
        name: 'Orchid Labs',
        adminName: 'Priya Sharma',
        adminEmail: 'priya@orchidlabs.in',
        plan: 'Professional',
        users: 14,
        projects: 4,
        monthlyUsage: 52,
        status: 'Active',
        created: 'Oct 3, 2026',
        country: 'India',
        city: 'Bengaluru',
        industry: 'Healthcare',
    },
    {
        id: 'ORG-007',
        name: 'Tidewater Energy',
        adminName: 'Ethan Hall',
        adminEmail: 'ethan@tidewater.com',
        plan: 'Free Trial',
        users: 4,
        projects: 1,
        monthlyUsage: 112,
        status: 'Trial',
        created: 'Oct 3, 2026',
        country: 'United States',
        city: 'Houston',
        industry: 'Energy',
    },
    {
        id: 'ORG-008',
        name: 'Atlas Freight',
        adminName: 'Pedro Ramos',
        adminEmail: 'pedro@atlasfreight.br',
        plan: 'Starter',
        users: 6,
        projects: 2,
        monthlyUsage: 0,
        status: 'Cancelled',
        created: 'Feb 18, 2026',
        country: 'Brazil',
        city: 'Sao Paulo',
        industry: 'Logistics',
    },
    {
        id: 'ORG-009',
        name: 'Fernwood Clinics',
        adminName: 'Liam O\'Connor',
        adminEmail: 'liam@fernwood.ie',
        plan: 'Free Trial',
        users: 2,
        projects: 1,
        monthlyUsage: 30,
        status: 'Trial',
        created: 'Sep 25, 2026',
        country: 'Ireland',
        city: 'Dublin',
        industry: 'Healthcare',
    },
    {
        id: 'ORG-010',
        name: 'Lumen Robotics',
        adminName: 'Elena Rostova',
        adminEmail: 'elena@lumenrobotics.io',
        plan: 'Starter',
        users: 12,
        projects: 3,
        monthlyUsage: 124,
        status: 'Active',
        created: 'Aug 12, 2026',
        country: 'Sweden',
        city: 'Stockholm',
        industry: 'Manufacturing',
    },
    {
        id: 'ORG-011',
        name: 'Apex Aerospace',
        adminName: 'Marcus Vance',
        adminEmail: 'marcus@apexaero.com',
        plan: 'Enterprise',
        users: 94,
        projects: 18,
        monthlyUsage: 84,
        status: 'Active',
        created: 'Dec 1, 2025',
        country: 'United States',
        city: 'Denver',
        industry: 'Manufacturing',
    },
    {
        id: 'ORG-012',
        name: 'Vertex Genomics',
        adminName: 'Dr. Sarah Jenkins',
        adminEmail: 's.jenkins@vertexgen.com',
        plan: 'Enterprise',
        users: 62,
        projects: 11,
        monthlyUsage: 15,
        status: 'Suspended',
        created: 'Apr 30, 2026',
        country: 'United Kingdom',
        city: 'Cambridge',
        industry: 'Healthcare',
    },
];

type FilterCategory =
    | 'All'
    | 'Active'
    | 'Trial'
    | 'Suspended'
    | 'Cancelled'
    | 'Enterprise'
    | 'Payment overdue';

export const Organisation: React.FC = () => {
    const [organisations, setOrganisations] = useState<OrganisationItem[]>(INITIAL_ORGANISATIONS);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Reset to page 1 whenever filter or search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilter]);

    const [formState, setFormState] = useState({
        name: '',
        adminName: '',
        adminEmail: '',
        phone: '',
        website: '',
        industry: '',
        plan: 'Free Trial' as OrgPlan,
        country: '',
        city: '',
    });

    // Calculate Filter Counts
    const counts = useMemo(() => {
        return {
            all: organisations.length,
            active: organisations.filter((o) => o.status === 'Active').length,
            trial: organisations.filter((o) => o.status === 'Trial').length,
            suspended: organisations.filter((o) => o.status === 'Suspended').length,
            cancelled: organisations.filter((o) => o.status === 'Cancelled').length,
            enterprise: organisations.filter((o) => o.plan === 'Enterprise').length,
            overdue: organisations.filter((o) => o.status === 'Past due').length,
        };
    }, [organisations]);

    // Filtered List based on Search & Pill Filter
    const filteredOrganisations = useMemo(() => {
        return organisations.filter((org) => {
            // 1. Search filter
            const matchesSearch =
                searchQuery.trim() === '' ||
                org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                org.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                org.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                org.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Pill tab filter
            if (activeFilter === 'Active') return org.status === 'Active';
            if (activeFilter === 'Trial') return org.status === 'Trial';
            if (activeFilter === 'Suspended') return org.status === 'Suspended';
            if (activeFilter === 'Cancelled') return org.status === 'Cancelled';
            if (activeFilter === 'Enterprise') return org.plan === 'Enterprise';
            if (activeFilter === 'Payment overdue') return org.status === 'Past due';

            return true;
        });
    }, [organisations, searchQuery, activeFilter]);

    // Paginated Data Slice for Table
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredOrganisations.slice(start, start + pageSize);
    }, [filteredOrganisations, currentPage, pageSize]);

    // Handle Create Organisation
    const handleCreate = () => {
        if (!formState.name.trim()) {
            notification.warning({
                message: 'Validation Error',
                description: 'Please provide an organisation name.',
            });
            return;
        }

        const newId = `ORG-${String(organisations.length + 1).padStart(3, '0')}`;
        const newOrg: OrganisationItem = {
            id: newId,
            name: formState.name,
            adminName: formState.adminName || 'Admin User',
            adminEmail: formState.adminEmail || `admin@${formState.name.toLowerCase().replace(/\s+/g, '')}.com`,
            plan: formState.plan,
            users: 1,
            projects: 0,
            monthlyUsage: 0,
            status: formState.plan === 'Free Trial' ? 'Trial' : 'Active',
            created: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            phone: formState.phone,
            website: formState.website,
            industry: formState.industry,
            country: formState.country,
            city: formState.city,
        };

        setOrganisations([newOrg, ...organisations]);
        setDrawerOpen(false);
        setFormState({
            name: '',
            adminName: '',
            adminEmail: '',
            phone: '',
            website: '',
            industry: '',
            plan: 'Free Trial',
            country: '',
            city: '',
        });

        notification.success({
            message: 'Organisation Created',
            description: `${newOrg.name} (${newOrg.id}) has been provisioned successfully.`,
        });
    };

    // Action Menu Handlers
    const handleAction = (action: string, record: OrganisationItem) => {
        if (action === 'delete') {
            setOrganisations(organisations.filter((o) => o.id !== record.id));
            notification.info({
                message: 'Organisation Removed',
                description: `${record.name} has been deleted.`,
            });
        } else if (action === 'suspend') {
            setOrganisations(
                organisations.map((o) =>
                    o.id === record.id
                        ? { ...o, status: o.status === 'Suspended' ? 'Active' : 'Suspended' }
                        : o
                )
            );
            notification.info({
                message: 'Status Updated',
                description: `${record.name} status updated.`,
            });
        } else {
            notification.info({
                message: action.toUpperCase(),
                description: `Action triggered for ${record.name} (${record.id})`,
            });
        }
    };

    // Ant Design Table Columns without sort arrows
    const columns: ColumnsType<OrganisationItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 90,
            render: (id: string) => <span className="org-code-text">{id}</span>,
        },
        {
            title: 'Organisation',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <span className="org-name-text">{name}</span>,
        },
        {
            title: 'Primary admin',
            key: 'admin',
            width: 220,
            render: (_, record) => (
                <div className="org-admin-cell">
                    <span className="org-admin-name">{record.adminName}</span>
                    <span className="org-admin-email">{record.adminEmail}</span>
                </div>
            ),
        },
        {
            title: 'Plan',
            dataIndex: 'plan',
            key: 'plan',
            width: 120,
            render: (plan: OrgPlan) => <span className="org-plan-badge">{plan}</span>,
        },
        {
            title: 'Users',
            dataIndex: 'users',
            key: 'users',
            width: 75,
            render: (users: number) => <span>{users}</span>,
        },
        {
            title: 'Projects',
            dataIndex: 'projects',
            key: 'projects',
            width: 85,
            render: (projects: number) => <span>{projects}</span>,
        },
        {
            title: 'Monthly usage',
            dataIndex: 'monthlyUsage',
            key: 'monthlyUsage',
            width: 140,
            render: (usage: number) => {
                let strokeColor = '#0284c7';
                if (usage >= 100) strokeColor = '#ef4444';
                else if (usage >= 85) strokeColor = '#d97706';

                return (
                    <div className="org-usage-cell">
                        <Progress
                            percent={Math.min(usage, 100)}
                            showInfo={false}
                            strokeColor={strokeColor}
                            size="small"
                            className="org-usage-progress-bar"
                        />
                        <span className="org-usage-percent-label">{usage}%</span>
                    </div>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: (status: OrgStatus) => {
                if (status === 'Active') {
                    return <Tag color="success" className="org-status-tag">● Active</Tag>;
                }
                if (status === 'Trial') {
                    return <Tag color="processing" className="org-status-tag">● Trial</Tag>;
                }
                if (status === 'Past due') {
                    return <Tag color="warning" className="org-status-tag">● Past due</Tag>;
                }
                if (status === 'Cancelled') {
                    return <Tag color="default" className="org-status-tag">● Cancelled</Tag>;
                }
                if (status === 'Suspended') {
                    return <Tag color="error" className="org-status-tag">● Suspended</Tag>;
                }
                return <Tag>{status}</Tag>;
            },
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            width: 115,
            render: (date: string) => <span className="org-date-text">{date}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 70,
            fixed: 'right' as const,
            align: 'center',
            render: (_, record) => {
                const menuItems = [
                    {
                        key: 'view',
                        label: 'View Details',
                        icon: <Eye size={14} />,
                        onClick: () => handleAction('view', record),
                    },
                    {
                        key: 'edit',
                        label: 'Edit Organisation',
                        icon: <Edit size={14} />,
                        onClick: () => handleAction('edit', record),
                    },
                    {
                        key: 'suspend',
                        label: record.status === 'Suspended' ? 'Reactivate Tenant' : 'Suspend Tenant',
                        icon: <Ban size={14} />,
                        onClick: () => handleAction('suspend', record),
                    },
                    {
                        type: 'divider' as const,
                    },
                    {
                        key: 'delete',
                        label: 'Delete Tenant',
                        danger: true,
                        icon: <Trash2 size={14} />,
                        onClick: () => handleAction('delete', record),
                    },
                ];

                return (
                    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                        <button type="button" className="org-action-btn" title="Actions">
                            <MoreHorizontal size={16} />
                        </button>
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <div className="org-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH CREATE ORGANISATION BUTTON
         ------------------------------------------------------------------- */}
            <div className="org-header-row">
                <div className="org-title-group">
                    <span className="org-category-label">
                        CUSTOMERS
                    </span>
                    <h1 className="org-main-heading">
                        Organisations
                    </h1>
                    <span className="org-subtitle-count">
                        {organisations.length} tenants on the platform.
                    </span>
                </div>

                <SubmitButton
                    className="org-create-btn"
                    icon={<Plus size={14} strokeWidth={2.5} />}
                    onClick={() => setDrawerOpen(true)}
                >
                    Create organisation
                </SubmitButton>
            </div>

            {/* Demonstration Banner */}
            <Alert
                message={
                    <span style={{ fontSize: 12 }}>
                        <strong>Demonstration data.</strong> Nothing here reflects real systems; actions only change this prototype's local state.
                    </span>
                }
                type="info"
                showIcon
                icon={<Info size={15} />}
                className="org-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search & Pill Tabs)
         ------------------------------------------------------------------- */}
            <div className="org-filter-toolbar">
                {/* Search Box */}
                <Input
                    prefix={<Search size={14} style={{ color: '#94a3b8', marginRight: 4 }} />}
                    placeholder="Search name, ID or admin"
                    className="org-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                />

                {/* Filter Pills */}
                <div className="org-pill-tabs">
                    <div
                        className={`org-filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('All')}
                    >
                        All {counts.all}
                    </div>
                    <div
                        className={`org-filter-pill ${activeFilter === 'Active' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Active')}
                    >
                        Active {counts.active}
                    </div>
                    <div
                        className={`org-filter-pill ${activeFilter === 'Trial' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Trial')}
                    >
                        Trial {counts.trial}
                    </div>
                    <div
                        className={`org-filter-pill ${activeFilter === 'Suspended' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Suspended')}
                    >
                        Suspended {counts.suspended}
                    </div>
                    <div
                        className={`org-filter-pill ${activeFilter === 'Cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Cancelled')}
                    >
                        Cancelled {counts.cancelled}
                    </div>
                    <div
                        className={`org-filter-pill ${activeFilter === 'Enterprise' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Enterprise')}
                    >
                        Enterprise {counts.enterprise}
                    </div>
                    <div
                        className={`org-filter-pill ${activeFilter === 'Payment overdue' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Payment overdue')}
                    >
                        Payment overdue {counts.overdue}
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
          ORGANISATIONS CARD & TABLE
         ------------------------------------------------------------------- */}
            <Card className="org-table-card" styles={{ body: { padding: 0 } }}>
                <Table<OrganisationItem>
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    size="small"
                    className="org-data-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>

            {/* -------------------------------------------------------------------
          BOTTOM STANDALONE PAGINATION
         ------------------------------------------------------------------- */}
            <div className="org-pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredOrganisations.length}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50']}
                    size="small"
                />
            </div>

            {/* -------------------------------------------------------------------
          CREATE ORGANISATION SIDE DRAWER
         ------------------------------------------------------------------- */}
            <Drawer
                title={
                    <div className="org-drawer-header-content">
                        <h2 className="org-drawer-title">
                            Create organisation
                        </h2>
                    </div>
                }
                placement="right"
                width={460}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                className="org-drawer"
                styles={{
                    body: { padding: '20px 24px' },
                    footer: { padding: '14px 24px' },
                }}
                footer={
                    <div className="org-drawer-footer">
                        <CancelButton onClick={() => setDrawerOpen(false)}>
                            Cancel
                        </CancelButton>
                        <SubmitButton onClick={handleCreate}>
                            Create organisation
                        </SubmitButton>
                    </div>
                }
            >
                <div className="org-drawer-form">
                    {/* Organisation Name */}
                    <div className="org-form-group">
                        <label className="org-form-label">Organisation name</label>
                        <Input
                            placeholder="Acme Corporation"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="org-drawer-input"
                        />
                    </div>

                    {/* Row: Primary admin + Admin email */}
                    <div className="org-form-row">
                        <div className="org-form-group">
                            <label className="org-form-label">Primary admin</label>
                            <Input
                                placeholder="Jane Doe"
                                value={formState.adminName}
                                onChange={(e) => setFormState({ ...formState, adminName: e.target.value })}
                                className="org-drawer-input"
                            />
                        </div>
                        <div className="org-form-group">
                            <label className="org-form-label">Admin email</label>
                            <Input
                                placeholder="jane@company.com"
                                value={formState.adminEmail}
                                onChange={(e) => setFormState({ ...formState, adminEmail: e.target.value })}
                                className="org-drawer-input"
                            />
                        </div>
                    </div>

                    {/* Row: Phone + Website */}
                    <div className="org-form-row">
                        <div className="org-form-group">
                            <label className="org-form-label">Phone</label>
                            <Input
                                placeholder="+1 (555) 000-0000"
                                value={formState.phone}
                                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                className="org-drawer-input"
                            />
                        </div>
                        <div className="org-form-group">
                            <label className="org-form-label">Website</label>
                            <Input
                                placeholder="company.com"
                                value={formState.website}
                                onChange={(e) => setFormState({ ...formState, website: e.target.value })}
                                className="org-drawer-input"
                            />
                        </div>
                    </div>

                    {/* Row: Industry + Plan */}
                    <div className="org-form-row">
                        <div className="org-form-group">
                            <label className="org-form-label">Industry</label>
                            <Select
                                placeholder="Select..."
                                value={formState.industry || undefined}
                                onChange={(val) => setFormState({ ...formState, industry: val })}
                                className="org-drawer-select"
                                options={[
                                    { label: 'Technology', value: 'Technology' },
                                    { label: 'Healthcare', value: 'Healthcare' },
                                    { label: 'Logistics', value: 'Logistics' },
                                    { label: 'Financial Services', value: 'Financial Services' },
                                    { label: 'Manufacturing', value: 'Manufacturing' },
                                    { label: 'Energy', value: 'Energy' },
                                    { label: 'Retail', value: 'Retail' },
                                ]}
                            />
                        </div>
                        <div className="org-form-group">
                            <label className="org-form-label">Plan</label>
                            <Select
                                value={formState.plan}
                                onChange={(val: OrgPlan) => setFormState({ ...formState, plan: val })}
                                className="org-drawer-select"
                                options={[
                                    { label: 'Free Trial', value: 'Free Trial' },
                                    { label: 'Starter', value: 'Starter' },
                                    { label: 'Professional', value: 'Professional' },
                                    { label: 'Enterprise', value: 'Enterprise' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Row: Country + City */}
                    <div className="org-form-row">
                        <div className="org-form-group">
                            <label className="org-form-label">Country</label>
                            <Input
                                placeholder="United States"
                                value={formState.country}
                                onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                                className="org-drawer-input"
                            />
                        </div>
                        <div className="org-form-group">
                            <label className="org-form-label">City</label>
                            <Input
                                placeholder="San Francisco"
                                value={formState.city}
                                onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                                className="org-drawer-input"
                            />
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default Organisation;
