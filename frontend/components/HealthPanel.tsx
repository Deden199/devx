import React from 'react';
import StatusBadge from './StatusBadge';

const HealthPanel: React.FC = () => (
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 border rounded">
      <h3 className="font-semibold">API</h3>
      <StatusBadge status="healthy" />
    </div>
    <div className="p-4 border rounded">
      <h3 className="font-semibold">DB</h3>
      <StatusBadge status="healthy" />
    </div>
    <div className="p-4 border rounded">
      <h3 className="font-semibold">Jobs</h3>
      <StatusBadge status="healthy" />
    </div>
  </div>
);

export default HealthPanel;
