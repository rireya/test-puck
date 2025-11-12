import type { Data } from '@measured/puck';

/**
 * Convert Puck JSON data to React JSX code
 */
export function generateReactCode(data: Data): string {
  const imports = new Set<string>();

  // Generate component JSX
  const componentCode = data.content.map((item) => {
    const { type, props } = item;

    // Add import for each component type
    if (type === 'Button' || type === 'Header') {
      imports.add(type);
    }

    // Generate props string
    const propsString = Object.entries(props)
      .filter(([key]) => key !== 'id') // Exclude id from props
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean') {
          return value ? key : `${key}={false}`;
        } else if (typeof value === 'number') {
          return `${key}={${value}}`;
        } else if (value === undefined) {
          return '';
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(' ');

    // Generate JSX element
    if (type === 'HeadingBlock') {
      return `  <h1 style={{ padding: '20px' }}>${props.title || ''}</h1>`;
    } else if (type === 'ColumnsBlock') {
      const columns = props.columns || 2;
      return `  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(${columns}, 1fr)', gap: '16px', padding: '20px' }}>
${Array.from({ length: columns }).map((_, idx) =>
    `    <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '4px' }}>
      Column ${idx + 1}
    </div>`
  ).join('\n')}
  </div>`;
    } else {
      return `  <${type}${propsString ? ' ' + propsString : ''} />`;
    }
  }).join('\n\n');

  // Generate import statements
  const importStatements = Array.from(imports).length > 0
    ? `import { ${Array.from(imports).join(', ')} } from 'test-storybook-components';\nimport 'test-storybook-components/dist/styles/test-storybook-components.css';\n\n`
    : '';

  // Generate full component
  const fullCode = `${importStatements}export default function GeneratedPage() {
  return (
    <div>
${componentCode}
    </div>
  );
}
`;

  return fullCode;
}

/**
 * Format code with basic indentation
 */
export function formatCode(code: string): string {
  // Basic formatting - can be enhanced with prettier
  return code;
}

/**
 * Copy code to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}
