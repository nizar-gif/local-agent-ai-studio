import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ArrowPathIcon, QuestionMarkCircleIcon } from '../shared/Icons';

// --- START HELPER FUNCTIONS ---
const shouldShowField = (searchTerm: string, ...texts: (string | undefined)[]) => {
  if (!searchTerm?.trim()) return true;
  const lowerSearch = searchTerm.toLowerCase();
  return texts.some(text => text && text.toLowerCase().includes(lowerSearch));
};

const highlightText = (text: string | undefined, searchTerm: string) => {
  if (!searchTerm?.trim() || !text) return text;
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={i} className="bg-primary/50 text-white px-0.5 rounded-sm">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
};
// --- END HELPER FUNCTIONS ---


type BaseFieldProps = {
    label: string;
    path: string;
    description?: string;
    error?: string;
    isDirty?: boolean;
    isOverride?: boolean;
    onReset?: () => void;
    tooltip?: string;
    searchTerm?: string;
};

type InputFieldProps = BaseFieldProps & (
    (Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> & { type?: React.HTMLInputTypeAttribute; rows?: never }) |
    (React.ComponentPropsWithoutRef<'textarea'> & { type?: never; rows: number })
);


export const InputField: React.FC<InputFieldProps> = ({ label, path, description, error, isDirty, isOverride, onReset, tooltip, searchTerm, ...props }) => {
    if (!shouldShowField(searchTerm || '', label, description, tooltip)) return null;

    const isTextarea = 'rows' in props && props.rows;
    const dirtyClass = isDirty ? 'border-yellow-400/50 ring-1 ring-yellow-400/50' : 'border-border';
    const className = `mt-1 block w-full bg-secondary border ${dirtyClass} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm read-only:bg-secondary/50 disabled:opacity-50`;

    return (
        <div className="relative">
            <FieldLabel label={label} isDirty={isDirty} isOverride={isOverride} onReset={onReset} name={props.id || props.name} tooltip={tooltip} searchTerm={searchTerm} />
            {isTextarea ? (
                <textarea
                    {...(props as React.ComponentPropsWithoutRef<'textarea'>)}
                    className={className}
                />
            ) : (
                 <input
                    {...(props as React.ComponentPropsWithoutRef<'input'>)}
                    className={className}
                />
            )}
            {description && <p className="mt-2 text-xs text-text-secondary">{highlightText(description, searchTerm || '')}</p>}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
};

type SecretFieldProps = BaseFieldProps & Omit<React.ComponentPropsWithoutRef<'input'>, 'type'>;

export const SecretField: React.FC<SecretFieldProps> = ({ label, path, description, error, isDirty, isOverride, onReset, tooltip, searchTerm, ...props }) => {
    if (!shouldShowField(searchTerm || '', label, description, tooltip)) return null;
    
    const [isVisible, setIsVisible] = useState(false);
    const dirtyClass = isDirty ? 'border-yellow-400/50 ring-1 ring-yellow-400/50' : 'border-border';

    return (
        <div className="relative">
            <FieldLabel label={label} isDirty={isDirty} isOverride={isOverride} onReset={onReset} name={props.id || props.name} tooltip={tooltip} searchTerm={searchTerm} />
            <div className="relative">
                <input
                    {...props}
                    type={isVisible ? 'text' : 'password'}
                    className={`mt-1 block w-full bg-secondary border ${dirtyClass} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10`}
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200"
                >
                    {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            {description && <p className="mt-2 text-xs text-text-secondary">{highlightText(description, searchTerm || '')}</p>}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
};


type SelectFieldProps = BaseFieldProps & React.SelectHTMLAttributes<HTMLSelectElement> & { options: (string | {label: string, value: string})[] };
export const SelectField: React.FC<SelectFieldProps> = ({ label, path, description, error, options, isDirty, isOverride, onReset, tooltip, searchTerm, ...props }) => {
    if (!shouldShowField(searchTerm || '', label, description, tooltip)) return null;

    const dirtyClass = isDirty ? 'border-yellow-400/50 ring-1 ring-yellow-400/50' : 'border-border';
    return (
        <div className="relative">
            <FieldLabel label={label} isDirty={isDirty} isOverride={isOverride} onReset={onReset} name={props.id || props.name} tooltip={tooltip} searchTerm={searchTerm}/>
            <select
                {...props}
                className={`mt-1 block w-full bg-secondary border ${dirtyClass} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
            >
                {options.map(option => (
                    typeof option === 'string' ?
                    <option key={option} value={option}>{option}</option> :
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            {description && <p className="mt-2 text-xs text-text-secondary">{highlightText(description, searchTerm || '')}</p>}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
};


type ToggleProps = BaseFieldProps & { checked: boolean, onChange: (checked: boolean) => void, name: string };
export const Toggle: React.FC<ToggleProps> = ({ label, path, description, checked, onChange, name, isDirty, isOverride, onReset, tooltip, searchTerm }) => {
    if (!shouldShowField(searchTerm || '', label, description, tooltip)) return null;

    return (
        <div className={`relative flex items-start justify-between p-2 rounded-md ${isDirty ? 'bg-yellow-500/10' : ''}`}>
            <div className="flex-grow pr-4">
                <FieldLabel label={label} isDirty={isDirty} isOverride={isOverride} onReset={onReset} name={name} inline tooltip={tooltip} searchTerm={searchTerm} />
                {description && <p className="mt-1 text-xs text-text-secondary">{highlightText(description, searchTerm || '')}</p>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                id={name}
                onClick={() => onChange(!checked)}
                className={`${
                checked ? 'bg-primary' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background`}
            >
                <span
                    aria-hidden="true"
                    className={`${
                    checked ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
    );
};


type RadioGroupProps = BaseFieldProps & {
    options: string[];
    value: string;
    name: string;
    onChange: (value: string) => void;
}
export const RadioGroup: React.FC<RadioGroupProps> = ({ label, path, options, value, name, onChange, isDirty, isOverride, onReset, tooltip, searchTerm }) => {
    if (!shouldShowField(searchTerm || '', label, tooltip, ...options)) return null;

    return (
        <div className={`relative p-2 rounded-md ${isDirty ? 'bg-yellow-500/10' : ''}`}>
            <FieldLabel label={label} isDirty={isDirty} isOverride={isOverride} onReset={onReset} name={name} tooltip={tooltip} searchTerm={searchTerm}/>
            <div className="mt-2 flex gap-4">
                {options.map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={value === option}
                            onChange={(e) => onChange(e.target.value)}
                            className="h-4 w-4 text-primary bg-secondary border-border focus:ring-primary"
                        />
                        <span className="text-sm">{highlightText(option, searchTerm || '')}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export const SectionTitle: React.FC<{title: string, subtitle: string, searchTerm?: string}> = ({title, subtitle, searchTerm}) => {
    if (!shouldShowField(searchTerm || '', title, subtitle)) return null;
    return (
        <div className="border-b border-border pb-5 mb-8">
            <h3 className="text-2xl font-bold leading-6 text-text-primary">{highlightText(title, searchTerm || '')}</h3>
            <p className="mt-2 max-w-4xl text-sm text-text-secondary">{highlightText(subtitle, searchTerm || '')}</p>
        </div>
    );
};


interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'danger';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = 'default', ...props }) => {
    const baseClasses = "text-sm font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        default: 'bg-secondary hover:bg-background text-text-primary',
        primary: 'bg-primary hover:bg-primary-hover text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    }[variant];
    
    return (
        <button className={`${baseClasses} ${variantClasses}`} {...props}>
            {children}
        </button>
    );
};

type CheckboxGroupFieldProps = BaseFieldProps & {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    name?: string;
};

export const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({ label, path, description, options, selected, onChange, isDirty, isOverride, onReset, name, tooltip, searchTerm }) => {
    if (!shouldShowField(searchTerm || '', label, description, tooltip)) return null;

    const handleSelect = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    const dirtyClass = isDirty ? 'border-yellow-400/50 ring-1 ring-yellow-400/50' : 'border-border';

    return (
        <div className="relative">
            <FieldLabel label={label} isDirty={isDirty} isOverride={isOverride} onReset={onReset} name={name} tooltip={tooltip} searchTerm={searchTerm}/>
            <div className={`mt-2 grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 max-h-40 overflow-y-auto p-2 border ${dirtyClass} rounded-md bg-secondary`}>
                {options.map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer p-1 rounded-md hover:bg-background">
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={() => handleSelect(option)}
                            className="h-4 w-4 rounded text-primary bg-secondary border-border focus:ring-primary"
                        />
                        <span className="text-sm">{highlightText(option, searchTerm || '')}</span>
                    </label>
                ))}
            </div>
            {description && <p className="mt-2 text-xs text-text-secondary">{highlightText(description, searchTerm || '')}</p>}
        </div>
    );
};


const FieldLabel: React.FC<{ label: string; name?: string; isDirty?: boolean; isOverride?: boolean; onReset?: () => void; inline?: boolean; tooltip?: string, searchTerm?: string }> = ({ label, name, isDirty, isOverride, onReset, inline, tooltip, searchTerm }) => {
    const commonLabelClass = "text-sm font-medium text-text-primary";
    
    const labelContent = (
        <div className="flex items-center gap-2">
            {isOverride && <div className="w-2 h-2 bg-blue-400 rounded-full" title="This setting is overridden by the current profile."></div>}
            <label htmlFor={name} className={inline ? '' : 'block'}>{highlightText(label, searchTerm || '')}</label>
            {tooltip && (
                <span title={tooltip}>
                    <QuestionMarkCircleIcon className="h-4 w-4 text-text-secondary cursor-help" />
                </span>
            )}
        </div>
    );
    
    return (
        <div className={`flex justify-between items-center ${inline ? '' : commonLabelClass}`}>
            {labelContent}
            {isDirty && onReset && (
                <button type="button" onClick={onReset} className="text-xs flex items-center gap-1 text-yellow-400 hover:text-yellow-300" title="Reset this field">
                    <ArrowPathIcon className="h-3 w-3" />
                    Reset
                </button>
            )}
        </div>
    );
};