import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  MoreHorizontal,
  Sparkles,
  Check,
  X,
  FileText,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import './ProjectInfo.css';

interface LifecycleStep {
  id: number;
  name: string;
  status: 'Complete' | 'In progress' | 'Not started';
  progress: number;
  isCurrent?: boolean;
}

interface ApprovalItem {
  id: string;
  tag: string;
  tagType: 'blue' | 'slate' | 'green';
  title: string;
  author: string;
  due: string;
}

interface ArtefactItem {
  id: string;
  title: string;
  version: string;
  updated: string;
}

interface ActivityItem {
  id: string;
  avatar: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  status: 'Healthy' | 'In design' | 'Degraded';
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  { id: 1, name: 'Requirements', status: 'Complete', progress: 100 },
  { id: 2, name: 'Planning', status: 'Complete', progress: 100 },
  { id: 3, name: 'Architecture', status: 'In progress', progress: 82, isCurrent: true },
  { id: 4, name: 'Build', status: 'In progress', progress: 46 },
  { id: 5, name: 'Validate', status: 'Not started', progress: 0 },
  { id: 6, name: 'Release', status: 'Not started', progress: 0 },
];

const APPROVALS: ApprovalItem[] = [
  {
    id: 'app-1',
    tag: 'BRD',
    tagType: 'blue',
    title: 'BRD v2 · Leave & attendance',
    author: 'Co-Architect',
    due: 'due Today',
  },
  {
    id: 'app-2',
    tag: 'Architecture',
    tagType: 'slate',
    title: 'Payroll sync service design',
    author: 'Marcus Lee',
    due: 'due Tomorrow',
  },
  {
    id: 'app-3',
    tag: 'Frontend',
    tagType: 'green',
    title: 'Employee profile page proposal',
    author: 'Priya Nair',
    due: 'due Oct 6',
  },
];

const ARTEFACTS: ArtefactItem[] = [
  {
    id: 'art-1',
    title: 'Business Requirements Document',
    version: 'v2.1',
    updated: '8m ago',
  },
  {
    id: 'art-2',
    title: 'Employee service OpenAPI spec',
    version: 'v0.6',
    updated: '1h ago',
  },
  {
    id: 'art-3',
    title: 'System context diagram',
    version: 'v3',
    updated: 'Yesterday',
  },
  {
    id: 'art-4',
    title: 'Onboarding flow wireframes',
    version: 'v1.4',
    updated: '2d ago',
  },
];

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    avatar: 'C',
    actor: 'Co-Architect',
    action: 'generated BRD',
    target: 'Leave & attendance v2',
    time: '8m',
  },
  {
    id: 'act-2',
    avatar: 'PK',
    actor: 'Pavan Kumar',
    action: 'approved requirement',
    target: 'REQ-118 Role-based access',
    time: '34m',
  },
  {
    id: 'act-3',
    avatar: 'ML',
    actor: 'Marcus Lee',
    action: 'updated API definition',
    target: 'POST /employees/{id}/leave',
    time: '1h',
  },
  {
    id: 'act-4',
    avatar: 'PN',
    actor: 'Priya Nair',
    action: 'created new page',
    target: 'Org chart explorer',
    time: '2h',
  },
];

const COMPONENTS: ComponentItem[] = [
  {
    id: 'comp-1',
    name: 'employee-service',
    description: 'Spring Boot service',
    status: 'Healthy',
  },
  {
    id: 'comp-2',
    name: 'payroll-sync',
    description: 'Integration worker',
    status: 'In design',
  },
  {
    id: 'comp-3',
    name: 'hr-portal-web',
    description: 'React SPA',
    status: 'Healthy',
  },
  {
    id: 'comp-4',
    name: 'identity-gateway',
    description: 'SSO / OIDC',
    status: 'Degraded',
  },
  {
    id: 'comp-5',
    name: 'hr-postgres',
    description: 'PostgreSQL 16',
    status: 'Healthy',
  },
];

// Project metadata dictionary to support different project routes
const PROJECTS_DATA: Record<string, any> = {
  'proj-1': {
    code: 'EMS',
    name: 'Employee Management System',
    description:
      'Unified HR platform for onboarding, leave, payroll sync and performance reviews across 4,200 employees.',
    owner: 'Pavan Kumar',
    version: 'v0.8.2',
    env: 'Development',
    updated: '19h ago',
    stack: 'React + Java Spring',
    progress: 55,
    status: 'On track',
  },
  'proj-2': {
    code: 'THA',
    name: 'ThermalAI',
    description:
      'Predictive thermal anomaly detection for industrial furnaces using sensor telemetry and...',
    owner: 'Aanya Rao',
    version: 'v0.4.1',
    env: 'Staging',
    updated: '20h ago',
    stack: 'Python + PyTorch + FastAPI',
    progress: 34,
    status: 'At risk',
  },
  'proj-3': {
    code: 'CUP',
    name: 'Customer Portal',
    description:
      'Self-service portal for account management, invoices, support tickets and usage analytics.',
    owner: 'Marcus Lee',
    version: 'v1.2.0',
    env: 'Production',
    updated: '2d ago',
    stack: 'Next.js + Node + PostgreSQL',
    progress: 88,
    status: 'On track',
  },
  'proj-4': {
    code: 'VEN',
    name: 'Vendor Onboarding',
    description:
      'Supplier KYC, contract intake and compliance checks for procurement.',
    owner: 'Priya Nair',
    version: 'v0.1.0',
    env: 'Development',
    updated: '4d ago',
    stack: 'React + NestJS',
    progress: 7,
    status: 'Planning',
  },
};

export const ProjectInfo: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();

  // Resolve project details or fallback to default EMS
  const project = (projectId && PROJECTS_DATA[projectId]) || PROJECTS_DATA['proj-1'];

  return (
    <div className="project-info-root">
      {/* 1. Header & Breadcrumbs */}
      <div className="project-info-header">
        <div className="project-info-breadcrumbs">
          <Link to="/workspace/projects" className="breadcrumb-link">
            Projects
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{project.code}</span>
        </div>

        <div className="project-info-title-row">
          <div className="project-info-heading-group">
            <h1 className="project-info-title">{project.name}</h1>
            <span className="project-status-pill project-status-ontrack">
              <span className="status-dot" />
              {project.status}
            </span>
          </div>

          <div className="project-info-actions">
            <button
              type="button"
              className="project-info-more-btn"
              title="More options"
            >
              <MoreHorizontal size={18} />
            </button>
            <button
              type="button"
              className="project-info-action-btn"
              onClick={() => {}}
            >
              <Sparkles size={15} className="sparkle-icon" />
              Continue with Co-Architect
            </button>
          </div>
        </div>

        <p className="project-info-desc">{project.description}</p>

        {/* Metadata stats bar */}
        <div className="project-info-meta-bar">
          <div className="meta-bar-item">
            <span className="meta-bar-label">Environment</span>
            <span className="meta-bar-val">{project.env}</span>
          </div>
          <div className="meta-bar-item">
            <span className="meta-bar-label">Version</span>
            <span className="meta-bar-val">{project.version}</span>
          </div>
          <div className="meta-bar-item">
            <span className="meta-bar-label">Owner</span>
            <span className="meta-bar-val">{project.owner}</span>
          </div>
          <div className="meta-bar-item">
            <span className="meta-bar-label">Last updated</span>
            <span className="meta-bar-val">{project.updated}</span>
          </div>
          <div className="meta-bar-item">
            <span className="meta-bar-label">Stack</span>
            <span className="meta-bar-val">{project.stack}</span>
          </div>
          <div className="meta-bar-item">
            <span className="meta-bar-label">Overall</span>
            <span className="meta-bar-val">{project.progress}%</span>
          </div>
        </div>
      </div>

      {/* 2. Engineering Lifecycle Section */}
      <div className="project-lifecycle-card">
        <h2 className="lifecycle-card-title">Engineering lifecycle</h2>

        <div className="lifecycle-stepper">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isComplete = step.status === 'Complete';
            const isInProgress = step.status === 'In progress';

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`lifecycle-step-item ${
                    step.isCurrent ? 'current-step' : ''
                  }`}
                >
                  <div className="step-item-top">
                    {isComplete ? (
                      <CheckCircle2 size={16} className="step-complete-icon" />
                    ) : (
                      <span className="step-number-badge">{step.id}</span>
                    )}
                    <span className="step-name">{step.name}</span>
                  </div>

                  <div className="step-item-status-row">
                    <span
                      className={`step-status-pill ${
                        isComplete
                          ? 'complete'
                          : isInProgress
                          ? 'in-progress'
                          : 'not-started'
                      }`}
                    >
                      <span className="step-dot" />
                      {step.status}
                    </span>
                  </div>

                  <div className="step-progress-track">
                    <div
                      className={`step-progress-fill ${
                        isComplete ? 'complete' : isInProgress ? 'in-progress' : ''
                      }`}
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                  <span className="step-percent-text">{step.progress}%</span>
                </div>

                {idx < LIFECYCLE_STEPS.length - 1 && (
                  <div className="lifecycle-chevron-divider">
                    <ChevronRight size={16} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. 2x2 Grid of Detail Cards */}
      <div className="project-detail-grid">
        {/* Card 1: Pending Approvals */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">Pending approvals</h3>
            <button type="button" className="detail-card-link">
              View all
            </button>
          </div>

          <div className="approvals-list">
            {APPROVALS.map((item) => (
              <div key={item.id} className="approval-row">
                <div className="approval-left">
                  <span className={`approval-tag tag-${item.tagType}`}>
                    <span className="tag-dot" />
                    {item.tag}
                  </span>
                  <div className="approval-info">
                    <h4 className="approval-title">{item.title}</h4>
                    <span className="approval-sub">
                      {item.author} · {item.due}
                    </span>
                  </div>
                </div>

                <div className="approval-actions">
                  <button
                    type="button"
                    className="approval-action-btn reject"
                    title="Reject"
                  >
                    <X size={14} />
                  </button>
                  <button
                    type="button"
                    className="approval-action-btn approve"
                    title="Approve"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Recent Artefacts */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">Recent artefacts</h3>
          </div>

          <div className="artefacts-list">
            {ARTEFACTS.map((art) => (
              <div key={art.id} className="artefact-row">
                <div className="artefact-left">
                  <FileText size={16} className="artefact-icon" />
                  <span className="artefact-title">{art.title}</span>
                </div>
                <div className="artefact-right">
                  <span className="artefact-version">{art.version}</span>
                  <span className="artefact-time">{art.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Recent Activity */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">Recent activity</h3>
          </div>

          <div className="activity-list">
            {ACTIVITIES.map((act) => (
              <div key={act.id} className="activity-row">
                <div className="activity-avatar">{act.avatar}</div>
                <div className="activity-content">
                  <span className="activity-actor">{act.actor}</span>
                  <span className="activity-action">{act.action}</span>
                  <span className="activity-target">{act.target}</span>
                </div>
                <span className="activity-time">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Project Components */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">Project components</h3>
            <span className="detail-card-sub-header">Architecture</span>
          </div>

          <div className="components-list">
            {COMPONENTS.map((comp) => {
              const statusClass =
                comp.status === 'Healthy'
                  ? 'comp-healthy'
                  : comp.status === 'In design'
                  ? 'comp-indesign'
                  : 'comp-degraded';

              return (
                <div key={comp.id} className="component-row">
                  <div className="component-left">
                    <span className="component-name">{comp.name}</span>
                    <span className="component-desc">{comp.description}</span>
                  </div>

                  <span className={`component-status-pill ${statusClass}`}>
                    <span className="comp-dot" />
                    {comp.status}
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

export default ProjectInfo;
