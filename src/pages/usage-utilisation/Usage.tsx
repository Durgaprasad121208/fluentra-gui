import React, { useState, useMemo } from 'react';
import {
    Card,
    Table,
    Pagination,
    Input,
    Alert,
    notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    Search,
    Info,
    Download,
} from 'lucide-react';
import './Usage.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export interface UsageItem {
    id: string;
    organisation: string;
    aiCreditsUsed: string;
    executions: string;
    storage: string;
    utilisation: string;
}

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASET (Matches Prototype Mockup & Additional Tenants)
// ---------------------------------------------------------------------------
const INITIAL_USAGE: UsageItem[] = [
    {
        id: 'USG-001',
        organisation: 'Northwind Health',
        aiCreditsUsed: '412,800',
        executions: '92,104',
        storage: '184 GB',
        utilisation: '78%',
    },
    {
        id: 'USG-002',
        organisation: 'Meridian Bank',
        aiCreditsUsed: '301,220',
        executions: '61,882',
        storage: '121 GB',
        utilisation: '64%',
    },
    {
        id: 'USG-003',
        organisation: 'Acme Corporation',
        aiCreditsUsed: '21,940',
        executions: '8,213',
        storage: '22 GB',
        utilisation: '88%',
    },
    {
        id: 'USG-004',
        organisation: 'Kestrel Insurance',
        aiCreditsUsed: '98,410',
        executions: '19,550',
        storage: '46 GB',
        utilisation: '41%',
    },
    {
        id: 'USG-005',
        organisation: 'Helio Retail',
        aiCreditsUsed: '312',
        executions: '40',
        storage: '0.2 GB',
        utilisation: '62%',
    },
    {
        id: 'USG-006',
        organisation: 'Bluepeak Logistics',
        aiCreditsUsed: '15,200',
        executions: '4,310',
        storage: '12 GB',
        utilisation: '46%',
    },
    {
        id: 'USG-007',
        organisation: 'Aurora AI Labs',
        aiCreditsUsed: '245,600',
        executions: '54,200',
        storage: '95 GB',
        utilisation: '72%',
    },
    {
        id: 'USG-008',
        organisation: 'Apex Global Finance',
        aiCreditsUsed: '189,400',
        executions: '41,800',
        storage: '88 GB',
        utilisation: '84%',
    },
    {
        id: 'USG-009',
        organisation: 'Solaris Energies',
        aiCreditsUsed: '62,300',
        executions: '14,100',
        storage: '34 GB',
        utilisation: '55%',
    },
    {
        id: 'USG-010',
        organisation: 'Vertex Cyber',
        aiCreditsUsed: '114,900',
        executions: '28,600',
        storage: '52 GB',
        utilisation: '68%',
    },
];

export const Usage: React.FC = () => {
    const [usageList] = useState<UsageItem[]>(INITIAL_USAGE);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Reset to page 1 whenever search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Filtered List based on Search (Defined BEFORE paginatedData)
    const filteredUsage = useMemo(() => {
        return usageList.filter((item) => {
            if (searchQuery.trim() === '') return true;
            const query = searchQuery.toLowerCase();
            return (
                item.organisation.toLowerCase().includes(query) ||
                item.aiCreditsUsed.toLowerCase().includes(query) ||
                item.executions.toLowerCase().includes(query) ||
                item.storage.toLowerCase().includes(query) ||
                item.utilisation.toLowerCase().includes(query)
            );
        });
    }, [usageList, searchQuery]);

    // Paginated Data Slice for Table
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredUsage.slice(start, start + pageSize);
    }, [filteredUsage, currentPage, pageSize]);

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['Organisation', 'AI Credits Used', 'Executions', 'Storage', 'Utilisation'];
        const csvRows = [
            headers.join(','),
            ...filteredUsage.map((u) =>
                [
                    `"${u.organisation}"`,
                    `"${u.aiCreditsUsed}"`,
                    `"${u.executions}"`,
                    `"${u.storage}"`,
                    `"${u.utilisation}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `usage_utilisation_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredUsage.length} organisation usage records to CSV.`,
            placement: 'topRight',
        });
    };

    // Table Columns Definition matching Mockup
    const columns: ColumnsType<UsageItem> = [
        {
            title: 'Organisation',
            dataIndex: 'organisation',
            key: 'organisation',
            width: 260,
            render: (organisation: string) => <span className="usage-org-text">{organisation}</span>,
        },
        {
            title: 'AI credits used',
            dataIndex: 'aiCreditsUsed',
            key: 'aiCreditsUsed',
            width: 200,
            render: (credits: string) => <span className="usage-credits-text">{credits}</span>,
        },
        {
            title: 'Executions',
            dataIndex: 'executions',
            key: 'executions',
            width: 180,
            render: (executions: string) => <span className="usage-exec-text">{executions}</span>,
        },
        {
            title: 'Storage',
            dataIndex: 'storage',
            key: 'storage',
            width: 160,
            render: (storage: string) => <span className="usage-storage-text">{storage}</span>,
        },
        {
            title: 'Utilisation',
            dataIndex: 'utilisation',
            key: 'utilisation',
            render: (utilisation: string) => <span className="usage-percent-text">{utilisation}</span>,
        },
    ];

    return (
        <div className="usage-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="usage-header-row">
                <div className="usage-title-group">
                    <h1 className="usage-main-heading">
                        Usage & Utilisation
                    </h1>
                    <span className="usage-subtitle-count">
                        Consumption by organisation this billing period.
                    </span>
                </div>

                <button
                    type="button"
                    className="usage-export-btn"
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
                className="usage-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search Box)
         ------------------------------------------------------------------- */}
            <div className="usage-filter-toolbar">
                <Input
                    prefix={<Search size={14} style={{ color: '#94a3b8', marginRight: 4 }} />}
                    placeholder="Search usage & utilisation"
                    className="usage-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                />
            </div>

            {/* -------------------------------------------------------------------
          USAGE CARD & TABLE
         ------------------------------------------------------------------- */}
            <Card className="usage-table-card" styles={{ body: { padding: 0 } }}>
                <Table<UsageItem>
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    size="small"
                    className="usage-data-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>

            {/* -------------------------------------------------------------------
          BOTTOM STANDALONE PAGINATION
         ------------------------------------------------------------------- */}
            <div className="usage-pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredUsage.length}
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

export default Usage;
