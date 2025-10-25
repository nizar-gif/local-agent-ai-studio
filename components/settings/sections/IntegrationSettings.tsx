import React, { useState } from 'react';
import { EmailSettings, Job, EmailAccount } from '../../../types';
import { InputField, SectionTitle, SecretField, Toggle } from '../fields';
import { testImapConnection } from '../../../services/api';
import { SettingsSectionProps } from '../SettingsLayout';

interface Props extends SettingsSectionProps {
  settings: EmailSettings;
  addJob: (job: { name: string; message: string; }) => void;
}

type TestStatus = { [key: string]: { status: 'idle' | 'testing' | 'success' | 'error', message: string } };

const IntegrationSettings: React.FC<Props> = ({ settings, addJob, handleFieldChange, handleResetField, dirtyFields, overrideFields, searchTerm }) => {
    const [testStatuses, setTestStatuses] = useState<TestStatus>({});

    const handleAccountChange = (id: string, field: keyof EmailAccount, value: any) => {
        const accountIndex = settings.accounts.findIndex(acc => acc.id === id);
        if (accountIndex > -1) {
          const path = `email.accounts[${accountIndex}].${field}`;
          handleFieldChange(path, value);
        }
    };

    const runImapTest = async (account: EmailAccount) => {
        setTestStatuses(prev => ({ ...prev, [account.id]: { status: 'testing', message: 'Testing...' } }));
        try {
            const result = await testImapConnection(account);
            if (result.ok) {
                 setTestStatuses(prev => ({ ...prev, [account.id]: { status: 'success', message: result.message } }));
            } else {
                 setTestStatuses(prev => ({ ...prev, [account.id]: { status: 'error', message: result.message } }));
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            setTestStatuses(prev => ({ ...prev, [account.id]: { status: 'error', message } }));
        }
    };
    
    const testStatus = testStatuses[settings.accounts[0]?.id] || { status: 'idle', message: ''};

  return (
    <div>
      <SectionTitle
        title="Integrations"
        subtitle="Connect to external services like email accounts."
        searchTerm={searchTerm}
      />
      <div className="space-y-8">
        <div>
            <h4 className="font-semibold text-lg mb-4">Email Accounts</h4>
            <div className="p-6 border border-border rounded-lg space-y-4 bg-secondary/50 max-w-2xl">
                {settings.accounts.map((acc, index) => (
                    <div key={acc.id}>
                        <InputField label="IMAP Host" path={`email.accounts[${index}].imapHost`} value={acc.imapHost} onChange={(e) => handleAccountChange(acc.id, 'imapHost', e.target.value)} isDirty={dirtyFields.has(`email.accounts[${index}].imapHost`)} isOverride={overrideFields.has(`email.accounts[${index}].imapHost`)} onReset={() => handleResetField(`email.accounts[${index}].imapHost`)} searchTerm={searchTerm} />
                        <InputField label="IMAP Port" path={`email.accounts[${index}].imapPort`} type="number" value={acc.imapPort} onChange={(e) => handleAccountChange(acc.id, 'imapPort', parseInt(e.target.value, 10))} isDirty={dirtyFields.has(`email.accounts[${index}].imapPort`)} isOverride={overrideFields.has(`email.accounts[${index}].imapPort`)} onReset={() => handleResetField(`email.accounts[${index}].imapPort`)} searchTerm={searchTerm} />
                        <InputField label="Username" path={`email.accounts[${index}].username`} value={acc.username} onChange={(e) => handleAccountChange(acc.id, 'username', e.target.value)} isDirty={dirtyFields.has(`email.accounts[${index}].username`)} isOverride={overrideFields.has(`email.accounts[${index}].username`)} onReset={() => handleResetField(`email.accounts[${index}].username`)} searchTerm={searchTerm} />
                        <SecretField label="Password" path={`email.accounts[${index}].password`} value={acc.password || ''} onChange={(e) => handleAccountChange(acc.id, 'password', e.target.value)} isDirty={dirtyFields.has(`email.accounts[${index}].password`)} isOverride={overrideFields.has(`email.accounts[${index}].password`)} onReset={() => handleResetField(`email.accounts[${index}].password`)} searchTerm={searchTerm} />
                        <button onClick={() => runImapTest(acc)} className="text-sm font-semibold text-primary hover:text-primary-hover">{testStatus.status === 'testing' ? 'Testing...' : 'Test Connection'}</button>
                        {testStatus.message && <p className={`text-xs ${testStatus.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{testStatus.message}</p>}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;