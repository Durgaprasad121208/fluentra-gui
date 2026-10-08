import React, { useState, useMemo } from 'react';
import { Table, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Search, Info } from 'lucide-react';
import './Execution.css';

export type ExecutionType = 'API' | 'Workflow' | 'Scheduler' | 'Batch' | 'Integration';
export type ExecutionStatus = 'Succeeded' | 'Failed' | 'Running';

export interface ExecutionRecord {
  id: string;
  code: string;
  name: string;
  type: ExecutionType;
  project: string;
  startedDate: string;
  startedTime: string;
  duration: string;
  status: ExecutionStatus;
  triggeredBy: string;
}

const INITIAL_EXECUTIONS: ExecutionRecord[] = [
  {
    id: 'exec-1',
    code: 'EXE-10482',
    name: 'POST /api/employees',
    type: 'API',
    project: 'Employee Management System',
    startedDate: '2026-10-04',
    startedTime: '09:42',
    duration: '184 ms',
    status: 'Succeeded',
    triggeredBy: 'Frontend Studio · Create Employee',
  },
  {
    id: 'exec-2',
    code: 'EXE-10481',
    name: 'Leave approval · LR-2291',
    type: 'Workflow',
    project: 'Employee Management System',
    startedDate: '2026-10-04',
    startedTime: '09:31',
    duration: '2.4 s',
    status: 'Failed',
    triggeredBy: 'Marcus Chen',
  },
  {
    id: 'exec-3',
    code: 'EXE-10480',
    name: 'Nightly leave-balance accrual',
    type: 'Scheduler',
    project: 'Employee Management System',
    startedDate: '2026-10-04',
    startedTime: '00:00',
    duration: '41 s',
    status: 'Succeeded',
    triggeredBy: 'Schedule · 0 0 * * *',
  },
  {
    id: 'exec-4',
    code: 'EXE-10479',
    name: 'Payroll export · September',
    type: 'Batch',
    project: 'Employee Management System',
    startedDate: '2026-10-03',
    startedTime: '18:10',
    duration: '3m 12s',
    status: 'Failed',
    triggeredBy: 'Priya Nair',
  },
  {
    id: 'exec-5',
    code: 'EXE-10478',
    name: 'User sync · Okta SCIM',
    type: 'Integration',
    project: 'Employee Management System',
    startedDate: '2026-10-03',
    startedTime: '16:55',
    duration: '1.2 s',
    status: 'Succeeded',
    triggeredBy: 'Webhook · Okta Provisioning',
  },
  {
    id: 'exec-6',
    code: 'EXE-10477',
    name: 'Refresh session cache',
    type: 'Scheduler',
    project: 'Employee Management System',
    startedDate: '2026-10-03',
    startedTime: '15:00',
    duration: '320 ms',
    status: 'Succeeded',
    triggeredBy: 'Schedule · */15 * * * *',
  },
];

export const Execution: React.FC = () => {
  const [executions] = useState<ExecutionRecord[]>(INITIAL_EXECUTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('Any date');

  // Filter Logic
  const filteredExecutions = useMemo(() => {
    return executions.filter((item) => {
      // Type Filter
      if (selectedType !== 'All' && item.type !== selectedType) {
        return false;
      }

      // Status Filter
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      // Search Query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.triggeredBy.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      );
    });
  }, [executions, selectedType, selectedStatus, searchQuery]);

  // Ant Design Table Columns Definition
  const columns: ColumnsType<ExecutionRecord> = [
    {
      title: 'Execution ID',
      dataIndex: 'code',
      key: 'code',
      width: 260,
      render: (_, record) => (
        <div className="exec-id-cell">
          <span className="exec-id-code">{record.code}</span>
          <span className="exec-id-desc">{record.name}</span>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: (type: ExecutionType) => (
        <span className="exec-type-pill">{type}</span>
      ),
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      width: 220,
      render: (project: string) => (
        <span className="exec-project-text">{project}</span>
      ),
    },
    {
      title: 'Started at',
      dataIndex: 'startedDate',
      key: 'startedAt',
      width: 140,
      render: (_, record) => (
        <div className="exec-started-cell">
          <span>{record.startedDate}</span>
          <span>{record.startedTime}</span>
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: string) => (
        <span className="exec-duration-text">{duration}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: ExecutionStatus) => {
        const statusClass = `exec-status-${status.toLowerCase()}`;
        return (
          <span className={`exec-status-pill ${statusClass}`}>
            ● {status}
          </span>
        );
      },
    },
    {
      title: 'Triggered by',
      dataIndex: 'triggeredBy',
      key: 'triggeredBy',
      render: (triggeredBy: string) => (
        <span className="exec-triggered-text">{triggeredBy}</span>
      ),
    },
  ];

  return (
    <div className="executions-root">
      {/* Header */}
      <div className="executions-header">
        <h1 className="executions-heading">Executions</h1>
        <p className="executions-subheading">
          Run history for APIs, workflows, schedulers, batch jobs and integrations.
        </p>
      </div>

      {/* Demonstration Banner */}
      <div className="executions-demo-banner">
        <Info size={15} className="executions-demo-icon" />
        <span>
          <strong>Demonstration data.</strong> Execution records are sample history, not live telemetry. Retry is simulated.
        </span>
      </div>

      {/* Toolbar: Search input + Select Dropdowns */}
      <div className="executions-toolbar">
        <div className="executions-search-wrapper">
          <Input
            prefix={<Search size={14} className="executions-search-icon" />}
            placeholder="Search ID, name, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="executions-search-input"
          />
        </div>

        {/* Type Select */}
        <Select
          value={selectedType}
          onChange={(val) => setSelectedType(val)}
          className="executions-filter-select"
          options={[
            { label: 'All', value: 'All' },
            { label: 'API', value: 'API' },
            { label: 'Workflow', value: 'Workflow' },
            { label: 'Scheduler', value: 'Scheduler' },
            { label: 'Batch', value: 'Batch' },
            { label: 'Integration', value: 'Integration' },
          ]}
        />

        {/* Status Select */}
        <Select
          value={selectedStatus}
          onChange={(val) => setSelectedStatus(val)}
          className="executions-filter-select"
          options={[
            { label: 'All', value: 'All' },
            { label: 'Succeeded', value: 'Succeeded' },
            { label: 'Failed', value: 'Failed' },
            { label: 'Running', value: 'Running' },
          ]}
        />

        {/* Date Select */}
        <Select
          value={selectedDate}
          onChange={(val) => setSelectedDate(val)}
          className="executions-filter-select"
          options={[
            { label: 'Any date', value: 'Any date' },
            { label: 'Today', value: 'Today' },
            { label: 'Last 7 days', value: 'Last 7 days' },
            { label: 'Last 30 days', value: 'Last 30 days' },
          ]}
        />
      </div>

      {/* Ant Design Small Free Table */}
      <Table<ExecutionRecord>
        columns={columns}
        dataSource={filteredExecutions}
        rowKey="id"
        size="small"
        pagination={false}
        className="executions-table"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default Execution;
