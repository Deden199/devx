import React, { useState } from 'react';

const PreflightForm: React.FC = () => {
  const [clientId, setClientId] = useState('');
  const [enabled, setEnabled] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = enabled ? '/api/onboarding/subscribe' : '/api/onboarding/unsubscribe';
    await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId }),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        placeholder="Client ID"
        className="border p-2 rounded w-full"
      />
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        <span>Subscribed</span>
      </label>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Save
      </button>
    </form>
  );
};

export default PreflightForm;
