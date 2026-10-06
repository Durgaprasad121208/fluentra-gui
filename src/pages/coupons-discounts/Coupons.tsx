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
import SubmitButton, { CancelButton } from '../../components/custombutton/CustomButton';
import './Coupons.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type CouponStatus = 'Active' | 'Expired';

export interface CouponItem {
    id: string;
    code: string;
    discount: string;
    redemptions: string;
    expires: string;
    status: CouponStatus;
}

type FilterCategory = 'All' | 'Active' | 'Expired';

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASET (Matches Prototype Mockup & Additional Promotions)
// ---------------------------------------------------------------------------
const INITIAL_COUPONS: CouponItem[] = [
    {
        id: 'CPN-001',
        code: 'LAUNCH25',
        discount: '25% · 3 months',
        redemptions: '142 / 500',
        expires: 'Dec 31, 2026',
        status: 'Active',
    },
    {
        id: 'CPN-002',
        code: 'STARTUP50',
        discount: '50% · 6 months',
        redemptions: '38 / 100',
        expires: 'Mar 31, 2027',
        status: 'Active',
    },
    {
        id: 'CPN-003',
        code: 'PARTNER10',
        discount: '10% · forever',
        redemptions: '21 / ∞',
        expires: '—',
        status: 'Active',
    },
    {
        id: 'CPN-004',
        code: 'SUMMER24',
        discount: '20% · 2 months',
        redemptions: '300 / 300',
        expires: 'Aug 31, 2024',
        status: 'Expired',
    },
    {
        id: 'CPN-005',
        code: 'ENTERPRISE15',
        discount: '15% · 12 months',
        redemptions: '85 / 200',
        expires: 'Nov 30, 2026',
        status: 'Active',
    },
    {
        id: 'CPN-006',
        code: 'EARLYBIRD',
        discount: '30% · 1 year',
        redemptions: '50 / 50',
        expires: 'Jan 15, 2025',
        status: 'Expired',
    },
    {
        id: 'CPN-007',
        code: 'COMMUNITY100',
        discount: '100% · 1 month',
        redemptions: '12 / 100',
        expires: 'Dec 31, 2026',
        status: 'Active',
    },
];

export const Coupons: React.FC = () => {
    const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Reset to page 1 whenever filter or search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilter]);

    // Filtered List based on Search & Pill Filter (Defined BEFORE paginatedData)
    const filteredCoupons = useMemo(() => {
        return coupons.filter((item) => {
            // 1. Search filter
            const matchesSearch =
                searchQuery.trim() === '' ||
                item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.discount.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.redemptions.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.expires.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Pill tab filter
            if (activeFilter === 'Active') return item.status === 'Active';
            if (activeFilter === 'Expired') return item.status === 'Expired';

            return true;
        });
    }, [coupons, searchQuery, activeFilter]);

    // Paginated Data Slice for Table
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredCoupons.slice(start, start + pageSize);
    }, [filteredCoupons, currentPage, pageSize]);

    // Toggle Expire / Reactivate Coupon
    const handleToggleExpire = (record: CouponItem) => {
        const nextStatus: CouponStatus = record.status === 'Expired' ? 'Active' : 'Expired';
        setCoupons((prev) =>
            prev.map((c) => (c.id === record.id ? { ...c, status: nextStatus } : c))
        );

        notification.info({
            message: `Coupon ${nextStatus === 'Expired' ? 'Expired' : 'Reactivated'}`,
            description: `Coupon ${record.code} is now ${nextStatus.toLowerCase()}.`,
            placement: 'topRight',
        });
    };

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['Coupon Code', 'Discount', 'Redemptions', 'Expires', 'Status'];
        const csvRows = [
            headers.join(','),
            ...filteredCoupons.map((c) =>
                [
                    `"${c.code}"`,
                    `"${c.discount}"`,
                    `"${c.redemptions}"`,
                    `"${c.expires}"`,
                    `"${c.status}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `coupons_discounts_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredCoupons.length} coupon codes to CSV.`,
            placement: 'topRight',
        });
    };

    // Table Columns Definition matching Mockup
    const columns: ColumnsType<CouponItem> = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            width: 160,
            render: (code: string) => <span className="coupon-code-text">{code}</span>,
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            width: 200,
            render: (discount: string) => <span className="coupon-discount-text">{discount}</span>,
        },
        {
            title: 'Redemptions',
            dataIndex: 'redemptions',
            key: 'redemptions',
            width: 160,
            render: (redemptions: string) => <span className="coupon-redemptions-text">{redemptions}</span>,
        },
        {
            title: 'Expires',
            dataIndex: 'expires',
            key: 'expires',
            render: (expires: string) => <span className="coupon-expires-text">{expires}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: CouponStatus) => {
                if (status === 'Active') {
                    return <Tag color="success" className="coupon-status-tag">● Active</Tag>;
                }
                return <Tag color="default" className="coupon-status-tag">● Expired</Tag>;
            },
        },
        {
            title: '',
            key: 'actions',
            width: 100,
            align: 'right',
            render: (_, record) => {
                const isExpired = record.status === 'Expired';
                return (
                    <SubmitButton
                        size="small"
                        onClick={() => handleToggleExpire(record)}
                    >
                        {isExpired ? 'Reactivate' : 'Expire'}
                    </SubmitButton>
                );
            },
        },
    ];

    return (
        <div className="coupons-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="coupons-header-row">
                <div className="coupons-title-group">
                    <h1 className="coupons-main-heading">
                        Coupons & Discounts
                    </h1>
                    <span className="coupons-subtitle-count">
                        Discount codes and promotions.
                    </span>
                </div>

                <button
                    type="button"
                    className="coupons-export-btn"
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
                className="coupons-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search & Pill Tabs in a Single Row)
         ------------------------------------------------------------------- */}
            <div className="coupons-filter-toolbar">
                {/* Search Box */}
                <Input
                    prefix={<Search size={14} style={{ color: '#94a3b8', marginRight: 4 }} />}
                    placeholder="Search coupons & discounts"
                    className="coupons-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                />

                {/* Filter Pills */}
                <div className="coupons-pill-tabs">
                    <div
                        className={`coupons-filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('All')}
                    >
                        All
                    </div>
                    <div
                        className={`coupons-filter-pill ${activeFilter === 'Active' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Active')}
                    >
                        Active
                    </div>
                    <div
                        className={`coupons-filter-pill ${activeFilter === 'Expired' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Expired')}
                    >
                        Expired
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
          COUPONS CARD & TABLE
         ------------------------------------------------------------------- */}
            <Card className="coupons-table-card" styles={{ body: { padding: 0 } }}>
                <Table<CouponItem>
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    size="small"
                    className="coupons-data-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>

            {/* -------------------------------------------------------------------
          BOTTOM STANDALONE PAGINATION
         ------------------------------------------------------------------- */}
            <div className="coupons-pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredCoupons.length}
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

export default Coupons;
