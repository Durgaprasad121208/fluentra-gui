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
import './PlansPricing.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type PlanStatus = 'Published' | 'Draft' | 'Archived';

export interface PlanItem {
    id: string;
    plan: string;
    price: string;
    projects: string;
    members: string;
    credits: string;
    status: PlanStatus;
}

type FilterCategory = 'All' | 'Published' | 'Draft';

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASET (Matches Prototype Mockup & Additional Tiers)
// ---------------------------------------------------------------------------
const INITIAL_PLANS: PlanItem[] = [
    {
        id: 'PLAN-001',
        plan: 'Free Trial',
        price: '$0 · 14 days',
        projects: '1',
        members: '3',
        credits: '500',
        status: 'Published',
    },
    {
        id: 'PLAN-002',
        plan: 'Starter',
        price: '$49 / seat',
        projects: '5',
        members: '10',
        credits: '5,000',
        status: 'Published',
    },
    {
        id: 'PLAN-003',
        plan: 'Professional',
        price: '$99 / seat',
        projects: 'Unlimited',
        members: '50',
        credits: '25,000',
        status: 'Published',
    },
    {
        id: 'PLAN-004',
        plan: 'Enterprise',
        price: 'Custom',
        projects: 'Unlimited',
        members: 'Unlimited',
        credits: 'Custom',
        status: 'Published',
    },
    {
        id: 'PLAN-005',
        plan: 'Team (2027)',
        price: '$69 / seat',
        projects: '15',
        members: '25',
        credits: '12,000',
        status: 'Draft',
    },
    {
        id: 'PLAN-006',
        plan: 'Scale Growth',
        price: '$199 / seat',
        projects: 'Unlimited',
        members: '150',
        credits: '60,000',
        status: 'Draft',
    },
    {
        id: 'PLAN-007',
        plan: 'Legacy Starter',
        price: '$29 / seat',
        projects: '3',
        members: '5',
        credits: '2,500',
        status: 'Archived',
    },
];

export const PlansPricing: React.FC = () => {
    const [plans] = useState<PlanItem[]>(INITIAL_PLANS);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Reset to page 1 whenever filter or search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilter]);

    // Filtered List based on Search & Pill Filter (Defined BEFORE paginatedData)
    const filteredPlans = useMemo(() => {
        return plans.filter((item) => {
            // 1. Search filter
            const matchesSearch =
                searchQuery.trim() === '' ||
                item.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.projects.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.members.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.credits.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Pill tab filter
            if (activeFilter === 'Published') return item.status === 'Published';
            if (activeFilter === 'Draft') return item.status === 'Draft';

            return true;
        });
    }, [plans, searchQuery, activeFilter]);

    // Paginated Data Slice for Table
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredPlans.slice(start, start + pageSize);
    }, [filteredPlans, currentPage, pageSize]);

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['Plan', 'Price', 'Projects', 'Members', 'AI Credits / mo', 'Status'];
        const csvRows = [
            headers.join(','),
            ...filteredPlans.map((p) =>
                [
                    `"${p.plan}"`,
                    `"${p.price}"`,
                    `"${p.projects}"`,
                    `"${p.members}"`,
                    `"${p.credits}"`,
                    `"${p.status}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `plans_pricing_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredPlans.length} plan tiers to CSV.`,
            placement: 'topRight',
        });
    };

    // Table Columns Definition matching Mockup
    const columns: ColumnsType<PlanItem> = [
        {
            title: 'Plan',
            dataIndex: 'plan',
            key: 'plan',
            width: 180,
            render: (plan: string) => <span className="pricing-plan-text">{plan}</span>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 180,
            render: (price: string) => <span className="pricing-price-text">{price}</span>,
        },
        {
            title: 'Projects',
            dataIndex: 'projects',
            key: 'projects',
            width: 150,
            render: (projects: string) => <span className="pricing-projects-text">{projects}</span>,
        },
        {
            title: 'Members',
            dataIndex: 'members',
            key: 'members',
            width: 150,
            render: (members: string) => <span className="pricing-members-text">{members}</span>,
        },
        {
            title: 'AI credits / mo',
            dataIndex: 'credits',
            key: 'credits',
            render: (credits: string) => <span className="pricing-credits-text">{credits}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (status: PlanStatus) => {
                if (status === 'Published') {
                    return <Tag color="success" className="pricing-status-tag">● Published</Tag>;
                }
                if (status === 'Draft') {
                    return <Tag color="processing" className="pricing-status-tag">● Draft</Tag>;
                }
                return <Tag color="default" className="pricing-status-tag">● Archived</Tag>;
            },
        },
    ];

    return (
        <div className="pricing-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="pricing-header-row">
                <div className="pricing-title-group">
                    <h1 className="pricing-main-heading">
                        Plans & Pricing
                    </h1>
                    <span className="pricing-subtitle-count">
                        Published plans, list prices and included limits.
                    </span>
                </div>

                <button
                    type="button"
                    className="pricing-export-btn"
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
                className="pricing-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search & Pill Tabs in a Single Row)
         ------------------------------------------------------------------- */}
            <div className="pricing-filter-toolbar">
                {/* Search Box */}
                <Input
                    prefix={<Search size={14} style={{ color: '#94a3b8', marginRight: 4 }} />}
                    placeholder="Search plans & pricing"
                    className="pricing-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                />

                {/* Filter Pills */}
                <div className="pricing-pill-tabs">
                    <div
                        className={`pricing-filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('All')}
                    >
                        All
                    </div>
                    <div
                        className={`pricing-filter-pill ${activeFilter === 'Published' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Published')}
                    >
                        Published
                    </div>
                    <div
                        className={`pricing-filter-pill ${activeFilter === 'Draft' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Draft')}
                    >
                        Draft
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
          PLANS CARD & TABLE
         ------------------------------------------------------------------- */}
            <Card className="pricing-table-card" styles={{ body: { padding: 0 } }}>
                <Table<PlanItem>
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    size="small"
                    className="pricing-data-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>

            {/* -------------------------------------------------------------------
          BOTTOM STANDALONE PAGINATION
         ------------------------------------------------------------------- */}
            <div className="pricing-pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredPlans.length}
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

export default PlansPricing;
