import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Pagination,
  Input,
  Select,
  Drawer,
  Form,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Search,
  Plus,
  ArrowDownUp,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import { SubmitButton, CancelButton } from '../../components/custombutton/CustomButton';
import './Project.css';

export type ProjectStatus = 'On track' | 'At risk' | 'Planning';

export interface ProjectItem {
  id: string;
  code: string;
  name: string;
  description: string;
  owner: string;
  ownerInitials: string;
  stage: string;
  progress: number;
  status: ProjectStatus;
  updated: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    code: 'EMS',
    name: 'Employee Management System',
    description:
      'Unified HR platform for onboarding, leave, payroll sync and performance reviews across...',
    owner: 'Pavan Kumar',
    ownerInitials: 'PK',
    stage: 'Architecture',
    progress: 55,
    status: 'On track',
    updated: '18h ago',
  },
  {
    id: 'proj-2',
    code: 'THA',
    name: 'ThermalAI',
    description:
      'Predictive thermal anomaly detection for industrial furnaces using sensor telemetry and...',
    owner: 'Aanya Rao',
    ownerInitials: 'AR',
    stage: 'Planning',
    progress: 34,
    status: 'At risk',
    updated: '20h ago',
  },
  {
    id: 'proj-3',
    code: 'CUP',
    name: 'Customer Portal',
    description:
      'Self-service portal for account management, invoices, support tickets and usage analytics.',
    owner: 'Marcus Lee',
    ownerInitials: 'ML',
    stage: 'Validate',
    progress: 88,
    status: 'On track',
    updated: '2d ago',
  },
  {
    id: 'proj-4',
    code: 'VEN',
    name: 'Vendor Onboarding',
    description:
      'Supplier KYC, contract intake and compliance checks for procurement.',
    owner: 'Priya Nair',
    ownerInitials: 'PN',
    stage: 'Requirements',
    progress: 7,
    status: 'Planning',
    updated: '4d ago',
  },
];

type ViewMode = 'list' | 'grid';

export const Project: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All statuses');
  const [ownerFilter, setOwnerFilter] = useState<string>('All owners');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Create Project Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // Unique owners for filter
  const ownerOptions = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.owner)));
    return [
      { label: 'All owners', value: 'All owners' },
      ...unique.map((o) => ({ label: o, value: o })),
    ];
  }, [projects]);

  // Filtered and Sorted Projects
  const filteredProjects = useMemo(() => {
    let result = projects.filter((item) => {
      // Status filter
      if (statusFilter !== 'All statuses' && item.status !== statusFilter) {
        return false;
      }

      // Owner filter
      if (ownerFilter !== 'All owners' && item.owner !== ownerFilter) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.stage.toLowerCase().includes(q)
      );
    });

    // Sorting
    if (sortBy === 'newest') {
      // already in newest order by default
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'progress') {
      result = [...result].sort((a, b) => b.progress - a.progress);
    }

    return result;
  }, [projects, searchQuery, statusFilter, ownerFilter, sortBy]);

  // Paginated Projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProjects.slice(startIndex, startIndex + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  // Handle Create Project Submit
  const handleCreateProject = async (values: any) => {
    const initials = values.owner
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      code: '',
      name: values.name,
      description: values.description || 'Project created in FluentraLabs workspace.',
      owner: values.owner,
      ownerInitials: initials || 'FL',
      stage: values.stage || 'Requirements',
      progress: 0,
      status: 'Planning',
      updated: 'Just now',
    };

    setProjects([newProject, ...projects]);
    setIsDrawerOpen(false);
    form.resetFields();
    notification.success({
      message: 'Project Created',
      description: `Project "${newProject.name}" has been created successfully.`,
      placement: 'topRight',
    });
  };

  // Helper for Status Pill Class
  const getStatusClass = (status: ProjectStatus) => {
    switch (status) {
      case 'On track':
        return 'project-status-ontrack';
      case 'At risk':
        return 'project-status-atrisk';
      case 'Planning':
      default:
        return 'project-status-planning';
    }
  };

  // Ant Design Table Columns for List View
  const columns: ColumnsType<ProjectItem> = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (_, record) => (
        <div
          className="table-project-cell clickable-project-cell"
          onClick={() => navigate(`/workspace/projects/${record.id}`)}
        >
          <span className="table-project-name">{record.name}</span>
          <div className="table-project-desc" title={record.description}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: '18%',
      render: (_, record) => (
        <div className="project-owner-info">
          <div className="project-owner-avatar">{record.ownerInitials}</div>
          <span className="project-owner-name">{record.owner}</span>
        </div>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      width: '14%',
      render: (stage: string) => (
        <span className="project-stage-name">{stage}</span>
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: '15%',
      render: (progress: number) => (
        <div className="table-progress-cell">
          <div className="table-progress-track">
            <div
              className="table-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="table-progress-percent">{progress}%</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status: ProjectStatus) => (
        <span className={`project-status-pill ${getStatusClass(status)}`}>
          <span className="status-dot" />
          {status}
        </span>
      ),
    },
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
      width: '7%',
      render: (updated: string) => (
        <span className="project-updated-text">{updated}</span>
      ),
    },
  ];

  return (
    <div className="projects-root">
      {/* Header */}
      <div className="projects-header">
        <div className="projects-title-group">
          <h1 className="projects-heading">Projects</h1>
          <p className="projects-subheading">
            {projects.length} projects in FluentraLabs workspace
          </p>
        </div>

        <SubmitButton
          icon={<Plus size={15} style={{ marginRight: 4 }} />}
          onClick={() => setIsDrawerOpen(true)}
        >
          Create project
        </SubmitButton>
      </div>

      {/* Toolbar */}
      <div className="projects-toolbar">
        <div className="projects-toolbar-left">
          {/* Search */}
          <div className="projects-search-wrapper">
            <Input
              prefix={<Search size={14} className="projects-search-icon" />}
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              allowClear
              className="projects-search-input"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            className="projects-filter-select"
            options={[
              { label: 'All statuses', value: 'All statuses' },
              { label: 'On track', value: 'On track' },
              { label: 'At risk', value: 'At risk' },
              { label: 'Planning', value: 'Planning' },
            ]}
          />

          {/* Owner Filter */}
          <Select
            value={ownerFilter}
            onChange={(val) => {
              setOwnerFilter(val);
              setCurrentPage(1);
            }}
            className="projects-filter-select"
            options={ownerOptions}
          />

          {/* Sort Dropdown */}
          <Select
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            className="projects-sort-select"
            prefix={<ArrowDownUp size={13} className="projects-sort-prefix-icon" />}
            suffixIcon={null}
            options={[
              { label: 'Updated: Newest', value: 'newest' },
              { label: 'Name: A to Z', value: 'name' },
              { label: 'Progress: High to Low', value: 'progress' },
            ]}
          />
        </div>

        {/* View Mode Switcher (List vs Grid) */}
        <div className="projects-view-switcher">
          <button
            type="button"
            className={`projects-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <ListIcon size={16} />
          </button>
          <button
            type="button"
            className={`projects-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredProjects.length === 0 ? (
        <div className="projects-empty-state">
          No projects match your current filters.
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View using Ant Design Card */
        <div className="projects-grid">
          {paginatedProjects.map((project) => (
            <Card
              key={project.id}
              className="project-card clickable-project-card"
              bordered={false}
              onClick={() => navigate(`/workspace/projects/${project.id}`)}
            >
              {/* Card Header: Status Pill */}
              <div className="project-card-header" style={{ justifyContent: 'flex-end' }}>
                <span
                  className={`project-status-pill ${getStatusClass(
                    project.status
                  )}`}
                >
                  <span className="status-dot" />
                  {project.status}
                </span>
              </div>

              {/* Title & Description */}
              <div className="project-card-main">
                <h3 className="project-card-title" title={project.name}>
                  {project.name}
                </h3>
                <p className="project-card-desc" title={project.description}>
                  {project.description}
                </p>
              </div>

              {/* Stage & Progress Bar */}
              <div className="project-card-progress-section">
                <div className="project-card-progress-labels">
                  <span className="project-stage-name">{project.stage}</span>
                  <span className="project-progress-percent">
                    {project.progress}%
                  </span>
                </div>
                <div className="project-progress-bar-track">
                  <div
                    className="project-progress-bar-fill"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Card Footer: Owner Info + Updated Timestamp */}
              <div className="project-card-footer">
                <div className="project-owner-info">
                  <div className="project-owner-avatar">
                    {project.ownerInitials}
                  </div>
                  <span className="project-owner-name">{project.owner}</span>
                </div>
                <span className="project-updated-text">{project.updated}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View inside sleek container */
        <div className="projects-table-container">
          <Table<ProjectItem>
            columns={columns}
            dataSource={paginatedProjects}
            rowKey="id"
            size="small"
            pagination={false}
            className="projects-table"
            scroll={{ x: 'max-content' }}
            onRow={(record) => ({
              onClick: () => navigate(`/workspace/projects/${record.id}`),
            })}
          />
        </div>
      )}

      {/* Ant Design Pagination Component */}
      <div className="projects-pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredProjects.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            if (size) setPageSize(size);
          }}
          showSizeChanger
          pageSizeOptions={['10', '20', '50']}
          size="small"
        />
      </div>

      {/* Create Project Drawer */}
      <Drawer
        title="Create New Project"
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          form.resetFields();
        }}
        width={480}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateProject}
          style={{ marginTop: 8 }}
        >
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input placeholder="e.g. Employee Management System" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={3}
              placeholder="Brief description of the project..."
            />
          </Form.Item>

          <Form.Item
            name="owner"
            label="Owner"
            rules={[{ required: true, message: 'Please enter owner name' }]}
            initialValue="Pavan Kumar"
          >
            <Input placeholder="e.g. Pavan Kumar" />
          </Form.Item>

          <Form.Item
            name="stage"
            label="Initial Stage"
            initialValue="Requirements"
          >
            <Select
              options={[
                { label: 'Requirements', value: 'Requirements' },
                { label: 'Planning', value: 'Planning' },
                { label: 'Architecture', value: 'Architecture' },
                { label: 'Validate', value: 'Validate' },
              ]}
            />
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 24,
            }}
          >
            <CancelButton onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </CancelButton>
            <SubmitButton htmlType="submit">Create Project</SubmitButton>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default Project;
