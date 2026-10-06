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
    ArrowRightToLine,
} from 'lucide-react';
import './Support.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type SupportPriority = 'P1 Critical' | 'P2 High' | 'P3 Normal' | 'P4 Low';

export interface SupportItem {
    id: string;
    organisation: string;
    orgCode: string;
    contactName: string;
    contactEmail: string;
    priority: SupportPriority;
    openIssues: number;
    lastActivity: string;
    internalNotes: string;
}

type FilterPriority = 'All' | 'P1 Critical' | 'P2 High' | 'P3 Normal' | 'P4 Low';

// ---------------------------------------------------------------------------
// INITIAL DATASET (Matching Mockup Screenshot)
// ---------------------------------------------------------------------------
const INITIAL_SUPPORT_ITEMS: SupportItem[] = [
    {
        id: 'sup-1',
        organisation: 'Acme Corporation',
        orgCode: 'ORG-001',
        contactName: 'Daniel Mercer',
        contactEmail: 'admin@acme.com',
        priority: 'P2 High',
        openIssues: 3,
        lastActivity: 'Today, 09:12',
        internalNotes: 'Asked about SSO — candidate...',
    },
    {
        id: 'sup-2',
        organisation: 'Northwind Health',
        orgCode: 'ORG-002',
        contactName: 'Hannah Cole',
        contactEmail: 'h.cole@northwind.health',
        priority: 'P1 Critical',
        openIssues: 5,
        lastActivity: 'Today, 08:40',
        internalNotes: '—',
    },
    {
        id: 'sup-3',
        organisation: 'Bluepeak Logistics',
        orgCode: 'ORG-003',
        contactName: 'Jonas Weber',
        contactEmail: 'jonas@bluepeak.de',
        priority: 'P3 Normal',
        openIssues: 1,
        lastActivity: 'Yesterday',
        internalNotes: '—',
    },
    {
        id: 'sup-4',
        organisation: 'Helio Retail',
        orgCode: 'ORG-004',
        contactName: 'Mei Tan',
        contactEmail: 'mei@helio.sg',
        priority: 'P2 High',
        openIssues: 2,
        lastActivity: 'Today, 07:55',
        internalNotes: '—',
    },
    {
        id: 'sup-5',
        organisation: 'Quanta Fintech',
        orgCode: 'ORG-005',
        contactName: 'Ravi Menon',
        contactEmail: 'ravi@quanta.io',
        priority: 'P1 Critical',
        openIssues: 4,
        lastActivity: '2 days ago',
        internalNotes: '—',
    },
    {
        id: 'sup-6',
        organisation: 'Meridian Bank',
        orgCode: 'ORG-011',
        contactName: 'Omar Saleh',
        contactEmail: 'o.saleh@meridian.ae',
        priority: 'P4 Low',
        openIssues: 0,
        lastActivity: '5 days ago',
        internalNotes: '—',
    },
];

export const Support: React.FC = () => {
    const [supportItems] = useState<SupportItem[]>(INITIAL_SUPPORT_ITEMS);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<FilterPriority>('All');

    // Filter Logic
    const filteredItems = useMemo(() => {
        return supportItems.filter((item) => {
            const matchesSearch =
                item.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.orgCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.internalNotes.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesPriority =
                selectedPriority === 'All' || item.priority === selectedPriority;

            return matchesSearch && matchesPriority;
        });
    }, [supportItems, searchTerm, selectedPriority]);

    // Handle Workspace Access Action
    const handleAccessWorkspace = (item: SupportItem) => {
        notification.info({
            message: 'Support Session Initiated',
            description: `Audited impersonation session started for ${item.organisation} (${item.orgCode}).`,
            placement: 'topRight',
        });
    };

    // Columns Definition
    const columns: ColumnsType<SupportItem> = [
        {
            title: 'Organisation',
            key: 'organisation',
            width: 210,
            render: (_, record) => (
                <div className="support-org-cell">
                    <span className="support-org-name">{record.organisation}</span>
                    <span className="support-org-code">{record.orgCode}</span>
                </div>
            ),
        },
        {
            title: 'Primary contact',
            key: 'primaryContact',
            width: 220,
            render: (_, record) => (
                <div className="support-contact-cell">
                    <span className="support-contact-name">{record.contactName}</span>
                    <span className="support-contact-email">{record.contactEmail}</span>
                </div>
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 140,
            render: (priority: SupportPriority) => {
                switch (priority) {
                    case 'P1 Critical':
                        return <Tag className="support-priority-tag priority-p1">● P1 Critical</Tag>;
                    case 'P2 High':
                        return <Tag className="support-priority-tag priority-p2">● P2 High</Tag>;
                    case 'P3 Normal':
                        return <Tag className="support-priority-tag priority-p3">● P3 Normal</Tag>;
                    case 'P4 Low':
                        return <Tag className="support-priority-tag priority-p4">● P4 Low</Tag>;
                    default:
                        return <Tag className="support-priority-tag">{priority}</Tag>;
                }
            },
        },
        {
            title: 'Open issues',
            dataIndex: 'openIssues',
            key: 'openIssues',
            width: 120,
            render: (issues: number) => (
                <span className="support-issues-text">{issues}</span>
            ),
        },
        {
            title: 'Last activity',
            dataIndex: 'lastActivity',
            key: 'lastActivity',
            width: 140,
            render: (activity: string) => (
                <span className="support-activity-text">{activity}</span>
            ),
        },
        {
            title: 'Internal notes',
            dataIndex: 'internalNotes',
            key: 'internalNotes',
            width: 220,
            ellipsis: true,
            render: (notes: string) => (
                <span className="support-notes-text">{notes}</span>
            ),
        },
        {
            title: '',
            key: 'actions',
            width: 170,
            align: 'right',
            render: (_, record) => (
                <button
                    type="button"
                    className="support-access-btn"
                    onClick={() => handleAccessWorkspace(record)}
                >
                    <ArrowRightToLine size={14} />
                    <span>Access workspace</span>
                </button>
            ),
        },
    ];

    return (
        <div className="support-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER
         ------------------------------------------------------------------- */}
            <div className="support-header-row">
                <h1 className="support-main-heading">
                    Support & Access
                </h1>
                <span className="support-subtitle">
                    Customer context, internal notes and audited support sessions.
                </span>
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
                className="support-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search & Pill Tabs in a Single Row Above Table)
         ------------------------------------------------------------------- */}
            <div className="support-filter-toolbar">
                <Input
                    placeholder="Search organisations"
                    prefix={<Search size={14} className="support-search-icon" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="support-search-input"
                    allowClear
                />

                <div className="support-pill-tabs">
                    <div
                        className={`support-pill-item ${selectedPriority === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedPriority('All')}
                    >
                        All
                    </div>
                    <div
                        className={`support-pill-item ${selectedPriority === 'P1 Critical' ? 'active' : ''}`}
                        onClick={() => setSelectedPriority('P1 Critical')}
                    >
                        P1 Critical
                    </div>
                    <div
                        className={`support-pill-item ${selectedPriority === 'P2 High' ? 'active' : ''}`}
                        onClick={() => setSelectedPriority('P2 High')}
                    >
                        P2 High
                    </div>
                    <div
                        className={`support-pill-item ${selectedPriority === 'P3 Normal' ? 'active' : ''}`}
                        onClick={() => setSelectedPriority('P3 Normal')}
                    >
                        P3 Normal
                    </div>
                    <div
                        className={`support-pill-item ${selectedPriority === 'P4 Low' ? 'active' : ''}`}
                        onClick={() => setSelectedPriority('P4 Low')}
                    >
                        P4 Low
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
            SUPPORT TABLE CARD
           ------------------------------------------------------------------- */}
            <Card className="support-table-card" styles={{ body: { padding: 0 } }}>
                <Table<SupportItem>
                    columns={columns}
                    dataSource={filteredItems}
                    rowKey="id"
                    size="small"
                    className="support-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default Support;
