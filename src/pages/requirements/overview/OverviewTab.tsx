import React from 'react';
import { UploadCloud } from 'lucide-react';
import { CancelButton } from '../../../components/custombutton/CustomButton';
import './OverviewTab.css';

interface OverviewTabProps {
  onNavigateToExplorer?: () => void;
}

interface ProjectRequirementItem {
  id: string;
  title: string;
  status: 'Rejected' | 'In Review' | 'Approved' | 'Draft';
}

const PROJECT_REQUIREMENTS: ProjectRequirementItem[] = [
  { id: 'BR-003', title: 'Manager approval SLA', status: 'Rejected' },
  { id: 'BR-002', title: 'Probation leave', status: 'In Review' },
  { id: 'BR-001', title: 'Leave carry-forward', status: 'Approved' },
  { id: 'NFR-004', title: 'Accessibility', status: 'Draft' },
  { id: 'NFR-003', title: 'Data protection', status: 'In Review' },
  { id: 'NFR-002', title: 'Response time', status: 'Approved' },
];

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateToExplorer }) => {
  return (
    <div className="req-tab-overview">
      {/* 1. Stats row */}
      <div className="req-stats-card">
        <div className="req-stat-item">
          <span className="req-stat-label">Total requirements</span>
          <div className="req-stat-value-row">
            <span className="req-stat-number">14</span>
            <span className="req-stat-pill-inline pill-approved">5 approved</span>
          </div>
        </div>

        <div className="req-stat-divider" />

        <div className="req-stat-item">
          <span className="req-stat-label">Functional</span>
          <div className="req-stat-value-row">
            <span className="req-stat-number">7</span>
          </div>
        </div>

        <div className="req-stat-divider" />

        <div className="req-stat-item">
          <span className="req-stat-label">Non-functional</span>
          <div className="req-stat-value-row">
            <span className="req-stat-number">4</span>
          </div>
        </div>

        <div className="req-stat-divider" />

        <div className="req-stat-item">
          <span className="req-stat-label">Business rules</span>
          <div className="req-stat-value-row">
            <span className="req-stat-number">3</span>
          </div>
        </div>

        <div className="req-stat-divider" />

        <div className="req-stat-item">
          <span className="req-stat-label">Open questions</span>
          <div className="req-stat-value-row">
            <span className="req-stat-number">3</span>
            <span className="req-stat-pill-inline pill-blocking">blocking</span>
          </div>
        </div>

        <div className="req-stat-divider" />

        <div className="req-stat-item">
          <span className="req-stat-label">BRD versions</span>
          <div className="req-stat-value-row">
            <span className="req-stat-number">3</span>
            <span className="req-stat-pill-inline pill-version">v1.2</span>
          </div>
        </div>
      </div>

      {/* 2. Main Two Cards */}
      <div className="req-overview-grid">
        {/* Left card: Generate BRD from documents */}
        <div className="req-panel-card">
          <div className="req-panel-header">
            <h3 className="req-panel-title">Generate BRD from documents</h3>
            <span className="req-panel-subtitle">PDF, DOCX · up to 20 MB</span>
          </div>

          <div className="req-dropzone-box">
            <div className="req-dropzone-icon-wrap">
              <UploadCloud size={24} className="req-dropzone-icon" />
            </div>
            <h4 className="req-dropzone-title">
              Drop business documents here, or click to browse
            </h4>
            <p className="req-dropzone-desc">
              Policies, process handbooks, workshop notes, RFPs
            </p>
            <div className="req-dropzone-tags">
              <span className="req-file-pill">.pdf</span>
              <span className="req-file-pill">.docx</span>
            </div>
          </div>
        </div>

        {/* Right card: Project requirements */}
        <div className="req-panel-card">
          <div className="req-panel-header">
            <h3 className="req-panel-title">Project requirements</h3>
            <CancelButton
              size="small"
              className="req-panel-link-btn"
              onClick={onNavigateToExplorer}
            >
              View all
            </CancelButton>
          </div>

          <div className="req-list-container">
            {PROJECT_REQUIREMENTS.map((item) => {
              const statusClass =
                item.status === 'Approved'
                  ? 'status-approved'
                  : item.status === 'In Review'
                  ? 'status-in-review'
                  : item.status === 'Rejected'
                  ? 'status-rejected'
                  : 'status-draft';

              return (
                <div key={item.id} className="req-list-row">
                  <span className="req-list-id">{item.id}</span>
                  <span className="req-list-title">{item.title}</span>
                  <span className={`req-status-pill ${statusClass}`}>
                    <span className="req-status-dot" />
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
