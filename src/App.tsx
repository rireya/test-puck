import { useState } from 'react';
import { Puck, type Data } from '@measured/puck';
import { config } from './puck.config';
import { CodeViewer } from './components/CodeViewer';
import '@measured/puck/puck.css';
import '../node_modules/test-storybook-components/dist/styles/test-storybook-components.css';

// Initial data for the page
const initialData: Data = {
  content: [
    {
      type: 'HeadingBlock',
      props: {
        id: 'heading-1',
        title: 'Welcome to Puck Page Builder',
      },
    },
    {
      type: 'Header',
      props: {
        id: 'header-1',
        showUser: true,
        userName: 'John Doe',
      },
    },
    {
      type: 'Button',
      props: {
        id: 'button-1',
        label: 'Get Started',
        primary: true,
        size: 'large',
      },
    },
  ],
  root: { props: { title: 'My Page' } },
};

function App() {
  const [currentData, setCurrentData] = useState<Data>(initialData);
  const [showCode, setShowCode] = useState(false);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Puck
        config={config}
        data={currentData}
        onChange={(data) => setCurrentData(data)}
        onPublish={async (data) => {
          console.log('Published data:', data);
          alert('Page published! Check console for data.');
        }}
        overrides={{
          headerActions: ({ children }) => (
            <>
              {children}
              <button
                onClick={() => setShowCode(true)}
                style={{
                  padding: '8px 16px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginLeft: '8px',
                }}
              >
                &lt;/&gt; View Code
              </button>
            </>
          ),
        }}
      />
      {showCode && (
        <CodeViewer
          data={currentData}
          onClose={() => setShowCode(false)}
        />
      )}
    </div>
  );
}

export default App;
