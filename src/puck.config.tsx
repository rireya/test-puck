import type { Config } from '@measured/puck';
import { Button, Header, McncInput } from 'test-storybook-components';

// Define component configurations for Puck
export type UserComponentProps = {
  Button: {
    label: string;
    primary?: boolean;
    size?: 'small' | 'medium' | 'large';
    backgroundColor?: string;
  };
  Header: {
    showUser?: boolean;
    userName?: string;
  };
  McncInput: {
    label?: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
  };
  HeadingBlock: {
    title: string;
  };
  ColumnsBlock: {
    columns: number;
  };
};

export const config: Config<UserComponentProps> = {
  components: {
    Button: {
      fields: {
        label: { type: 'text', label: 'Label' },
        primary: { type: 'radio', options: [
          { label: 'Primary', value: true },
          { label: 'Secondary', value: false }
        ]},
        size: {
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
        },
        backgroundColor: { type: 'text', label: 'Background Color' },
      },
      defaultProps: {
        label: 'Click me',
        primary: false,
        size: 'medium',
      },
      render: ({ label, primary, size, backgroundColor }) => {
        return (
          <Button
            label={label}
            primary={primary}
            size={size}
            backgroundColor={backgroundColor}
          />
        );
      },
    },
    Header: {
      fields: {
        showUser: { type: 'radio', options: [
          { label: 'Show User', value: true },
          { label: 'Hide User', value: false }
        ]},
        userName: { type: 'text', label: 'User Name' },
      },
      defaultProps: {
        showUser: false,
        userName: 'Jane Doe',
      },
      render: ({ showUser, userName }) => {
        const user = showUser ? { name: userName } : undefined;
        return (
          <Header
            user={user}
            onLogin={() => console.log('Login clicked')}
            onLogout={() => console.log('Logout clicked')}
            onCreateAccount={() => console.log('Create account clicked')}
          />
        );
      },
    },
    McncInput: {
      fields: {
        label: { type: 'text', label: 'Label' },
        placeholder: { type: 'text', label: 'Placeholder' },
        value: { type: 'text', label: 'Default Value' },
        disabled: { type: 'radio', options: [
          { label: 'Enabled', value: false },
          { label: 'Disabled', value: true }
        ]},
      },
      defaultProps: {
        label: 'Input Field',
        placeholder: 'Enter text...',
        value: '',
        disabled: false,
      },
      render: ({ label, placeholder, value, disabled }) => {
        return (
          <McncInput
            label={label}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
          />
        );
      },
    },
    HeadingBlock: {
      fields: {
        title: { type: 'text', label: 'Title' },
      },
      defaultProps: {
        title: 'Heading',
      },
      render: ({ title }) => {
        return <h1 style={{ padding: '20px' }}>{title}</h1>;
      },
    },
    ColumnsBlock: {
      fields: {
        columns: {
          type: 'number',
          label: 'Number of columns',
        },
      },
      defaultProps: {
        columns: 2,
      },
      render: ({ columns }) => {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '16px', padding: '20px' }}>
            {Array.from({ length: columns }).map((_, idx) => (
              <div key={idx} style={{ background: '#f0f0f0', padding: '20px', borderRadius: '4px' }}>
                Column {idx + 1}
              </div>
            ))}
          </div>
        );
      },
    },
  },
};
