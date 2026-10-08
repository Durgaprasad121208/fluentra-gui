import React, { useState, useMemo } from 'react';
import { Table, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Search, Info } from 'lucide-react';
import './Logs.css';

export type LogSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogItem {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  service: string;
  executionId: string;
  message: string;
  details: Record<string, any>;
}

const INITIAL_LOGS: LogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-04 09:42:07.118',
    severity: 'INFO',
    service: 'employee-api',
    executionId: 'EXE-10482',
    message: 'POST /api/employees 201 in 184ms',
    details: {
      timestamp: '2026-10-04 09:42:07.118',
      severity: 'INFO',
      service: 'employee-api',
      executionId: 'EXE-10482',
      message: 'POST /api/employees 201 in 184ms',
      route: '/api/employees',
      method: 'POST',
      status: '201',
      user: 'pavan@fluentralabs.example',
    },
  },
  {
    id: 'log-2',
    timestamp: '2026-10-04 09:42:07.004',
    severity: 'DEBUG',
    service: 'employee-api',
    executionId: 'EXE-10482',
    message: 'Payload validated against Employee v1.1',
    details: {
      timestamp: '2026-10-04 09:42:07.004',
      severity: 'DEBUG',
      service: 'employee-api',
      executionId: 'EXE-10482',
      message: 'Payload validated against Employee v1.1',
      schema: 'Employee_v1.1.json',
      durationMs: 14,
      user: 'pavan@fluentralabs.example',
    },
  },
  {
    id: 'log-3',
    timestamp: '2026-10-04 09:31:12.640',
    severity: 'ERROR',
    service: 'leave-workflow',
    executionId: 'EXE-10481',
    message: 'Rule BR-002 violated: insufficient leave balance',
    details: {
      timestamp: '2026-10-04 09:31:12.640',
      severity: 'ERROR',
      service: 'leave-workflow',
      executionId: 'EXE-10481',
      message: 'Rule BR-002 violated: insufficient leave balance',
      ruleId: 'BR-002',
      entity: 'LeaveRequest',
      requestedDays: 5,
      availableDays: 2,
    },
  },
  {
    id: 'log-4',
    timestamp: '2026-10-04 09:31:10.221',
    severity: 'INFO',
    service: 'leave-workflow',
    executionId: 'EXE-10481',
    message: 'Workflow started for LR-2291',
    details: {
      timestamp: '2026-10-04 09:31:10.221',
      severity: 'INFO',
      service: 'leave-workflow',
      executionId: 'EXE-10481',
      message: 'Workflow started for LR-2291',
      workflowId: 'WF-LEAVE-01',
      requester: 'john.doe@fluentralabs.example',
    },
  },
  {
    id: 'log-5',
    timestamp: '2026-10-04 00:00:41.902',
    severity: 'INFO',
    service: 'accrual-scheduler',
    executionId: 'EXE-10480',
    message: '1,248 balances updated',
    details: {
      timestamp: '2026-10-04 00:00:41.902',
      severity: 'INFO',
      service: 'accrual-scheduler',
      executionId: 'EXE-10480',
      message: '1,248 balances updated',
      job: 'MonthlyAccrualJob',
      processedCount: 1248,
      skippedCount: 0,
      durationMs: 4190,
    },
  },
  {
    id: 'log-6',
    timestamp: '2026-10-03 18:13:22.015',
    severity: 'ERROR',
    service: 'payroll-export',
    executionId: 'EXE-10479',
    message: 'SFTP connection refused after 3 attempts',
    details: {
      timestamp: '2026-10-03 18:13:22.015',
      severity: 'ERROR',
      service: 'payroll-export',
      executionId: 'EXE-10479',
      message: 'SFTP connection refused after 3 attempts',
      host: 'sftp.payroll-partner.internal',
      port: 22,
      attempts: 3,
      error: 'ECONNREFUSED',
    },
  },
  {
    id: 'log-7',
    timestamp: '2026-10-03 18:12:58.310',
    severity: 'WARN',
    service: 'payroll-export',
    executionId: 'EXE-10479',
    message: 'Retrying SFTP upload (2/3)',
    details: {
      timestamp: '2026-10-03 18:12:58.310',
      severity: 'WARN',
      service: 'payroll-export',
      executionId: 'EXE-10479',
      message: 'Retrying SFTP upload (2/3)',
      host: 'sftp.payroll-partner.internal',
      attempt: 2,
      maxAttempts: 3,
    },
  },
  {
    id: 'log-8',
    timestamp: '2026-10-03 16:55:09.442',
    severity: 'INFO',
    service: 'idp-sync',
    executionId: 'EXE-10478',
    message: '12 users reconciled',
    details: {
      timestamp: '2026-10-03 16:55:09.442',
      severity: 'INFO',
      service: 'idp-sync',
      executionId: 'EXE-10478',
      message: '12 users reconciled',
      source: 'Okta SCIM',
      matched: 12,
      added: 0,
      updated: 12,
    },
  },
  {
    id: 'log-9',
    timestamp: '2026-10-03 15:10:22.118',
    severity: 'INFO',
    service: 'auth-service',
    executionId: 'EXE-10477',
    message: 'Token refreshed for admin user',
    details: {
      timestamp: '2026-10-03 15:10:22.118',
      severity: 'INFO',
      service: 'auth-service',
      executionId: 'EXE-10477',
      message: 'Token refreshed for admin user',
      user: 'pavan@fluentralabs.example',
      expiry: '2026-10-04T03:10:22Z',
    },
  },
  {
    id: 'log-10',
    timestamp: '2026-10-03 12:44:05.890',
    severity: 'WARN',
    service: 'employee-api',
    executionId: 'EXE-10476',
    message: 'Slow database query detected: 420ms',
    details: {
      timestamp: '2026-10-03 12:44:05.890',
      severity: 'WARN',
      service: 'employee-api',
      executionId: 'EXE-10476',
      message: 'Slow database query detected: 420ms',
      query: 'SELECT * FROM employees WHERE department_id = $1',
      durationMs: 420,
    },
  },
];

export const Logs: React.FC = () => {
  const [logs] = useState<LogItem[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeverity, setActiveSeverity] = useState<LogSeverity | 'ALL'>('ALL');

  // Calculate dynamic counts per severity
  const severityCounts = useMemo(() => {
    return {
      DEBUG: logs.filter((l) => l.severity === 'DEBUG').length,
      INFO: logs.filter((l) => l.severity === 'INFO').length,
      WARN: logs.filter((l) => l.severity === 'WARN').length,
      ERROR: logs.filter((l) => l.severity === 'ERROR').length,
    };
  }, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      // Severity Filter
      if (activeSeverity !== 'ALL' && item.severity !== activeSeverity) {
        return false;
      }

      // Search Query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        item.message.toLowerCase().includes(query) ||
        item.service.toLowerCase().includes(query) ||
        item.executionId.toLowerCase().includes(query) ||
        item.timestamp.toLowerCase().includes(query) ||
        item.severity.toLowerCase().includes(query)
      );
    });
  }, [logs, activeSeverity, searchQuery]);

  const toggleSeverity = (sev: LogSeverity) => {
    setActiveSeverity((prev) => (prev === sev ? 'ALL' : sev));
  };

  // Ant Design Table Columns Definition
  const columns: ColumnsType<LogItem> = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 220,
      render: (timestamp: string) => (
        <span className="log-timestamp">{timestamp}</span>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 110,
      render: (sev: LogSeverity) => {
        const sevClass = `log-sev-${sev.toLowerCase()}`;
        return (
          <span className={`log-severity-pill ${sevClass}`}>
            ● {sev}
          </span>
        );
      },
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      width: 170,
      render: (service: string) => (
        <span className="log-service">{service}</span>
      ),
    },
    {
      title: 'Execution',
      dataIndex: 'executionId',
      key: 'executionId',
      width: 130,
      render: (executionId: string) => (
        <span className="log-execution-link">{executionId}</span>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => (
        <span className="log-message">{message}</span>
      ),
    },
  ];

  return (
    <div className="logs-root">
      {/* Page Header */}
      <div className="logs-header">
        <h1 className="logs-heading">Logs</h1>
        <p className="logs-subheading">
          Structured runtime logs across services and executions.
        </p>
      </div>

      {/* Demonstration Banner */}
      <div className="logs-demo-banner">
        <Info size={15} className="logs-demo-icon" />
        <span>
          <strong>Demonstration data.</strong> These log lines are a static sample snapshot, not a live stream.
        </span>
      </div>

      {/* Toolbar: Search input + Severity Pills */}
      <div className="logs-toolbar">
        <div className="logs-search-wrapper">
          <Input
            prefix={<Search size={14} className="logs-search-icon" />}
            placeholder="Search message, service, execution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="logs-search-input"
          />
        </div>

        <div className="logs-severity-filters">
          {(['DEBUG', 'INFO', 'WARN', 'ERROR'] as LogSeverity[]).map((sev) => (
            <button
              key={sev}
              type="button"
              className={`logs-severity-btn ${activeSeverity === sev ? 'active' : ''}`}
              onClick={() => toggleSeverity(sev)}
            >
              <span>{sev}</span>
              <span className="logs-count-badge">{severityCounts[sev]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ant Design Table (size="small") with Expandable JSON rows */}
      <div className="logs-card">
        <Table<LogItem>
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          size="small"
          pagination={false}
          className="logs-table"
          expandable={{
            expandedRowRender: (record) => (
              <div className="log-expanded-container">
                <pre className="log-expanded-json">
                  {JSON.stringify(record.details, null, 2)}
                </pre>
              </div>
            ),
            rowExpandable: () => true,
          }}
        />
      </div>
    </div>
  );
};

export default Logs;
