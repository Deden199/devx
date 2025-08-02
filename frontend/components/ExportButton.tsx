import React from 'react';

const ExportButton: React.FC = () => (
  <button
    onClick={() => fetch('/api/transactions/export')}
    className="px-4 py-2 bg-gray-800 text-white rounded"
  >
    Export Transactions
  </button>
);

export default ExportButton;
