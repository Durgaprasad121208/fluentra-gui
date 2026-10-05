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
import './Subscription.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type SubscriptionStatus = 'Active' | 'Past due' | 'Trial' | 'Cancelled';

export interface SubscriptionItem {
    id: string;
    organisation: string;
    plan: string;
    mrr: string;
    renews: string;
    status: SubscriptionStatus;
}

type FilterCategory = 'All' | 'Active' | 'Past due' | 'Trial' | 'Cancelled';

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASET (Matches Prototype Mockup & Additional Tenants)
// ---------------------------------------------------------------------------
const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
    {
        id: 'SUB-8812',
        organisation: 'Northwind Health',
        plan: 'Enterprise · annual',
        mrr: '$18,600',
        renews: 'Jan 12, 2027',
        status: 'Active',
    },
    {
        id: 'SUB-8790',
        organisation: 'Acme Corporation',
        plan: 'Professional · monthly',
        mrr: '$4,158',
        renews: 'Nov 1, 2026',
        status: 'Active',
    },
    {
        id: 'SUB-8851',
        organisation: 'Quanta Fintech',
        plan: 'Professional · monthly',
        mrr: '$2,871',
        renews: 'Oct 9, 2026',
        status: 'Past due',
    },
    {
        id: 'SUB-8866',
        organisation: 'Helio Retail',
        plan: 'Free Trial',
        mrr: '$0',
        renews: 'Oct 18, 2026',
        status: 'Trial',
    },
    {
        id: 'SUB-8702',
        organisation: 'Orchid Labs',
        plan: 'Professional · monthly',
        mrr: '$1,683',
        renews: '—',
        status: 'Cancelled',
    },
    {
        id: 'SUB-8650',
        organisation: 'Bluepeak Logistics',
        plan: 'Starter · monthly',
        mrr: '$790',
        renews: 'Nov 4, 2026',
        status: 'Active',
    },
    {
        id: 'SUB-8611',
        organisation: 'Meridian Bank',
        plan: 'Enterprise · annual',
        mrr: '$24,500',
        renews: 'Feb 28, 2027',
        status: 'Active',
    },
    {
        id: 'SUB-8590',
        organisation: 'Aurora AI Labs',
        plan: 'Professional · annual',
        mrr: '$9,400',
        renews: 'Aug 15, 2027',
        status: 'Active',
    },
    {
        id: 'SUB-8542',
        organisation: 'Apex Global Finance',
        plan: 'Enterprise · monthly',
        mrr: '$12,000',
        renews: 'Nov 14, 2026',
        status: 'Past due',
    },
    {
        id: 'SUB-8499',
        organisation: 'Solaris Energies',
        plan: 'Professional · monthly',
        mrr: '$3,200',
        renews: 'Nov 20, 2026',
        status: 'Active',
    },
    {
        id: 'SUB-8420',
        organisation: 'Crestline Media',
        plan: 'Free Trial',
        mrr: '$0',
        renews: 'Oct 25, 2026',
        status: 'Trial',
    },
    {
        id: 'SUB-8390',
        organisation: 'Vertex Cyber',
        plan: 'Professional · monthly',
        mrr: '$2,400',
        renews: '—',
        status: 'Cancelled',
    },
];

export const Subscription: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(INITIAL_SUBSCRIPTIONS);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Reset to page 1 whenever filter or search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilter]);

    // Filtered List based on Search & Pill Filter (Defined BEFORE paginatedData)
    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter((sub) => {
            // 1. Search filter
            const matchesSearch =
                searchQuery.trim() === '' ||
                sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.mrr.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Pill tab filter
            if (activeFilter === 'Active') return sub.status === 'Active';
            if (activeFilter === 'Past due') return sub.status === 'Past due';
            if (activeFilter === 'Trial') return sub.status === 'Trial';
            if (activeFilter === 'Cancelled') return sub.status === 'Cancelled';

            return true;
        });
    }, [subscriptions, searchQuery, activeFilter]);

    // Paginated Data Slice for Table
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredSubscriptions.slice(start, start + pageSize);
    }, [filteredSubscriptions, currentPage, pageSize]);

    // Toggle Cancel / Reactivate Subscription
    const handleToggleCancel = (record: SubscriptionItem) => {
        const nextStatus: SubscriptionStatus = record.status === 'Cancelled' ? 'Active' : 'Cancelled';
        setSubscriptions((prev) =>
            prev.map((s) => (s.id === record.id ? { ...s, status: nextStatus, renews: nextStatus === 'Cancelled' ? '—' : 'Nov 1, 2026' } : s))
        );

        notification.info({
            message: `Subscription ${nextStatus === 'Cancelled' ? 'Cancelled' : 'Reactivated'}`,
            description: `Subscription ${record.id} for ${record.organisation} is now ${nextStatus.toLowerCase()}.`,
            placement: 'topRight',
        });
    };

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['Subscription ID', 'Organisation', 'Plan', 'MRR', 'Renews', 'Status'];
        const csvRows = [
            headers.join(','),
            ...filteredSubscriptions.map((s) =>
                [
                    `"${s.id}"`,
                    `"${s.organisation}"`,
                    `"${s.plan}"`,
                    `"${s.mrr}"`,
                    `"${s.renews}"`,
                    `"${s.status}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `subscriptions_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredSubscriptions.length} subscriptions to CSV.`,
            placement: 'topRight',
        });
    };

    // Table Columns Definition matching Mockup
    const columns: ColumnsType<SubscriptionItem> = [
        {
            title: 'Subscription',
            dataIndex: 'id',
            key: 'id',
            width: 140,
            render: (id: string) => <span className="sub-code-text">{id}</span>,
        },
        {
            title: 'Organisation',
            dataIndex: 'organisation',
            key: 'organisation',
            width: 220,
            render: (organisation: string) => <span className="sub-org-text">{organisation}</span>,
        },
        {
            title: 'Plan',
            dataIndex: 'plan',
            key: 'plan',
            render: (plan: string) => <span className="sub-plan-text">{plan}</span>,
        },
        {
            title: 'MRR',
            dataIndex: 'mrr',
            key: 'mrr',
            width: 130,
            render: (mrr: string) => <span className="sub-mrr-text">{mrr}</span>,
        },
        {
            title: 'Renews',
            dataIndex: 'renews',
            key: 'renews',
            width: 150,
            render: (renews: string) => <span className="sub-renews-text">{renews}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: SubscriptionStatus) => {
                if (status === 'Active') {
                    return <Tag color="success" className="sub-status-tag">● Active</Tag>;
                }
                if (status === 'Past due') {
                    return <Tag color="warning" className="sub-status-tag">● Past due</Tag>;
                }
                if (status === 'Trial') {
                    return <Tag color="processing" className="sub-status-tag">● Trial</Tag>;
                }
                return <Tag color="error" className="sub-status-tag">● Cancelled</Tag>;
            },
        },
        {
            title: '',
            key: 'actions',
            width: 90,
            align: 'right',
            render: (_, record) => {
                const isCancelled = record.status === 'Cancelled';
                return (
                    <button
                        type="button"
                        className={`sub-action-btn ${isCancelled ? 'reactivate' : ''}`}
                        onClick={() => handleToggleCancel(record)}
                    >
                        {isCancelled ? 'Reactivate' : 'Cancel'}
                    </button>
                );
            },
        },
    ];

    return (
        <div className="sub-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="sub-header-row">
                <div className="sub-title-group">
                    <h1 className="sub-main-heading">
                        Subscriptions
                    </h1>
                    <span className="sub-subtitle-count">
                        Active and historical subscriptions.
                    </span>
                </div>

                <button
                    type="button"
                    className="sub-export-btn"
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
                className="sub-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search & Pill Tabs in a Single Row)
         ------------------------------------------------------------------- */}
            <div className="sub-filter-toolbar">
                {/* Search Box */}
                <Input
                    prefix={<Search size={14} style={{ color: '#94a3b8', marginRight: 4 }} />}
                    placeholder="Search subscriptions"
                    className="sub-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                />

                {/* Filter Pills */}
                <div className="sub-pill-tabs">
                    <div
                        className={`sub-filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('All')}
                    >
                        All
                    </div>
                    <div
                        className={`sub-filter-pill ${activeFilter === 'Active' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Active')}
                    >
                        Active
                    </div>
                    <div
                        className={`sub-filter-pill ${activeFilter === 'Past due' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Past due')}
                    >
                        Past due
                    </div>
                    <div
                        className={`sub-filter-pill ${activeFilter === 'Trial' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Trial')}
                    >
                        Trial
                    </div>
                    <div
                        className={`sub-filter-pill ${activeFilter === 'Cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Cancelled')}
                    >
                        Cancelled
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
          SUBSCRIPTIONS CARD & TABLE
         ------------------------------------------------------------------- */}
            <Card className="sub-table-card" styles={{ body: { padding: 0 } }}>
                <Table<SubscriptionItem>
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    size="small"
                    className="sub-data-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>

            {/* -------------------------------------------------------------------
          BOTTOM STANDALONE PAGINATION
         ------------------------------------------------------------------- */}
            <div className="sub-pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredSubscriptions.length}
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

export default Subscription;
