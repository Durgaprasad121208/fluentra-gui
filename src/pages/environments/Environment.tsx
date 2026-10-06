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
import './Environment.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type EnvironmentStatus = 'Healthy' | 'Degraded';

export interface EnvironmentItem {
    id: string;
    environment: string;
    region: string;
    organisations: number;
    version: string;
    status: EnvironmentStatus;
}

type FilterCategory = 'All' | 'Healthy' | 'Degraded';

// ---------------------------------------------------------------------------
// INITIAL DATASET (Matching Mockup Screenshot)
// ---------------------------------------------------------------------------
const INITIAL_ENVIRONMENTS: EnvironmentItem[] = [
    {
        id: 'env-1',
        environment: 'prod-eu-1',
        region: 'Frankfurt',
        organisations: 512,
        version: '2026.10.2',
        status: 'Healthy',
    },
    {
        id: 'env-2',
        environment: 'prod-us-1',
        region: 'Virginia',
        organisations: 604,
        version: '2026.10.2',
        status: 'Healthy',
    },
    {
        id: 'env-3',
        environment: 'prod-ap-1',
        region: 'Singapore',
        organisations: 168,
        version: '2026.10.1',
        status: 'Degraded',
    },
    {
        id: 'env-4',
        environment: 'staging',
        region: 'Frankfurt',
        organisations: 0,
        version: '2026.10.3-rc1',
        status: 'Healthy',
    },
];

export const Environment: React.FC = () => {
    const [environments] = useState<EnvironmentItem[]>(INITIAL_ENVIRONMENTS);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<FilterCategory>('All');

    // Filter Logic
    const filteredEnvironments = useMemo(() => {
        return environments.filter((env) => {
            const matchesSearch =
                env.environment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                env.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                env.version.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                filterCategory === 'All' || env.status === filterCategory;

            return matchesSearch && matchesCategory;
        });
    }, [environments, searchTerm, filterCategory]);

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['Environment', 'Region', 'Organisations', 'Version', 'Status'];
        const csvRows = [
            headers.join(','),
            ...filteredEnvironments.map((e) =>
                [
                    `"${e.environment}"`,
                    `"${e.region}"`,
                    `"${e.organisations}"`,
                    `"${e.version}"`,
                    `"${e.status}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `environments_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredEnvironments.length} environments to CSV.`,
            placement: 'topRight',
        });
    };

    // Table Columns Definition matching Mockup
    const columns: ColumnsType<EnvironmentItem> = [
        {
            title: 'Environment',
            dataIndex: 'environment',
            key: 'environment',
            width: 220,
            render: (text: string) => (
                <span className="env-name-text">{text}</span>
            ),
        },
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
            width: 200,
            render: (region: string) => (
                <span className="env-cell-text">{region}</span>
            ),
        },
        {
            title: 'Organisations',
            dataIndex: 'organisations',
            key: 'organisations',
            width: 180,
            render: (orgs: number) => (
                <span className="env-cell-text">{orgs}</span>
            ),
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            width: 190,
            render: (version: string) => (
                <span className="env-version-text">{version}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: EnvironmentStatus) => {
                if (status === 'Healthy') {
                    return (
                        <Tag className="env-status-tag status-healthy">
                            ● Healthy
                        </Tag>
                    );
                }
                return (
                    <Tag className="env-status-tag status-degraded">
                        ● Degraded
                    </Tag>
                );
            },
        },
    ];

    return (
        <div className="environments-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="environments-header-row">
                <div className="environments-title-group">
                    <h1 className="environments-main-heading">
                        Environments
                    </h1>
                    <span className="environments-subtitle">
                        Hosted platform regions and clusters.
                    </span>
                </div>

                <button
                    type="button"
                    className="environments-export-btn"
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
                className="environments-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search & Pill Tabs in a Single Row)
         ------------------------------------------------------------------- */}
            <Card className="environments-card" styles={{ body: { padding: 0 } }}>
                <div className="environments-filter-toolbar">
                    <div className="environments-filter-left">
                        <Input
                            placeholder="Search environments"
                            prefix={<Search size={14} className="environments-search-icon" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="environments-search-input"
                            allowClear
                        />

                        <div className="environments-pill-tabs">
                            <div
                                className={`environments-pill-item ${filterCategory === 'All' ? 'active' : ''}`}
                                onClick={() => setFilterCategory('All')}
                            >
                                All
                            </div>
                            <div
                                className={`environments-pill-item ${filterCategory === 'Healthy' ? 'active' : ''}`}
                                onClick={() => setFilterCategory('Healthy')}
                            >
                                Healthy
                            </div>
                            <div
                                className={`environments-pill-item ${filterCategory === 'Degraded' ? 'active' : ''}`}
                                onClick={() => setFilterCategory('Degraded')}
                            >
                                Degraded
                            </div>
                        </div>
                    </div>

                    <div className="environments-filter-right">
                        <span className="environments-count-badge">
                            {filteredEnvironments.length} of {environments.length}
                        </span>
                    </div>
                </div>

                {/* -------------------------------------------------------------------
            ENVIRONMENTS TABLE
           ------------------------------------------------------------------- */}
                <Table<EnvironmentItem>
                    columns={columns}
                    dataSource={filteredEnvironments}
                    rowKey="id"
                    size="small"
                    className="environments-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default Environment;
