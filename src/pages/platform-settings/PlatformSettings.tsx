import React, { useState } from 'react';
import {
    Card,
    Input,
    Select,
    Switch,
    Alert,
    notification,
} from 'antd';
import {
    Info,
} from 'lucide-react';
import { SubmitButton } from '../../components/custombutton/CustomButton';
import './PlatformSettings.css';

const { TextArea } = Input;

type SettingsTab =
    | 'company'
    | 'trials'
    | 'billing'
    | 'usage'
    | 'email'
    | 'branding'
    | 'security';

export const PlatformSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('trials');

    // Tab 1: Company Profile State
    const [companyName, setCompanyName] = useState('Fluentra Labs Inc.');
    const [supportEmail, setSupportEmail] = useState('support@fluentralabs.com');
    const [billingContact, setBillingContact] = useState('billing@fluentralabs.com');
    const [website, setWebsite] = useState('https://fluentralabs.com');

    // Tab 2: Trials & Currency State (Matches Mockup 1)
    const [trialDuration, setTrialDuration] = useState('14');
    const [defaultCurrency, setDefaultCurrency] = useState('USD');
    const [requireCardForTrial, setRequireCardForTrial] = useState(false);

    // Tab 3: Billing State (Matches Mockup 2)
    const [invoicePrefix, setInvoicePrefix] = useState('FL-INV-');
    const [paymentTerms, setPaymentTerms] = useState('Net 14');
    const [paymentRetries, setPaymentRetries] = useState('3');
    const [suspendAfterRetries, setSuspendAfterRetries] = useState(true);
    const [annualDiscount, setAnnualDiscount] = useState(true);

    // Tab 4: Usage Policies State (Matches Mockup 3)
    const [softLimitWarning, setSoftLimitWarning] = useState('80');
    const [overageBehaviour, setOverageBehaviour] = useState('Notify only');
    const [dataRetentionDays, setDataRetentionDays] = useState('365');
    const [fairUseRateLimiting, setFairUseRateLimiting] = useState(true);

    // Tab 5: Email Templates State (Matches Mockup 4)
    const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('Welcome email');
    const [emailBody, setEmailBody] = useState(
        'Hi {{firstName}},\n\nWelcome to Fluentra! Your workspace {{orgName}} is ready.'
    );

    // Tab 6: Branding State (Matches Branding Mockup)
    const [productName, setProductName] = useState('Fluentra');
    const [accentColor, setAccentColor] = useState('#70D64A');
    const [loginMessage, setLoginMessage] = useState('AI-powered innovation for engineering teams.');
    const [showPoweredBy, setShowPoweredBy] = useState(true);

    // Tab 7: Security State (Matches Security Mockup)
    const [requireMfaAdmin, setRequireMfaAdmin] = useState(true);
    const [requireMfaOrgOwners, setRequireMfaOrgOwners] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState('30');
    const [minPasswordLength, setMinPasswordLength] = useState('12');
    const [supportSessionMax, setSupportSessionMax] = useState('60 minutes');
    const [adminIpAllowlist, setAdminIpAllowlist] = useState('203.0.113.0/24\n198.51.100.0/24');

    // Save Settings Handler
    const handleSave = () => {
        notification.success({
            message: 'Settings Saved',
            description: 'Platform defaults and policies have been updated successfully.',
            placement: 'topRight',
        });
    };

    // Send Test Email Handler
    const handleSendTestEmail = () => {
        notification.info({
            message: 'Test Email Dispatched',
            description: `A preview of the "${selectedEmailTemplate}" template was sent to your administrator email.`,
            placement: 'topRight',
        });
    };

    return (
        <div className="platform-settings-root">
            {/* -------------------------------------------------------------------
          TOP HEADER WITH SAVE BUTTON
         ------------------------------------------------------------------- */}
            <div className="settings-header-row">
                <div className="settings-title-group">
                    <h1 className="settings-main-heading">
                        Platform Settings
                    </h1>
                    <span className="settings-subtitle">
                        Defaults and policies that apply across every Fluentra organisation.
                    </span>
                </div>

                <SubmitButton
                    onClick={handleSave}
                >
                    Save
                </SubmitButton>
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
                className="settings-demo-alert"
            />

            {/* -------------------------------------------------------------------
          SETTINGS MAIN LAYOUT: VERTICAL NAV + CARD BODY
         ------------------------------------------------------------------- */}
            <div className="settings-split-container">
                {/* Left Navigation Menu */}
                <div className="settings-side-nav">
                    <div
                        className={`settings-nav-item ${activeTab === 'company' ? 'active' : ''}`}
                        onClick={() => setActiveTab('company')}
                    >
                        Company profile
                    </div>
                    <div
                        className={`settings-nav-item ${activeTab === 'trials' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trials')}
                    >
                        Trials & currency
                    </div>
                    <div
                        className={`settings-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('billing')}
                    >
                        Billing
                    </div>
                    <div
                        className={`settings-nav-item ${activeTab === 'usage' ? 'active' : ''}`}
                        onClick={() => setActiveTab('usage')}
                    >
                        Usage policies
                    </div>
                    <div
                        className={`settings-nav-item ${activeTab === 'email' ? 'active' : ''}`}
                        onClick={() => setActiveTab('email')}
                    >
                        Email templates
                    </div>
                    <div
                        className={`settings-nav-item ${activeTab === 'branding' ? 'active' : ''}`}
                        onClick={() => setActiveTab('branding')}
                    >
                        Branding
                    </div>
                    <div
                        className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        Security
                    </div>
                </div>

                {/* Right Form Card */}
                <Card className="settings-content-card" styles={{ body: { padding: 0 } }}>
                    {/* -------------------------------------------------------------
              TAB: Company profile
             ------------------------------------------------------------- */}
                    {activeTab === 'company' && (
                        <div className="settings-pane">
                            <h2 className="settings-pane-title">Company profile</h2>

                            <div className="settings-form-group">
                                <div className="settings-field-row">
                                    <label className="settings-field-label">Company name</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="settings-input"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Support email</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={supportEmail}
                                            onChange={(e) => setSupportEmail(e.target.value)}
                                            className="settings-input"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Billing contact</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={billingContact}
                                            onChange={(e) => setBillingContact(e.target.value)}
                                            className="settings-input"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Primary website</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className="settings-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* -------------------------------------------------------------
              TAB: Trials & currency (Screenshot 1)
             ------------------------------------------------------------- */}
                    {activeTab === 'trials' && (
                        <div className="settings-pane">
                            <h2 className="settings-pane-title">Trials & currency</h2>

                            <div className="settings-form-group">
                                <div className="settings-field-row">
                                    <label className="settings-field-label">Default trial duration (days)</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={trialDuration}
                                            onChange={(e) => setTrialDuration(e.target.value)}
                                            className="settings-input settings-input-sm"
                                        />
                                        <span className="settings-field-caption">
                                            Applies to new organisations only.
                                        </span>
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Default currency</label>
                                    <div className="settings-field-control">
                                        <Select
                                            value={defaultCurrency}
                                            onChange={(val) => setDefaultCurrency(val)}
                                            className="settings-select"
                                            options={[
                                                { label: 'USD', value: 'USD' },
                                                { label: 'EUR', value: 'EUR' },
                                                { label: 'GBP', value: 'GBP' },
                                                { label: 'AUD', value: 'AUD' },
                                                { label: 'CAD', value: 'CAD' },
                                                { label: 'JPY', value: 'JPY' },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-center">
                                    <label className="settings-field-label">Require card for trial</label>
                                    <div className="settings-field-control">
                                        <Switch
                                            size="small"
                                            checked={requireCardForTrial}
                                            onChange={(val) => setRequireCardForTrial(val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* -------------------------------------------------------------
              TAB: Billing (Screenshot 2)
             ------------------------------------------------------------- */}
                    {activeTab === 'billing' && (
                        <div className="settings-pane">
                            <h2 className="settings-pane-title">Billing</h2>

                            <div className="settings-form-group">
                                <div className="settings-field-row">
                                    <label className="settings-field-label">Invoice prefix</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={invoicePrefix}
                                            onChange={(e) => setInvoicePrefix(e.target.value)}
                                            className="settings-input settings-input-md"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Payment terms</label>
                                    <div className="settings-field-control">
                                        <Select
                                            value={paymentTerms}
                                            onChange={(val) => setPaymentTerms(val)}
                                            className="settings-select"
                                            options={[
                                                { label: 'Net 14', value: 'Net 14' },
                                                { label: 'Net 30', value: 'Net 30' },
                                                { label: 'Due on receipt', value: 'Due on receipt' },
                                                { label: 'Net 60', value: 'Net 60' },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Payment retry attempts</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={paymentRetries}
                                            onChange={(e) => setPaymentRetries(e.target.value)}
                                            className="settings-input settings-input-sm"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-center">
                                    <label className="settings-field-label">Suspend after failed retries</label>
                                    <div className="settings-field-control">
                                        <Switch
                                            size="small"
                                            checked={suspendAfterRetries}
                                            onChange={(val) => setSuspendAfterRetries(val)}
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-center">
                                    <label className="settings-field-label">Annual billing discount (17%)</label>
                                    <div className="settings-field-control">
                                        <Switch
                                            size="small"
                                            checked={annualDiscount}
                                            onChange={(val) => setAnnualDiscount(val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* -------------------------------------------------------------
              TAB: Usage policies (Screenshot 3)
             ------------------------------------------------------------- */}
                    {activeTab === 'usage' && (
                        <div className="settings-pane">
                            <h2 className="settings-pane-title">Usage policies</h2>

                            <div className="settings-form-group">
                                <div className="settings-field-row">
                                    <label className="settings-field-label">Soft limit warning at</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={softLimitWarning}
                                            onChange={(e) => setSoftLimitWarning(e.target.value)}
                                            className="settings-input settings-input-sm"
                                        />
                                        <span className="settings-field-caption">
                                            % of plan allowance
                                        </span>
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Overage behaviour</label>
                                    <div className="settings-field-control">
                                        <Select
                                            value={overageBehaviour}
                                            onChange={(val) => setOverageBehaviour(val)}
                                            className="settings-select"
                                            options={[
                                                { label: 'Notify only', value: 'Notify only' },
                                                { label: 'Block usage', value: 'Block usage' },
                                                { label: 'Auto-upgrade', value: 'Auto-upgrade' },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Data retention (days)</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={dataRetentionDays}
                                            onChange={(e) => setDataRetentionDays(e.target.value)}
                                            className="settings-input settings-input-sm"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-center">
                                    <label className="settings-field-label">Fair-use AI rate limiting</label>
                                    <div className="settings-field-control">
                                        <Switch
                                            size="small"
                                            checked={fairUseRateLimiting}
                                            onChange={(val) => setFairUseRateLimiting(val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* -------------------------------------------------------------
              TAB: Email templates (Screenshot 4)
             ------------------------------------------------------------- */}
                    {activeTab === 'email' && (
                        <div className="settings-pane">
                            <h2 className="settings-pane-title">Email templates</h2>

                            <div className="settings-form-group">
                                <div className="settings-field-row">
                                    <label className="settings-field-label">Template</label>
                                    <div className="settings-field-control">
                                        <Select
                                            value={selectedEmailTemplate}
                                            onChange={(val) => setSelectedEmailTemplate(val)}
                                            className="settings-select settings-select-lg"
                                            options={[
                                                { label: 'Welcome email', value: 'Welcome email' },
                                                { label: 'Invoice receipt', value: 'Invoice receipt' },
                                                { label: 'Trial expiring', value: 'Trial expiring' },
                                                { label: 'Usage limit reached', value: 'Usage limit reached' },
                                                { label: 'Password reset', value: 'Password reset' },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-top">
                                    <label className="settings-field-label">Body</label>
                                    <div className="settings-field-control full-width">
                                        <TextArea
                                            rows={4}
                                            value={emailBody}
                                            onChange={(e) => setEmailBody(e.target.value)}
                                            className="settings-textarea"
                                        />
                                        <span className="settings-field-caption">
                                            Variables in {'{{double braces}}'} are filled per recipient.
                                        </span>
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <div className="settings-field-label" />
                                    <div className="settings-field-control">
                                        <button
                                            type="button"
                                            className="settings-test-email-btn"
                                            onClick={handleSendTestEmail}
                                        >
                                            Send test email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* -------------------------------------------------------------
              TAB: Branding (Matches User Screenshot)
             ------------------------------------------------------------- */}
                    {activeTab === 'branding' && (
                        <div className="settings-pane">
                            <h2 className="settings-pane-title">Branding</h2>

                            <div className="settings-form-group">
                                <div className="settings-field-row">
                                    <label className="settings-field-label">Product name</label>
                                    <div className="settings-field-control full-width">
                                        <Input
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            className="settings-input full-width-input"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-center">
                                    <label className="settings-field-label">Accent colour</label>
                                    <div className="settings-field-control">
                                        <div className="settings-color-input-wrap">
                                            <div
                                                className="settings-color-swatch"
                                                style={{ backgroundColor: accentColor }}
                                            />
                                            <Input
                                                value={accentColor}
                                                onChange={(e) => setAccentColor(e.target.value)}
                                                className="settings-input settings-input-color"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Login page message</label>
                                    <div className="settings-field-control full-width">
                                        <Input
                                            value={loginMessage}
                                            onChange={(e) => setLoginMessage(e.target.value)}
                                            className="settings-input full-width-input"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-center">
                                    <label className="settings-field-label">
                                        Show 'Powered by Fluentra' on customer portals
                                    </label>
                                    <div className="settings-field-control">
                                        <Switch
                                            size="small"
                                            checked={showPoweredBy}
                                            onChange={(val) => setShowPoweredBy(val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* -------------------------------------------------------------
              TAB: Security (Matches User Screenshot)
             ------------------------------------------------------------- */}
                    {activeTab === 'security' && (
                        <div className="settings-pane">
                            <h2 className="settings-pane-title">Security</h2>

                            <div className="settings-form-group">
                                <div className="settings-field-row align-center">
                                    <label className="settings-field-label">Require MFA for all administrators</label>
                                    <div className="settings-field-control">
                                        <Switch
                                            size="small"
                                            checked={requireMfaAdmin}
                                            onChange={(val) => setRequireMfaAdmin(val)}
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-center">
                                    <label className="settings-field-label">Require MFA for customer org owners</label>
                                    <div className="settings-field-control">
                                        <Switch
                                            size="small"
                                            checked={requireMfaOrgOwners}
                                            onChange={(val) => setRequireMfaOrgOwners(val)}
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Session timeout (minutes)</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={sessionTimeout}
                                            onChange={(e) => setSessionTimeout(e.target.value)}
                                            className="settings-input settings-input-sm"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Minimum password length</label>
                                    <div className="settings-field-control">
                                        <Input
                                            value={minPasswordLength}
                                            onChange={(e) => setMinPasswordLength(e.target.value)}
                                            className="settings-input settings-input-sm"
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row">
                                    <label className="settings-field-label">Support session max length</label>
                                    <div className="settings-field-control">
                                        <Select
                                            value={supportSessionMax}
                                            onChange={(val) => setSupportSessionMax(val)}
                                            className="settings-select"
                                            options={[
                                                { label: '15 minutes', value: '15 minutes' },
                                                { label: '30 minutes', value: '30 minutes' },
                                                { label: '60 minutes', value: '60 minutes' },
                                                { label: '120 minutes', value: '120 minutes' },
                                                { label: '240 minutes', value: '240 minutes' },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="settings-field-row align-top">
                                    <label className="settings-field-label">Admin IP allow-list</label>
                                    <div className="settings-field-control full-width">
                                        <TextArea
                                            rows={3}
                                            value={adminIpAllowlist}
                                            onChange={(e) => setAdminIpAllowlist(e.target.value)}
                                            className="settings-textarea font-mono"
                                        />
                                        <span className="settings-field-caption">
                                            One range per line (illustrative)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PlatformSettings;
