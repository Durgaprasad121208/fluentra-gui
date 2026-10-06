import React, { useState, useMemo } from 'react';
import {
    Card,
    Table,
    Input,
    Select,
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
import './AuditLog.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type AuditResult = 'Success' | 'Failure' | 'Denied';

export interface AuditLogItem {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    target: string;
    organisation: string;
    ipAddress: string;
    result: AuditResult;
}

type ResultFilter = 'All' | 'Success' | 'Failure' | 'Denied';

// ---------------------------------------------------------------------------
// INITIAL DATASET (Matches Mockup Screenshot)
// ---------------------------------------------------------------------------
const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
    {
        id: 'log-1',
        timestamp: '06 Oct 2026, 09:32:41',
        actor: 'Pavan Kumar',
        action: 'Feature enabled',
        target: 'Requirements Intelligence override',
        organisation: 'Acme Corporation',
        ipAddress: '203.0.113.24',
        result: 'Success',
    },
    {
        id: 'log-2',
        timestamp: '04 Oct 2026, 09:02:11',
        actor: 'Pavan Kumar',
        action: 'Admin login',
        target: 'pavan@fluentralabs.com',
        organisation: 'FluentraLabs',
        ipAddress: '203.0.113.24',
        result: 'Success',
    },
    {
        id: 'log-3',
        timestamp: '04 Oct 2026, 08:47:30',
        actor: 'Leah Okafor',
        action: 'Support session ended',
        target: 'Acme Corporation workspace',
        organisation: 'Acme Corporation',
        ipAddress: '198.51.100.17',
        result: 'Success',
    },
    {
        id: 'log-4',
        timestamp: '04 Oct 2026, 08:25:04',
        actor: 'Leah Okafor',
        action: 'Support session started',
        target: 'Acme Corporation workspace',
        organisation: 'Acme Corporation',
        ipAddress: '198.51.100.17',
        result: 'Success',
    },
    {
        id: 'log-5',
        timestamp: '03 Oct 2026, 17:12:45',
        actor: 'Pavan Kumar',
        action: 'Feature enabled',
        target: 'Co-Architect (beta) override',
        organisation: 'Kestrel Insurance',
        ipAddress: '203.0.113.24',
        result: 'Success',
    },
    {
        id: 'log-6',
        timestamp: '03 Oct 2026, 15:40:09',
        actor: 'Marcus Hale',
        action: 'Plan changed',
        target: 'Starter → Professional',
        organisation: 'Quanta Fintech',
        ipAddress: '192.0.2.58',
        result: 'Success',
    },
    {
        id: 'log-7',
        timestamp: '03 Oct 2026, 11:03:56',
        actor: 'Marcus Hale',
        action: 'Subscription updated',
        target: 'Billing cycle Monthly → Annual',
        organisation: 'Meridian Bank',
        ipAddress: '192.0.2.58',
        result: 'Success',
    },
    {
        id: 'log-8',
        timestamp: '02 Oct 2026, 19:21:14',
        actor: 'Priya Nair',
        action: 'Usage limit changed',
        target: 'AI credits 25,000 → 40,000',
        organisation: 'Northwind Health',
        ipAddress: '198.51.100.90',
        result: 'Success',
    },
    {
        id: 'log-9',
        timestamp: '02 Oct 2026, 14:15:30',
        actor: 'Priya Nair',
        action: 'User invited',
        target: 'sarah.chen@northwind.health',
        organisation: 'Northwind Health',
        ipAddress: '198.51.100.90',
        result: 'Success',
    },
    {
        id: 'log-10',
        timestamp: '01 Oct 2026, 16:45:12',
        actor: 'Pavan Kumar',
        action: 'Security policy updated',
        target: 'Enforce MFA for all admins',
        organisation: 'FluentraLabs',
        ipAddress: '203.0.113.24',
        result: 'Success',
    },
    {
        id: 'log-11',
        timestamp: '01 Oct 2026, 10:12:00',
        actor: 'Marcus Hale',
        action: 'Coupon created',
        target: 'LAUNCH25 (25% off)',
        organisation: 'FluentraLabs',
        ipAddress: '192.0.2.58',
        result: 'Success',
    },
    {
        id: 'log-12',
        timestamp: '30 Sep 2026, 22:08:44',
        actor: 'Unknown Actor',
        action: 'Admin login',
        target: 'admin@fluentralabs.com',
        organisation: 'FluentraLabs',
        ipAddress: '198.51.100.222',
        result: 'Denied',
    },
];

export const AuditLog: React.FC = () => {
    const [auditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string>('All actions');
    const [selectedActor, setSelectedActor] = useState<string>('All actors');
    const [selectedResult, setSelectedResult] = useState<ResultFilter>('All');

    // Unique action types and actors for dropdown filters
    const actionOptions = useMemo(() => {
        const unique = Array.from(new Set(auditLogs.map((l) => l.action)));
        return [
            { label: 'All actions', value: 'All actions' },
            ...unique.map((act) => ({ label: act, value: act })),
        ];
    }, [auditLogs]);

    const actorOptions = useMemo(() => {
        const unique = Array.from(new Set(auditLogs.map((l) => l.actor)));
        return [
            { label: 'All actors', value: 'All actors' },
            ...unique.map((act) => ({ label: act, value: act })),
        ];
    }, [auditLogs]);

    // Filter Logic
    const filteredLogs = useMemo(() => {
        return auditLogs.filter((log) => {
            const matchesSearch =
                log.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesAction =
                selectedAction === 'All actions' || log.action === selectedAction;

            const matchesActor =
                selectedActor === 'All actors' || log.actor === selectedActor;

            const matchesResult =
                selectedResult === 'All' || log.result === selectedResult;

            return matchesSearch && matchesAction && matchesActor && matchesResult;
        });
    }, [auditLogs, searchTerm, selectedAction, selectedActor, selectedResult]);

    // Export CSV Handler
    const handleExportCSV = () => {
        const headers = ['Timestamp', 'Actor', 'Action', 'Target', 'Organisation', 'IP Address', 'Result'];
        const csvRows = [
            headers.join(','),
            ...filteredLogs.map((l) =>
                [
                    `"${l.timestamp}"`,
                    `"${l.actor}"`,
                    `"${l.action}"`,
                    `"${l.target}"`,
                    `"${l.organisation}"`,
                    `"${l.ipAddress}"`,
                    `"${l.result}"`,
                ].join(',')
            ),
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.success({
            message: 'Export Successful',
            description: `Exported ${filteredLogs.length} audit log entries to CSV.`,
            placement: 'topRight',
        });
    };

    // Columns Definition
    const columns: ColumnsType<AuditLogItem> = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 170,
            render: (timestamp: string) => (
                <span className="audit-timestamp-text">{timestamp}</span>
            ),
        },
        {
            title: 'Actor',
            dataIndex: 'actor',
            key: 'actor',
            width: 130,
            render: (actor: string) => (
                <span className="audit-actor-text">{actor}</span>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 170,
            render: (action: string) => (
                <span className="audit-action-text">{action}</span>
            ),
        },
        {
            title: 'Target',
            dataIndex: 'target',
            key: 'target',
            width: 250,
            ellipsis: true,
            render: (target: string) => (
                <span className="audit-target-text">{target}</span>
            ),
        },
        {
            title: 'Organisation',
            dataIndex: 'organisation',
            key: 'organisation',
            width: 160,
            render: (org: string) => (
                <span className="audit-org-text">{org}</span>
            ),
        },
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            width: 130,
            render: (ip: string) => (
                <span className="audit-ip-text">{ip}</span>
            ),
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            width: 110,
            render: (result: AuditResult) => {
                switch (result) {
                    case 'Success':
                        return <Tag className="audit-result-tag result-success">● Success</Tag>;
                    case 'Failure':
                        return <Tag className="audit-result-tag result-failure">● Failure</Tag>;
                    case 'Denied':
                        return <Tag className="audit-result-tag result-denied">● Denied</Tag>;
                    default:
                        return <Tag className="audit-result-tag">{result}</Tag>;
                }
            },
        },
    ];

    return (
        <div className="audit-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH EXPORT CSV BUTTON
         ------------------------------------------------------------------- */}
            <div className="audit-header-row">
                <div className="audit-title-group">
                    <h1 className="audit-main-heading">
                        Audit Logs
                    </h1>
                    <span className="audit-subtitle">
                        Every administrator action, who did it and from where.
                    </span>
                </div>

                <button
                    type="button"
                    className="audit-export-btn"
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
                        <strong>Demonstration data.</strong> Sample events plus actions you take in this prototype. IP addresses are illustrative documentation ranges.
                    </span>
                }
                type="info"
                showIcon
                icon={<Info size={15} />}
                className="audit-demo-alert"
            />

            {/* -------------------------------------------------------------------
          FILTER TOOLBAR (Search, Action & Actor Dropdowns, Pill Tabs)
         ------------------------------------------------------------------- */}
            <div className="audit-filter-toolbar">
                <Input
                    placeholder="Search events"
                    prefix={<Search size={14} className="audit-search-icon" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="audit-search-input"
                    allowClear
                />

                <Select
                    value={selectedAction}
                    onChange={(val) => setSelectedAction(val)}
                    options={actionOptions}
                    className="audit-filter-select"
                />

                <Select
                    value={selectedActor}
                    onChange={(val) => setSelectedActor(val)}
                    options={actorOptions}
                    className="audit-filter-select"
                />

                <div className="audit-pill-tabs">
                    <div
                        className={`audit-pill-item ${selectedResult === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedResult('All')}
                    >
                        All
                    </div>
                    <div
                        className={`audit-pill-item ${selectedResult === 'Success' ? 'active' : ''}`}
                        onClick={() => setSelectedResult('Success')}
                    >
                        Success
                    </div>
                    <div
                        className={`audit-pill-item ${selectedResult === 'Failure' ? 'active' : ''}`}
                        onClick={() => setSelectedResult('Failure')}
                    >
                        Failure
                    </div>
                    <div
                        className={`audit-pill-item ${selectedResult === 'Denied' ? 'active' : ''}`}
                        onClick={() => setSelectedResult('Denied')}
                    >
                        Denied
                    </div>
                </div>
            </div>

            {/* -------------------------------------------------------------------
            AUDIT LOGS TABLE CARD
           ------------------------------------------------------------------- */}
            <Card className="audit-table-card" styles={{ body: { padding: 0 } }}>
                <Table<AuditLogItem>
                    columns={columns}
                    dataSource={filteredLogs}
                    rowKey="id"
                    size="small"
                    className="audit-table"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default AuditLog;
