import React, { useState, useMemo } from 'react';
import {
    Card,
    Table,
    Pagination,
    Input,
    Alert,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    Search,
    Info,
} from 'lucide-react';
import './CustomerActivity.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export interface ActivityItem {
    id: string;
    time: string;
    organisation: string;
    actor: string;
    event: string;
    area: string;
}

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASET (Matches Prototype Mockup & Extra Platform Activity)
// ---------------------------------------------------------------------------
const INITIAL_ACTIVITIES: ActivityItem[] = [
    {
        id: 'ACT-001',
        time: '09:41',
        organisation: 'Helio Retail',
        actor: 'Mei Tan',
        event: 'Organisation created',
        area: 'Onboarding',
    },
    {
        id: 'ACT-002',
        time: '09:12',
        organisation: 'Acme Corporation',
        actor: 'Daniel Mercer',
        event: 'Approved BRD v1.2',
        area: 'Requirements',
    },
    {
        id: 'ACT-003',
        time: '08:57',
        organisation: 'Northwind Health',
        actor: 'Hannah Cole',
        event: 'Promoted v2.4.0 to Production',
        area: 'Deployments',
    },
    {
        id: 'ACT-004',
        time: '08:30',
        organisation: 'Meridian Bank',
        actor: 'Omar Saleh',
        event: 'Generated Co-Architect proposal',
        area: 'Architecture',
    },
    {
        id: 'ACT-005',
        time: 'Yesterday',
        organisation: 'Quanta Fintech',
        actor: 'Ravi Menon',
        event: 'Payment method failed',
        area: 'Billing',
    },
    {
        id: 'ACT-006',
        time: 'Yesterday',
        organisation: 'Aurora AI Labs',
        actor: 'Elena Rostova',
        event: 'Created team workspace \'DeepNLP\'',
        area: 'Workspaces',
    },
    {
        id: 'ACT-007',
        time: '2d ago',
        organisation: 'Bluepeak Logistics',
        actor: 'Jonas Weber',
        event: 'Upgraded to Starter tier',
        area: 'Billing',
    },
    {
        id: 'ACT-008',
        time: '3d ago',
        organisation: 'Apex Global Finance',
        actor: 'Marcus Vance',
        event: 'Invited 4 new administrators',
        area: 'User Management',
    },
    {
        id: 'ACT-009',
        time: '4d ago',
        organisation: 'Solaris Energies',
        actor: 'Sofia Chen',
        event: 'Configured SSO via Okta',
        area: 'Security & Auth',
    },
    {
        id: 'ACT-010',
        time: '5d ago',
        organisation: 'Vertex Cyber',
        actor: 'Priya Sharma',
        event: 'API key revoked by admin',
        area: 'Security & Auth',
    },
];

export const CustomerActivity: React.FC = () => {
    const [activities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // Reset to page 1 whenever search query changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Filtered List based on Search (Defined BEFORE paginatedData)
    const filteredActivities = useMemo(() => {
        return activities.filter((item) => {
            if (searchQuery.trim() === '') return true;
            const query = searchQuery.toLowerCase();
            return (
                item.time.toLowerCase().includes(query) ||
                item.organisation.toLowerCase().includes(query) ||
                item.actor.toLowerCase().includes(query) ||
                item.event.toLowerCase().includes(query) ||
                item.area.toLowerCase().includes(query)
            );
        });
    }, [activities, searchQuery]);

    // Paginated Data Slice for Table
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredActivities.slice(start, start + pageSize);
    }, [filteredActivities, currentPage, pageSize]);

    // Table Columns Definition matching Mockup
    const columns: ColumnsType<ActivityItem> = [
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            width: 140,
            render: (time: string) => <span className="activity-time-text">{time}</span>,
        },
        {
            title: 'Organisation',
            dataIndex: 'organisation',
            key: 'organisation',
            width: 220,
            render: (organisation: string) => <span className="activity-org-text">{organisation}</span>,
        },
        {
            title: 'Actor',
            dataIndex: 'actor',
            key: 'actor',
            width: 200,
            render: (actor: string) => <span className="activity-actor-text">{actor}</span>,
        },
        {
            title: 'Event',
            dataIndex: 'event',
            key: 'event',
            render: (event: string) => <span className="activity-event-text">{event}</span>,
        },
        {
            title: 'Area',
            dataIndex: 'area',
            key: 'area',
            width: 160,
            render: (area: string) => <span className="activity-area-text">{area}</span>,
        },
    ];

    return (
        <div className="activity-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER
         ------------------------------------------------------------------- */}
            <div className="activity-header-row">
                <div className="activity-title-group">
                    <h1 className="activity-main-heading">
                        Customer Activity
                    </h1>
                    <span className="activity-subtitle-count">
                        Notable customer actions across the platform.
                    </span>
                </div>
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
                className="activity-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search Box)
         ------------------------------------------------------------------- */}
            <div className="activity-filter-toolbar">
                <Input
                    prefix={<Search size={14} style={{ color: '#94a3b8', marginRight: 4 }} />}
                    placeholder="Search customer activity"
                    className="activity-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                />
            </div>

            {/* -------------------------------------------------------------------
          ACTIVITY CARD & TABLE
         ------------------------------------------------------------------- */}
            <Card className="activity-table-card" styles={{ body: { padding: 0 } }}>
                <Table<ActivityItem>
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    size="small"
                    className="activity-data-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>

            {/* -------------------------------------------------------------------
          BOTTOM STANDALONE PAGINATION
         ------------------------------------------------------------------- */}
            <div className="activity-pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredActivities.length}
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

export default CustomerActivity;
