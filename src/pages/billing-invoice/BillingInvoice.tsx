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
import './BillingInvoice.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type InvoiceStatus = 'Paid' | 'Open' | 'Past due' | 'Failed';

export interface InvoiceItem {
    id: string;
    organisation: string;
    amount: string;
    issued: string;
    status: InvoiceStatus;
}

type FilterCategory = 'All' | 'Paid' | 'Open';

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASET (Matches Prototype Mockup & Additional Invoices)
// ---------------------------------------------------------------------------
const INITIAL_INVOICES: InvoiceItem[] = [
    {
        id: 'INV-20944',
        organisation: 'Northwind Health',
        amount: '$18,600.00',
        issued: 'Oct 1, 2026',
        status: 'Paid',
    },
    {
        id: 'INV-20938',
        organisation: 'Acme Corporation',
        amount: '$4,158.00',
        issued: 'Oct 1, 2026',
        status: 'Paid',
    },
    {
        id: 'INV-20931',
        organisation: 'Quanta Fintech',
        amount: '$2,871.00',
        issued: 'Sep 9, 2026',
        status: 'Paid',
    },
    {
        id: 'INV-20917',
        organisation: 'Meridian Bank',
        amount: '$14,200.00',
        issued: 'Sep 1, 2026',
        status: 'Paid',
    },
    {
        id: 'INV-20950',
        organisation: 'Kestrel Insurance',
        amount: '$9,900.00',
        issued: 'Oct 3, 2026',
        status: 'Open',
    },
    {
        id: 'INV-20902',
        organisation: 'Bluepeak Logistics',
        amount: '$790.00',
        issued: 'Aug 28, 2026',
        status: 'Paid',
    },
    {
        id: 'INV-20895',
        organisation: 'Aurora AI Labs',
        amount: '$9,400.00',
        issued: 'Aug 15, 2026',
        status: 'Paid',
    },
    {
        id: 'INV-20880',
        organisation: 'Apex Global Finance',
        amount: '$12,000.00',
        issued: 'Aug 10, 2026',
        status: 'Open',
    },
    {
        id: 'INV-20864',
        organisation: 'Solaris Energies',
        amount: '$3,200.00',
        issued: 'Jul 20, 2026',
        status: 'Paid',
    },
    {
        id: 'INV-20850',
        organisation: 'Vertex Cyber',
        amount: '$2,400.00',
        issued: 'Jul 15, 2026',
        status: 'Paid',
    },
];

export const BillingInvoice: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Reset to page 1 whenever filter or search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilter]);

    // Filtered List based on Search & Pill Filter (Defined BEFORE paginatedData)
    const filteredInvoices = useMemo(() => {
        return invoices.filter((item) => {
            // 1. Search filter
            const matchesSearch =
                searchQuery.trim() === '' ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.issued.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Pill tab filter
            if (activeFilter === 'Paid') return item.status === 'Paid';
            if (activeFilter === 'Open') return item.status === 'Open';

            return true;
        });
    }, [invoices, searchQuery, activeFilter]);

    // Paginated Data Slice for Table
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredInvoices.slice(start, start + pageSize);
    }, [filteredInvoices, currentPage, pageSize]);

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['Invoice ID', 'Organisation', 'Amount', 'Issued', 'Status'];
        const csvRows = [
            headers.join(','),
            ...filteredInvoices.map((inv) =>
                [
                    `"${inv.id}"`,
                    `"${inv.organisation}"`,
                    `"${inv.amount}"`,
                    `"${inv.issued}"`,
                    `"${inv.status}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoices_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredInvoices.length} invoices to CSV.`,
            placement: 'topRight',
        });
    };

    // Table Columns Definition matching Mockup
    const columns: ColumnsType<InvoiceItem> = [
        {
            title: 'Invoice',
            dataIndex: 'id',
            key: 'id',
            width: 140,
            render: (id: string) => <span className="invoice-code-text">{id}</span>,
        },
        {
            title: 'Organisation',
            dataIndex: 'organisation',
            key: 'organisation',
            width: 220,
            render: (organisation: string) => <span className="invoice-org-text">{organisation}</span>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: string) => <span className="invoice-amount-text">{amount}</span>,
        },
        {
            title: 'Issued',
            dataIndex: 'issued',
            key: 'issued',
            width: 150,
            render: (issued: string) => <span className="invoice-issued-text">{issued}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: InvoiceStatus) => {
                if (status === 'Paid') {
                    return <Tag color="success" className="invoice-status-tag">● Paid</Tag>;
                }
                if (status === 'Open') {
                    return <Tag color="processing" className="invoice-status-tag">● Open</Tag>;
                }
                if (status === 'Past due') {
                    return <Tag color="warning" className="invoice-status-tag">● Past due</Tag>;
                }
                return <Tag color="error" className="invoice-status-tag">● Failed</Tag>;
            },
        },
    ];

    return (
        <div className="invoice-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="invoice-header-row">
                <div className="invoice-title-group">
                    <h1 className="invoice-main-heading">
                        Billing & Invoices
                    </h1>
                    <span className="invoice-subtitle-count">
                        Invoices issued to customers.
                    </span>
                </div>

                <button
                    type="button"
                    className="invoice-export-btn"
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
                className="invoice-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search & Pill Tabs in a Single Row)
         ------------------------------------------------------------------- */}
            <div className="invoice-filter-toolbar">
                {/* Search Box */}
                <Input
                    prefix={<Search size={14} style={{ color: '#94a3b8', marginRight: 4 }} />}
                    placeholder="Search billing & invoices"
                    className="invoice-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                />

                {/* Filter Pills */}
                <div className="invoice-pill-tabs">
                    <div
                        className={`invoice-filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('All')}
                    >
                        All
                    </div>
                    <div
                        className={`invoice-filter-pill ${activeFilter === 'Paid' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Paid')}
                    >
                        Paid
                    </div>
                    <div
                        className={`invoice-filter-pill ${activeFilter === 'Open' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Open')}
                    >
                        Open
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
          INVOICES CARD & TABLE
         ------------------------------------------------------------------- */}
            <Card className="invoice-table-card" styles={{ body: { padding: 0 } }}>
                <Table<InvoiceItem>
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    size="small"
                    className="invoice-data-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>

            {/* -------------------------------------------------------------------
          BOTTOM STANDALONE PAGINATION
         ------------------------------------------------------------------- */}
            <div className="invoice-pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredInvoices.length}
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

export default BillingInvoice;
