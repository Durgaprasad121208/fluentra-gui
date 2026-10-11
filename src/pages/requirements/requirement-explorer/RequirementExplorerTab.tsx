import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, CheckCircle2 } from 'lucide-react';
import './RequirementExplorerTab.css';

interface ExplorerItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Business rule' | 'Functional' | 'Non-functional';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  status: 'Approved' | 'In Review' | 'Rejected' | 'Draft';
  version: string;
  isVerified?: boolean;
}

const EXPLORER_DATA: ExplorerItem[] = [
  {
    id: 'BR-001',
    title: 'Leave carry-forward',
    subtitle: 'A maximum of 15 earned leaves may carry over annually...',
    category: 'Business rule',
    priority: 'High',
    source: 'Leave_Policy_2026.docx · §4',
    status: 'Approved',
    version: 'v1.1',
    isVerified: true,
  },
  {
    id: 'BR-002',
    title: 'Probation leave',
    subtitle: 'Employees on probation limited to 3 consecutive days...',
    category: 'Business rule',
    priority: 'Medium',
    source: 'Leave_Policy_2026.docx · §5',
    status: 'In Review',
    version: 'v1.1',
  },
  {
    id: 'BR-003',
    title: 'Manager approval SLA',
    subtitle: 'Leave requests not decided within 72 hours auto-escalate...',
    category: 'Business rule',
    priority: 'Medium',
    source: 'HR_Process_Handbook.pdf · p.7',
    status: 'Rejected',
    version: 'v1.2',
  },
  {
    id: 'FR-001',
    title: 'Employee self-onboarding',
    subtitle: 'New hires shall complete bio and tax intake electronically...',
    category: 'Functional',
    priority: 'Critical',
    source: 'HR_Process_Handbook.pdf · p.4',
    status: 'Approved',
    version: 'v1.0',
    isVerified: true,
  },
  {
    id: 'FR-002',
    title: 'Leave request & approval',
    subtitle: 'Employees can submit single and multi-day PTO applications...',
    category: 'Functional',
    priority: 'Critical',
    source: 'Leave_Policy_2026.docx · §2',
    status: 'Approved',
    version: 'v1.1',
  },
  {
    id: 'FR-003',
    title: 'Biometric attendance sync',
    subtitle: 'Ingest raw gate card / biometric records from regional turnstiles...',
    category: 'Functional',
    priority: 'High',
    source: 'Attendance_SOP.docx · §1',
    status: 'In Review',
    version: 'v1.1',
  },
  {
    id: 'FR-004',
    title: 'Payroll export to Keka',
    subtitle: 'Automated end-of-month salary calculation feed formatting...',
    category: 'Functional',
    priority: 'High',
    source: 'Payroll_Interface_Spec.pdf · p.2',
    status: 'Draft',
    version: 'v1.2',
  },
  {
    id: 'FR-005',
    title: 'Performance review workflow',
    subtitle: 'Bi-annual appraisal cycles with 360-degree peer feedback...',
    category: 'Functional',
    priority: 'Medium',
    source: 'Appraisal_Policy.docx · §3',
    status: 'Approved',
    version: 'v1.0',
  },
  {
    id: 'FR-006',
    title: 'Emergency contact directory',
    subtitle: 'GDPR-compliant encrypted employee emergency dial directory...',
    category: 'Functional',
    priority: 'Low',
    source: 'Security_Guidelines.pdf · §2',
    status: 'In Review',
    version: 'v1.1',
  },
  {
    id: 'FR-007',
    title: 'Multi-office org chart',
    subtitle: 'Interactive hierarchical tree visualizer for all business units...',
    category: 'Functional',
    priority: 'Medium',
    source: 'Org_Design_Brief.docx · §1',
    status: 'Approved',
    version: 'v1.1',
  },
  {
    id: 'NFR-001',
    title: 'System availability SLA',
    subtitle: '99.9% availability during business hours 08:00 - 20:00 UTC...',
    category: 'Non-functional',
    priority: 'High',
    source: 'Cloud_Arch_Standards.pdf · p.9',
    status: 'Approved',
    version: 'v1.0',
  },
  {
    id: 'NFR-002',
    title: 'Response time',
    subtitle: 'Sub-200ms latency on core employee directory searches...',
    category: 'Non-functional',
    priority: 'High',
    source: 'Perf_Benchmark_v1.pdf · §4',
    status: 'Approved',
    version: 'v1.1',
  },
  {
    id: 'NFR-003',
    title: 'Data protection',
    subtitle: 'AES-256 encryption at rest and TLS 1.3 enforced for in-transit...',
    category: 'Non-functional',
    priority: 'Critical',
    source: 'Compliance_Mandate_2026.pdf · §5',
    status: 'In Review',
    version: 'v1.1',
  },
  {
    id: 'NFR-004',
    title: 'Accessibility',
    subtitle: 'WCAG 2.1 AA compliant color contrast and keyboard navigation...',
    category: 'Non-functional',
    priority: 'Medium',
    source: 'Design_System_Guide.pdf · p.12',
    status: 'Draft',
    version: 'v1.2',
  },
];

export const RequirementExplorerTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredItems = useMemo(() => {
    return EXPLORER_DATA.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === 'All' || item.category === categoryFilter;

      const matchesPri =
        priorityFilter === 'All' || item.priority === priorityFilter;

      return matchesSearch && matchesCat && matchesPri;
    });
  }, [searchQuery, categoryFilter, priorityFilter]);

  return (
    <div className="req-tab-explorer">
      {/* 1. Filter Bar */}
      <div className="req-explorer-filters-row">
        <div className="req-explorer-filters-left">
          <div className="req-search-input-wrap">
            <Search size={15} className="req-search-icon" />
            <input
              type="text"
              className="req-search-input"
              placeholder="Search ID, text or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="req-select-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All categories</option>
            <option value="Business rule">Business rule</option>
            <option value="Functional">Functional</option>
            <option value="Non-functional">Non-functional</option>
          </select>

          <select
            className="req-select-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="req-explorer-count">
          {filteredItems.length} of {EXPLORER_DATA.length}
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="req-table-wrapper">
        <table className="req-table">
          <thead>
            <tr>
              <th className="col-id">
                <div className="th-content">
                  ID <ArrowUpDown size={12} className="th-sort-icon" />
                </div>
              </th>
              <th className="col-desc">Description</th>
              <th className="col-cat">Category</th>
              <th className="col-pri">
                <div className="th-content">
                  Priority <ArrowUpDown size={12} className="th-sort-icon" />
                </div>
              </th>
              <th className="col-src">Source</th>
              <th className="col-status">
                <div className="th-content">
                  Status <ArrowUpDown size={12} className="th-sort-icon" />
                </div>
              </th>
              <th className="col-ver">
                <div className="th-content">
                  Version <ArrowUpDown size={12} className="th-sort-icon" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const statusClass =
                item.status === 'Approved'
                  ? 'status-approved'
                  : item.status === 'In Review'
                  ? 'status-in-review'
                  : item.status === 'Rejected'
                  ? 'status-rejected'
                  : 'status-draft';

              const priClass =
                item.priority === 'Critical'
                  ? 'pri-critical'
                  : item.priority === 'High'
                  ? 'pri-high'
                  : item.priority === 'Medium'
                  ? 'pri-medium'
                  : 'pri-low';

              const isAccentRow = item.status === 'Approved' && item.isVerified;

              return (
                <tr
                  key={item.id}
                  className={`req-table-row ${isAccentRow ? 'accent-approved' : ''}`}
                >
                  <td className="col-id">
                    <div className="id-cell">
                      <span className="id-text">{item.id}</span>
                      {item.isVerified && (
                        <CheckCircle2 size={13} className="id-verified-icon" />
                      )}
                    </div>
                  </td>
                  <td className="col-desc">
                    <div className="desc-cell">
                      <span className="desc-title">{item.title}</span>
                      <span className="desc-sub">{item.subtitle}</span>
                    </div>
                  </td>
                  <td className="col-cat">
                    <span className="cat-text">{item.category}</span>
                  </td>
                  <td className="col-pri">
                    <span className={`pri-pill ${priClass}`}>
                      <span className="pri-dot" />
                      {item.priority}
                    </span>
                  </td>
                  <td className="col-src">
                    <span className="src-text">{item.source}</span>
                  </td>
                  <td className="col-status">
                    <span className={`req-status-pill ${statusClass}`}>
                      <span className="req-status-dot" />
                      {item.status}
                    </span>
                  </td>
                  <td className="col-ver">
                    <span className="ver-text">{item.version}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequirementExplorerTab;
