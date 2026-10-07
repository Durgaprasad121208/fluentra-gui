import React, { useState, useMemo } from 'react';
import {
    Card,
    Table,
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
import './Security.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type PolicyStatus = 'Enforced' | 'Disabled';

export interface SecurityPolicyItem {
    id: string;
    policy: string;
    scope: string;
    status: PolicyStatus;
}

type FilterStatus = 'All' | 'Enforced' | 'Disabled';

// ---------------------------------------------------------------------------
// INITIAL DATASET (Matches Mockup Screenshot)
// ---------------------------------------------------------------------------
const INITIAL_POLICIES: SecurityPolicyItem[] = [
    {
        id: 'pol-1',
        policy: 'Require MFA for admins',
        scope: 'Super Admin',
        status: 'Enforced',
    },
    {
        id: 'pol-2',
        policy: 'Session timeout 30 min',
        scope: 'All users',
        status: 'Enforced',
    },
    {
        id: 'pol-3',
        policy: 'IP allow-list for admin portal',
        scope: 'Super Admin',
        status: 'Enforced',
    },
    {
        id: 'pol-4',
        policy: 'Password rotation 90 days',
        scope: 'All users',
        status: 'Disabled',
    },
];

export const Security: React.FC = () => {
    const [policies, setPolicies] = useState<SecurityPolicyItem[]>(INITIAL_POLICIES);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');

    // Filter Logic
    const filteredPolicies = useMemo(() => {
        return policies.filter((item) => {
            const matchesSearch =
                item.policy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.scope.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'All' || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [policies, searchTerm, statusFilter]);

    // Toggle Policy Status Handler
    const handleToggleStatus = (policyId: string) => {
        setPolicies((prev) =>
            prev.map((item) => {
                if (item.id === policyId) {
                    const nextStatus: PolicyStatus = item.status === 'Enforced' ? 'Disabled' : 'Enforced';
                    notification.success({
                        message: 'Policy Updated',
                        description: `Policy "${item.policy}" is now ${nextStatus.toLowerCase()}.`,
                        placement: 'topRight',
                    });
                    return { ...item, status: nextStatus };
                }
                return item;
            })
        );
    };

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['Policy', 'Scope', 'Status'];
        const csvRows = [
            headers.join(','),
            ...filteredPolicies.map((p) =>
                [
                    `"${p.policy}"`,
                    `"${p.scope}"`,
                    `"${p.status}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `security_policies_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredPolicies.length} policies to CSV.`,
            placement: 'topRight',
        });
    };

    // Columns Definition
    const columns: ColumnsType<SecurityPolicyItem> = [
        {
            title: 'Policy',
            dataIndex: 'policy',
            key: 'policy',
            render: (text: string) => (
                <span className="policy-name-text">{text}</span>
            ),
        },
        {
            title: 'Scope',
            dataIndex: 'scope',
            key: 'scope',
            width: 240,
            render: (scope: string) => (
                <span className="policy-scope-text">{scope}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (status: PolicyStatus) => {
                if (status === 'Enforced') {
                    return (
                        <Tag className="policy-status-tag status-enforced">
                            ● Enforced
                        </Tag>
                    );
                }
                return (
                    <Tag className="policy-status-tag status-disabled">
                        ● Disabled
                    </Tag>
                );
            },
        },
        {
            title: '',
            key: 'actions',
            width: 100,
            align: 'right',
            render: (_, record) => (
                <button
                    type="button"
                    className="policy-toggle-btn"
                    onClick={() => handleToggleStatus(record.id)}
                >
                    Toggle
                </button>
            ),
        },
    ];

    return (
        <div className="security-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="security-header-row">
                <div className="security-title-group">
                    <h1 className="security-main-heading">
                        Security & Policies
                    </h1>
                    <span className="security-subtitle">
                        Platform-wide security policies.
                    </span>
                </div>

                <button
                    type="button"
                    className="security-export-btn"
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
                className="security-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search & Pill Tabs in a Single Row Above Table)
         ------------------------------------------------------------------- */}
            <div className="security-filter-toolbar">
                <Input
                    placeholder="Search security & policies"
                    prefix={<Search size={14} className="security-search-icon" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="security-search-input"
                    allowClear
                />

                <div className="security-pill-tabs">
                    <div
                        className={`security-pill-item ${statusFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('All')}
                    >
                        All
                    </div>
                    <div
                        className={`security-pill-item ${statusFilter === 'Enforced' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('Enforced')}
                    >
                        Enforced
                    </div>
                    <div
                        className={`security-pill-item ${statusFilter === 'Disabled' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('Disabled')}
                    >
                        Disabled
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
            SECURITY POLICIES TABLE CARD
           ------------------------------------------------------------------- */}
            <Card className="security-table-card" styles={{ body: { padding: 0 } }}>
                <Table<SecurityPolicyItem>
                    columns={columns}
                    dataSource={filteredPolicies}
                    rowKey="id"
                    size="small"
                    className="security-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default Security;
