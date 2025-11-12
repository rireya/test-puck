import { useState } from 'react';
import type { Data } from '@measured/puck';
import { generateReactCode, copyToClipboard } from '../utils/codeGenerator';
import {
  generateSDUIString,
  generateSDUIComponentSchema,
  generateReactNativeSDUI
} from '../utils/sduiGenerator';
import './CodeViewer.css';

interface CodeViewerProps {
  data: Data;
  onClose: () => void;
}

type ExportFormat = 'react' | 'sdui' | 'schema' | 'react-native';

export function CodeViewer({ data, onClose }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('react');

  const getContent = () => {
    switch (format) {
      case 'react':
        return generateReactCode(data);
      case 'sdui':
        return generateSDUIString(data);
      case 'schema':
        return JSON.stringify(generateSDUIComponentSchema(data), null, 2);
      case 'react-native':
        return JSON.stringify(generateReactNativeSDUI(data), null, 2);
      default:
        return '';
    }
  };

  const content = getContent();

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const extension = format === 'react' ? 'tsx' : 'json';
    const filename = `generated-page.${extension}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTitle = () => {
    switch (format) {
      case 'react':
        return 'React JSX Code';
      case 'sdui':
        return 'SDUI JSON';
      case 'schema':
        return 'SDUI Component Schema';
      case 'react-native':
        return 'React Native SDUI';
      default:
        return 'Export';
    }
  };

  return (
    <div className="code-viewer-overlay">
      <div className="code-viewer-modal">
        <div className="code-viewer-header">
          <h2>{getTitle()}</h2>
          <div className="code-viewer-actions">
            <button onClick={handleCopy} className="copy-button">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button onClick={handleDownload} className="download-button">
              ⬇ Download
            </button>
            <button onClick={onClose} className="close-button">
              ✕
            </button>
          </div>
        </div>

        <div className="code-viewer-tabs">
          <button
            className={`tab ${format === 'react' ? 'active' : ''}`}
            onClick={() => setFormat('react')}
          >
            React JSX
          </button>
          <button
            className={`tab ${format === 'sdui' ? 'active' : ''}`}
            onClick={() => setFormat('sdui')}
          >
            SDUI JSON
          </button>
          <button
            className={`tab ${format === 'schema' ? 'active' : ''}`}
            onClick={() => setFormat('schema')}
          >
            Schema
          </button>
          <button
            className={`tab ${format === 'react-native' ? 'active' : ''}`}
            onClick={() => setFormat('react-native')}
          >
            React Native
          </button>
        </div>

        <pre className="code-viewer-content">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
}
