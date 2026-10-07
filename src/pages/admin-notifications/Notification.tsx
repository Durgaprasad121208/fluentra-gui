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
} from 'lucide-react';
import './Notification.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
export type NotificationStatus = 'Enabled' | 'Disabled';

export interface NotificationRuleItem {
    id: string;
    alert: string;
    channel: string;
    status: NotificationStatus;
}

type FilterStatus = 'All' | 'Disabled' | 'Enabled';

// ---------------------------------------------------------------------------
// INITIAL DATASET (Matches Mockup Screenshot)
// ---------------------------------------------------------------------------
const INITIAL_NOTIFICATIONS: NotificationRuleItem[] = [
    {
        id: 'notif-1',
        alert: 'Payment failed',
        channel: 'Email · #billing',
        status: 'Disabled',
    },
    {
        id: 'notif-2',
        alert: 'Service degraded',
        channel: 'PagerDuty · #ops',
        status: 'Enabled',
    },
    {
        id: 'notif-3',
        alert: 'New Enterprise signup',
        channel: 'Email',
        status: 'Enabled',
    },
    {
        id: 'notif-4',
        alert: 'Trial expiring',
        channel: 'Weekly digest',
        status: 'Disabled',
    },
];

export const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationRuleItem[]>(INITIAL_NOTIFICATIONS);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');

    // Filter Logic
    const filteredNotifications = useMemo(() => {
        return notifications.filter((item) => {
            const matchesSearch =
                item.alert.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.channel.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'All' || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [notifications, searchTerm, statusFilter]);

    // Toggle Status Handler
    const handleToggleStatus = (item: NotificationRuleItem) => {
        const nextStatus: NotificationStatus = item.status === 'Enabled' ? 'Disabled' : 'Enabled';
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === item.id ? { ...notif, status: nextStatus } : notif
            )
        );
        notification.success({
            message: 'Notification Updated',
            description: `Alert "${item.alert}" is now ${nextStatus.toLowerCase()}.`,
            placement: 'topRight',
        });
    };

    // Columns Definition
    const columns: ColumnsType<NotificationRuleItem> = [
        {
            title: 'Alert',
            dataIndex: 'alert',
            key: 'alert',
            width: 320,
            render: (text: string) => (
                <span className="notif-alert-text">{text}</span>
            ),
        },
        {
            title: 'Channel',
            dataIndex: 'channel',
            key: 'channel',
            render: (channel: string) => (
                <span className="notif-channel-text">{channel}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: NotificationStatus, record: NotificationRuleItem) => {
                if (status === 'Enabled') {
                    return (
                        <Tag
                            className="notif-status-tag status-enabled"
                            onClick={() => handleToggleStatus(record)}
                        >
                            ● Enabled
                        </Tag>
                    );
                }
                return (
                    <Tag
                        className="notif-status-tag status-disabled"
                        onClick={() => handleToggleStatus(record)}
                    >
                        ● Disabled
                    </Tag>
                );
            },
        },
    ];

    return (
        <div className="admin-notifications-root">
            {/* -------------------------------------------------------------------
          TOP HEADER
         ------------------------------------------------------------------- */}
            <div className="notif-header-row">
                <div className="notif-title-group">
                    <h1 className="notif-main-heading">
                        Notifications
                    </h1>
                    <span className="notif-subtitle">
                        Alert routing for the admin team.
                    </span>
                </div>
            </div>

            {/* Demonstration Alert Banner */}
            <Alert
                message={
                    <span style={{ fontSize: 12 }}>
                        <strong>Demonstration data.</strong> Nothing here reflects real systems; actions only change this prototype's local state.
                    </span>
                }
                type="info"
                showIcon
                icon={<Info size={15} />}
                className="notif-demo-alert"
            />

            {/* Standalone Filter Toolbar directly above the table card */}
            <div className="notif-filter-toolbar">
                <div className="notif-toolbar-left">
                    <Input
                        placeholder="Search notifications"
                        prefix={<Search size={15} style={{ color: '#64748b', marginRight: 4 }} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        className="notif-search-input"
                    />

                    <div className="notif-pills-group">
                        <button
                            type="button"
                            className={`notif-pill ${statusFilter === 'All' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('All')}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            className={`notif-pill ${statusFilter === 'Disabled' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('Disabled')}
                        >
                            Disabled
                        </button>
                        <button
                            type="button"
                            className={`notif-pill ${statusFilter === 'Enabled' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('Enabled')}
                        >
                            Enabled
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <Card className="notif-table-card" styles={{ body: { padding: 0 } }}>
                <Table
                    columns={columns}
                    dataSource={filteredNotifications}
                    rowKey="id"
                    pagination={false}
                    className="notif-table"
                />
            </Card>
        </div>
    );
};

export default Notification;
