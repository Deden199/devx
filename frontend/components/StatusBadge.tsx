import React from 'react';

type Props = { status: 'healthy' | 'degraded' | 'down' };

const colors: Record<Props['status'], string> = {
  healthy: 'bg-green-500',
  degraded: 'bg-yellow-500',
  down: 'bg-red-500',
};

const StatusBadge: React.FC<Props> = ({ status }) => (
  <span className={`px-2 py-1 text-white rounded ${colors[status]}`}>{status}</span>
);

export default StatusBadge;
