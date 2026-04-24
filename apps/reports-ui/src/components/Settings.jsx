import React from 'react';

export default function Settings({ ideProtocol, setIdeProtocol, protocols, onClose }) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>Settings</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="setting-row">
        <label>IDE Protocol</label>
        <p className="setting-help">Clicking file links will open in this IDE</p>
        <select
          value={ideProtocol}
          onChange={e => setIdeProtocol(e.target.value)}
        >
          {Object.entries(protocols).map(([key, { name }]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>
      <div className="setting-row">
        <label>Example Link</label>
        <code className="protocol-preview">
          {protocols[ideProtocol].protocol}/path/to/file.ts:42
        </code>
      </div>
    </div>
  );
}
