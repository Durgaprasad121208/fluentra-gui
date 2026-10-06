import React, { useState } from 'react';
import {
    Card,
    Table,
    Switch,
    Tag,
    Alert,
    Select,
    Progress,
    notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    Info,
    Check,
    Plus,
    Trash2,
} from 'lucide-react';
import { SubmitButton } from '../../components/custombutton/CustomButton';
import { useTheme } from '../../theme/ThemeContext';
import './Features.css';

// ---------------------------------------------------------------------------
// DATA MODEL & TYPES
// ---------------------------------------------------------------------------
type FeatureTab = 'global' | 'overrides' | 'beta' | 'adoption';

export interface FeatureEntitlement {
    id: string;
    feature: string;
    global: boolean;
    freeTrial: boolean;
    starter: boolean;
    professional: boolean;
    enterprise: boolean;
    stage: 'GA' | 'Beta';
}

export interface OrgOverride {
    id: string;
    organisation: string;
    feature: string;
    state: 'Forced on' | 'Forced off';
}

export interface BetaFeature {
    id: string;
    title: string;
    active: boolean;
    betaOrganisations: string[];
}

export interface AdoptionMetric {
    feature: string;
    percentage: number;
    count: number;
}

// ---------------------------------------------------------------------------
// INITIAL STATIC DATASETS (Matches Mockup Screenshots)
// ---------------------------------------------------------------------------
const INITIAL_ENTITLEMENTS: FeatureEntitlement[] = [
    {
        id: 'feat-1',
        feature: 'Requirements Intelligence',
        global: true,
        freeTrial: true,
        starter: true,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-2',
        feature: 'BRD Generation',
        global: true,
        freeTrial: true,
        starter: true,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-3',
        feature: 'Development Planning',
        global: true,
        freeTrial: false,
        starter: true,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-4',
        feature: 'Co-Architect',
        global: true,
        freeTrial: false,
        starter: false,
        professional: true,
        enterprise: true,
        stage: 'Beta',
    },
    {
        id: 'feat-5',
        feature: 'Data Model Designer',
        global: true,
        freeTrial: false,
        starter: true,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-6',
        feature: 'API Designer',
        global: true,
        freeTrial: false,
        starter: true,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-7',
        feature: 'Workflow Designer',
        global: true,
        freeTrial: false,
        starter: false,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-8',
        feature: 'Frontend Studio',
        global: true,
        freeTrial: false,
        starter: false,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-9',
        feature: 'Code Generation',
        global: true,
        freeTrial: false,
        starter: true,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-10',
        feature: 'Scheduler Designer',
        global: true,
        freeTrial: false,
        starter: false,
        professional: true,
        enterprise: true,
        stage: 'Beta',
    },
    {
        id: 'feat-11',
        feature: 'Batch Job Designer',
        global: true,
        freeTrial: false,
        starter: false,
        professional: true,
        enterprise: true,
        stage: 'Beta',
    },
    {
        id: 'feat-12',
        feature: 'Test Automation',
        global: true,
        freeTrial: false,
        starter: true,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
    {
        id: 'feat-13',
        feature: 'Security Scanning',
        global: true,
        freeTrial: false,
        starter: false,
        professional: true,
        enterprise: true,
        stage: 'GA',
    },
];

const INITIAL_OVERRIDES: OrgOverride[] = [
    {
        id: 'ovr-1',
        organisation: 'Kestrel Insurance',
        feature: 'Co-Architect',
        state: 'Forced on',
    },
    {
        id: 'ovr-2',
        organisation: 'Quanta Fintech',
        feature: 'Frontend Studio',
        state: 'Forced off',
    },
];

const ALL_ORGANISATIONS = [
    'Acme Corporation',
    'Northwind Health',
    'Bluepeak Logistics',
    'Helio Retail',
    'Quanta Fintech',
    'Meridian Bank',
    'Kestrel Insurance',
    'Orchid Labs',
];

const INITIAL_BETA_FEATURES: BetaFeature[] = [
    {
        id: 'beta-1',
        title: 'Co-Architect',
        active: true,
        betaOrganisations: ['Acme Corporation', 'Kestrel Insurance'],
    },
    {
        id: 'beta-2',
        title: 'Scheduler Designer',
        active: true,
        betaOrganisations: ['Northwind Health'],
    },
    {
        id: 'beta-3',
        title: 'Batch Job Designer',
        active: true,
        betaOrganisations: [],
    },
];

const ADOPTION_METRICS: AdoptionMetric[] = [
    { feature: 'Requirements Intelligence', percentage: 91, count: 1168 },
    { feature: 'BRD Generation', percentage: 87, count: 1117 },
    { feature: 'Version Management', percentage: 82, count: 1053 },
    { feature: 'Development Planning', percentage: 74, count: 950 },
    { feature: 'Data Model Designer', percentage: 63, count: 809 },
    { feature: 'API Designer', percentage: 58, count: 745 },
    { feature: 'Co-Architect', percentage: 52, count: 668 },
    { feature: 'Frontend Studio', percentage: 46, count: 591 },
    { feature: 'Workflow Designer', percentage: 41, count: 526 },
    { feature: 'Test Automation', percentage: 35, count: 449 },
];

export const Features: React.FC = () => {
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<FeatureTab>('global');

    // Tab 1 State
    const [entitlements, setEntitlements] = useState<FeatureEntitlement[]>(INITIAL_ENTITLEMENTS);

    // Tab 2 State
    const [overrides, setOverrides] = useState<OrgOverride[]>(INITIAL_OVERRIDES);
    const [selectedOrg, setSelectedOrg] = useState<string>('Acme Corporation');
    const [selectedFeature, setSelectedFeature] = useState<string>('Requirements Intelligence');
    const [selectedState, setSelectedState] = useState<'Forced on' | 'Forced off'>('Forced on');

    // Tab 3 State
    const [betaFeatures, setBetaFeatures] = useState<BetaFeature[]>(INITIAL_BETA_FEATURES);

    // Toggle Global Feature
    const handleToggleGlobal = (id: string, checked: boolean) => {
        setEntitlements((prev) =>
            prev.map((item) => (item.id === id ? { ...item, global: checked } : item))
        );
    };

    // Toggle Tier Entitlement
    const handleTogglePlan = (
        id: string,
        tier: 'freeTrial' | 'starter' | 'professional' | 'enterprise'
    ) => {
        setEntitlements((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [tier]: !item[tier] } : item
            )
        );
    };

    // Add Override Handler
    const handleAddOverride = () => {
        if (!selectedOrg || !selectedFeature) return;
        const newOverride: OrgOverride = {
            id: `ovr-${Date.now()}`,
            organisation: selectedOrg,
            feature: selectedFeature,
            state: selectedState,
        };
        setOverrides((prev) => [newOverride, ...prev]);
        notification.success({
            message: 'Override Added',
            description: `Added override for ${selectedOrg} on ${selectedFeature} (${selectedState}).`,
            placement: 'topRight',
        });
    };

    // Delete Override Handler
    const handleDeleteOverride = (id: string) => {
        setOverrides((prev) => prev.filter((o) => o.id !== id));
        notification.info({
            message: 'Override Removed',
            description: 'The organisation override has been removed.',
            placement: 'topRight',
        });
    };

    // Toggle Beta Organisation
    const handleToggleBetaOrg = (featureId: string, orgName: string) => {
        setBetaFeatures((prev) =>
            prev.map((feat) => {
                if (feat.id !== featureId) return feat;
                const isSelected = feat.betaOrganisations.includes(orgName);
                const updated = isSelected
                    ? feat.betaOrganisations.filter((o) => o !== orgName)
                    : [...feat.betaOrganisations, orgName];
                return { ...feat, betaOrganisations: updated };
            })
        );
    };

    // Toggle Beta Feature Switch
    const handleToggleBetaSwitch = (featureId: string, checked: boolean) => {
        setBetaFeatures((prev) =>
            prev.map((feat) => (feat.id === featureId ? { ...feat, active: checked } : feat))
        );
    };

    // Tab 1 Table Columns
    const entitlementColumns: ColumnsType<FeatureEntitlement> = [
        {
            title: 'Feature',
            dataIndex: 'feature',
            key: 'feature',
            width: 240,
            render: (feat: string) => <span className="feature-name-text">{feat}</span>,
        },
        {
            title: 'Global',
            dataIndex: 'global',
            key: 'global',
            width: 90,
            render: (checked: boolean, record) => (
                <Switch
                    size="small"
                    checked={checked}
                    onChange={(val) => handleToggleGlobal(record.id, val)}
                />
            ),
        },
        {
            title: 'Free Trial',
            dataIndex: 'freeTrial',
            key: 'freeTrial',
            width: 110,
            align: 'center',
            render: (checked: boolean, record) => (
                <span
                    className={`feature-check-icon ${checked ? 'checked' : 'unchecked'}`}
                    onClick={() => handleTogglePlan(record.id, 'freeTrial')}
                    role="button"
                    tabIndex={0}
                >
                    {checked && <Check size={11} strokeWidth={3.2} />}
                </span>
            ),
        },
        {
            title: 'Starter',
            dataIndex: 'starter',
            key: 'starter',
            width: 100,
            align: 'center',
            render: (checked: boolean, record) => (
                <span
                    className={`feature-check-icon ${checked ? 'checked' : 'unchecked'}`}
                    onClick={() => handleTogglePlan(record.id, 'starter')}
                    role="button"
                    tabIndex={0}
                >
                    {checked && <Check size={11} strokeWidth={3.2} />}
                </span>
            ),
        },
        {
            title: 'Professional',
            dataIndex: 'professional',
            key: 'professional',
            width: 120,
            align: 'center',
            render: (checked: boolean, record) => (
                <span
                    className={`feature-check-icon ${checked ? 'checked' : 'unchecked'}`}
                    onClick={() => handleTogglePlan(record.id, 'professional')}
                    role="button"
                    tabIndex={0}
                >
                    {checked && <Check size={11} strokeWidth={3.2} />}
                </span>
            ),
        },
        {
            title: 'Enterprise',
            dataIndex: 'enterprise',
            key: 'enterprise',
            width: 120,
            align: 'center',
            render: (checked: boolean, record) => (
                <span
                    className={`feature-check-icon ${checked ? 'checked' : 'unchecked'}`}
                    onClick={() => handleTogglePlan(record.id, 'enterprise')}
                    role="button"
                    tabIndex={0}
                >
                    {checked && <Check size={11} strokeWidth={3.2} />}
                </span>
            ),
        },
        {
            title: 'Stage',
            dataIndex: 'stage',
            key: 'stage',
            width: 100,
            render: (stage: 'GA' | 'Beta') => {
                if (stage === 'GA') {
                    return <Tag className="feature-stage-tag stage-ga">● GA</Tag>;
                }
                return <Tag className="feature-stage-tag stage-beta">● Beta</Tag>;
            },
        },
    ];

    return (
        <div className="features-page-root">
            {/* -------------------------------------------------------------------
          TOP HEADER
         ------------------------------------------------------------------- */}
            <div className="features-header-row">
                <h1 className="features-main-heading">
                    Feature Management
                </h1>
                <span className="features-subtitle-count">
                    Control what every organisation can use — globally, per plan and per organisation.
                </span>
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
                className="features-demo-alert"
            />

            {/* -------------------------------------------------------------------
          TAB PILLS NAVIGATION
         ------------------------------------------------------------------- */}
            <div className="features-nav-tabs">
                <div
                    className={`features-nav-pill ${activeTab === 'global' ? 'active' : ''}`}
                    onClick={() => setActiveTab('global')}
                >
                    Global & plans
                </div>
                <div
                    className={`features-nav-pill ${activeTab === 'overrides' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overrides')}
                >
                    Organisation overrides
                </div>
                <div
                    className={`features-nav-pill ${activeTab === 'beta' ? 'active' : ''}`}
                    onClick={() => setActiveTab('beta')}
                >
                    Beta access
                </div>
                <div
                    className={`features-nav-pill ${activeTab === 'adoption' ? 'active' : ''}`}
                    onClick={() => setActiveTab('adoption')}
                >
                    Adoption
                </div>
            </div>

            {/* -------------------------------------------------------------------
          TAB CONTENT
         ------------------------------------------------------------------- */}

            {/* TAB 1: Global & Plans */}
            {activeTab === 'global' && (
                <Card className="features-card" styles={{ body: { padding: 0 } }}>
                    <div className="features-card-header">
                        <h2 className="features-card-title">Feature entitlements</h2>
                    </div>
                    <Table<FeatureEntitlement>
                        columns={entitlementColumns}
                        dataSource={entitlements}
                        rowKey="id"
                        size="small"
                        className="features-table"
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                    />
                </Card>
            )}

            {/* TAB 2: Organisation Overrides */}
            {activeTab === 'overrides' && (
                <Card className="features-card" styles={{ body: { padding: 0 } }}>
                    <div className="features-card-header">
                        <h2 className="features-card-title">Organisation overrides</h2>
                    </div>

                    {/* Builder Form Row */}
                    <div className="override-form-row">
                        <Select
                            className="override-select"
                            value={selectedOrg}
                            onChange={(val) => setSelectedOrg(val)}
                            options={ALL_ORGANISATIONS.map((org) => ({ label: org, value: org }))}
                        />

                        <Select
                            className="override-select"
                            value={selectedFeature}
                            onChange={(val) => setSelectedFeature(val)}
                            options={INITIAL_ENTITLEMENTS.map((e) => ({ label: e.feature, value: e.feature }))}
                        />

                        <Select
                            className="override-select"
                            value={selectedState}
                            onChange={(val) => setSelectedState(val)}
                            options={[
                                { label: 'Force on', value: 'Forced on' },
                                { label: 'Force off', value: 'Forced off' },
                            ]}
                        />

                        <SubmitButton
                            className="override-add-btn"
                            icon={<Plus size={14} />}
                            onClick={handleAddOverride}
                        >
                            Add override
                        </SubmitButton>
                    </div>

                    {/* Overrides List */}
                    <div className="overrides-list">
                        {overrides.map((item) => (
                            <div key={item.id} className="override-item-row">
                                <div className="override-item-left">
                                    <span className="override-org-name">{item.organisation}</span>
                                    <span className="override-feature-name">{item.feature}</span>
                                    <Tag
                                        className={`feature-stage-tag ${item.state === 'Forced on' ? 'override-tag-on' : 'override-tag-off'}`}
                                    >
                                        ● {item.state}
                                    </Tag>
                                </div>
                                <button
                                    type="button"
                                    className="override-delete-btn"
                                    onClick={() => handleDeleteOverride(item.id)}
                                    title="Delete override"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* TAB 3: Beta Access */}
            {activeTab === 'beta' && (
                <div className="beta-grid">
                    {betaFeatures.map((feature) => (
                        <div key={feature.id} className="beta-card">
                            <div className="beta-card-top">
                                <h3 className="beta-card-title">{feature.title}</h3>
                                <Switch
                                    size="small"
                                    checked={feature.active}
                                    onChange={(checked) => handleToggleBetaSwitch(feature.id, checked)}
                                />
                            </div>

                            <div className="beta-orgs-section">
                                <span className="beta-orgs-label">Beta organisations</span>
                                <div className="beta-org-pills-wrap">
                                    {ALL_ORGANISATIONS.map((org) => {
                                        const isSelected = feature.betaOrganisations.includes(org);
                                        return (
                                            <div
                                                key={org}
                                                className={`beta-org-pill ${isSelected ? 'selected' : ''}`}
                                                onClick={() => handleToggleBetaOrg(feature.id, org)}
                                            >
                                                {org}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <span className="beta-card-footer-note">
                                Switch off to promote to general availability.
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 4: Adoption */}
            {activeTab === 'adoption' && (
                <Card className="features-card" styles={{ body: { padding: 0 } }}>
                    <div className="features-card-header">
                        <h2 className="features-card-title">
                            Feature adoption · share of active organisations (Illustrative)
                        </h2>
                    </div>

                    <div className="adoption-list">
                        {ADOPTION_METRICS.map((item) => (
                            <div key={item.feature} className="adoption-item-row">
                                <span className="adoption-feature-name">{item.feature}</span>
                                <div className="adoption-progress-container">
                                    <Progress
                                        percent={item.percentage}
                                        showInfo={false}
                                        strokeColor={isDark ? '#ffffff' : '#0f172a'}
                                        trailColor={isDark ? '#1e293b' : '#e2e8f0'}
                                        size={['100%', 6]}
                                        className="adoption-progress-bar"
                                    />
                                </div>
                                <div className="adoption-metrics">
                                    {item.percentage}% · {item.count}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Features;
