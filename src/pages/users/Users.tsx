import React, { useState, useMemo } from 'react';
import {
    Card,
    Table,
    Pagination,
    Input,
    Tag,
    Alert,
    notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    Search,
    Info,
    Download,
} from 'lucide-react';
import './Users.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type UserStatus = 'Active' | 'Locked' | 'Invited' | 'Disabled';

export interface UserItem {
    id: string;
    name: string;
    email: string;
    organisation: string;
    role: string;
    lastActive: string;
    status: UserStatus;
}

type FilterCategory = 'All' | 'Active' | 'Locked' | 'Invited';

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASET (Matches Prototype Mockup & Additional Tenants)
// ---------------------------------------------------------------------------
const INITIAL_USERS: UserItem[] = [
    {
        id: 'USR-001',
        name: 'Daniel Mercer',
        email: 'admin@acme.com',
        organisation: 'Acme Corporation',
        role: 'Client Admin',
        lastActive: '2m ago',
        status: 'Active',
    },
    {
        id: 'USR-002',
        name: 'Aanya Rao',
        email: 'user@acme.com',
        organisation: 'Acme Corporation',
        role: 'Client User',
        lastActive: '14m ago',
        status: 'Active',
    },
    {
        id: 'USR-003',
        name: 'Hannah Cole',
        email: 'h.cole@northwind.health',
        organisation: 'Northwind Health',
        role: 'Owner',
        lastActive: '1h ago',
        status: 'Active',
    },
    {
        id: 'USR-004',
        name: 'Ravi Menon',
        email: 'ravi@quanta.io',
        organisation: 'Quanta Fintech',
        role: 'Client Admin',
        lastActive: '6d ago',
        status: 'Locked',
    },
    {
        id: 'USR-005',
        name: 'Mei Tan',
        email: 'mei@helio.sg',
        organisation: 'Helio Retail',
        role: 'Owner',
        lastActive: 'Today',
        status: 'Invited',
    },
    {
        id: 'USR-006',
        name: 'Omar Saleh',
        email: 'o.saleh@meridian.ae',
        organisation: 'Meridian Bank',
        role: 'Client User',
        lastActive: '3h ago',
        status: 'Active',
    },
    {
        id: 'USR-007',
        name: 'Jonas Weber',
        email: 'jonas@bluepeak.de',
        organisation: 'Bluepeak Logistics',
        role: 'Client Admin',
        lastActive: '2d ago',
        status: 'Active',
    },
    {
        id: 'USR-008',
        name: 'Elena Rostova',
        email: 'elena@aurora-ai.io',
        organisation: 'Aurora AI Labs',
        role: 'Owner',
        lastActive: '5m ago',
        status: 'Active',
    },
    {
        id: 'USR-009',
        name: 'Marcus Vance',
        email: 'marcus@apexfinancial.com',
        organisation: 'Apex Global Finance',
        role: 'Client Admin',
        lastActive: '1d ago',
        status: 'Active',
    },
    {
        id: 'USR-010',
        name: 'Sofia Chen',
        email: 'sofia@solarisenergies.com',
        organisation: 'Solaris Energies',
        role: 'Client User',
        lastActive: '4h ago',
        status: 'Active',
    },
    {
        id: 'USR-011',
        name: 'Liam O\'Connor',
        email: 'liam@crestline.ie',
        organisation: 'Crestline Media',
        role: 'Owner',
        lastActive: 'Yesterday',
        status: 'Invited',
    },
    {
        id: 'USR-012',
        name: 'Priya Sharma',
        email: 'priya@vertexcyber.com',
        organisation: 'Vertex Cyber',
        role: 'Client User',
        lastActive: '12d ago',
        status: 'Locked',
    },
];

export const Users: React.FC = () => {
    const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Reset to page 1 whenever filter or search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilter]);

    // Filtered List based on Search & Pill Filter (Defined BEFORE paginatedData)
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            // 1. Search filter
            const matchesSearch =
                searchQuery.trim() === '' ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Pill tab filter
            if (activeFilter === 'Active') return user.status === 'Active';
            if (activeFilter === 'Locked') return user.status === 'Locked';
            if (activeFilter === 'Invited') return user.status === 'Invited';

            return true;
        });
    }, [users, searchQuery, activeFilter]);

    // Paginated Data Slice for Table
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, currentPage, pageSize]);

    // Toggle Disable / Enable User Action
    const handleToggleStatus = (record: UserItem) => {
        const nextStatus: UserStatus = record.status === 'Disabled' ? 'Active' : 'Disabled';
        setUsers((prev) =>
            prev.map((u) => (u.id === record.id ? { ...u, status: nextStatus } : u))
        );

        notification.info({
            message: `User ${nextStatus === 'Disabled' ? 'Disabled' : 'Enabled'}`,
            description: `${record.name} is now ${nextStatus.toLowerCase()}.`,
            placement: 'topRight',
        });
    };

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['User ID', 'Name', 'Email', 'Organisation', 'Role', 'Last Active', 'Status'];
        const csvRows = [
            headers.join(','),
            ...filteredUsers.map((u) =>
                [
                    `"${u.id}"`,
                    `"${u.name}"`,
                    `"${u.email}"`,
                    `"${u.organisation}"`,
                    `"${u.role}"`,
                    `"${u.lastActive}"`,
                    `"${u.status}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `fluentra_users_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredUsers.length} users to CSV.`,
            placement: 'topRight',
        });
    };

    // Table Columns Definition matching Mockup
    const columns: ColumnsType<UserItem> = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            render: (name: string) => <span className="user-name-text">{name}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 220,
            render: (email: string) => <span className="user-email-text">{email}</span>,
        },
        {
            title: 'Organisation',
            dataIndex: 'organisation',
            key: 'organisation',
            render: (organisation: string) => <span className="user-org-text">{organisation}</span>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 150,
            render: (role: string) => <span className="user-role-text">{role}</span>,
        },
        {
            title: 'Last active',
            dataIndex: 'lastActive',
            key: 'lastActive',
            width: 120,
            render: (lastActive: string) => <span className="user-time-text">{lastActive}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: (status: UserStatus) => {
                if (status === 'Active') {
                    return <Tag color="success" className="user-status-tag">● Active</Tag>;
                }
                if (status === 'Locked') {
                    return <Tag color="error" className="user-status-tag">● Locked</Tag>;
                }
                if (status === 'Invited') {
                    return <Tag color="processing" className="user-status-tag">● Invited</Tag>;
                }
                return <Tag color="default" className="user-status-tag">● Disabled</Tag>;
            },
        },
        {
            title: '',
            key: 'actions',
            width: 90,
            align: 'right',
            render: (_, record) => {
                const isDisabling = record.status !== 'Disabled';
                return (
                    <button
                        type="button"
                        className={`user-action-btn ${!isDisabling ? 'enable' : ''}`}
                        onClick={() => handleToggleStatus(record)}
                    >
                        {isDisabling ? 'Disable' : 'Enable'}
                    </button>
                );
            },
        },
    ];

    return (
        <div className="users-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="users-header-row">
                <div className="users-title-group">
                    <h1 className="users-main-heading">
                        Users
                    </h1>
                    <span className="users-subtitle-count">
                        Users across all customer organisations.
                    </span>
                </div>

                <button
                    type="button"
                    className="users-export-btn"
                    onClick={handleExportCSV}
                >
                    <Download size={14} />
                    Export CSV
                </button>
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
                className="users-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search, Pill Tabs & Count)
         ------------------------------------------------------------------- */}
            <div className="users-filter-toolbar">
                <div className="users-filter-left">
                    {/* Search Box */}
                    <Input
                        prefix={<Search size={14} style={{ color: '#94a3b8', marginRight: 4 }} />}
                        placeholder="Search users"
                        className="users-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        allowClear
                    />

                    {/* Filter Pills */}
                    <div className="users-pill-tabs">
                        <div
                            className={`users-filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('All')}
                        >
                            All
                        </div>
                        <div
                            className={`users-filter-pill ${activeFilter === 'Active' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Active')}
                        >
                            Active
                        </div>
                        <div
                            className={`users-filter-pill ${activeFilter === 'Locked' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Locked')}
                        >
                            Locked
                        </div>
                        <div
                            className={`users-filter-pill ${activeFilter === 'Invited' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Invited')}
                        >
                            Invited
                        </div>
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
          USERS CARD & TABLE
         ------------------------------------------------------------------- */}
            <Card className="users-table-card" styles={{ body: { padding: 0 } }}>
                <Table<UserItem>
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    size="small"
                    className="users-data-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>

            {/* -------------------------------------------------------------------
          BOTTOM STANDALONE PAGINATION
         ------------------------------------------------------------------- */}
            <div className="users-pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredUsers.length}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50']}
                    size="small"
                />
            </div>
        </div>
    );
};

export default Users;
