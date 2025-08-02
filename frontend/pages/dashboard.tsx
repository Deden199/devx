import React from 'react';
import StatusBadge from '../components/StatusBadge';
import AlertList from '../components/AlertList';
import HealthPanel from '../components/HealthPanel';
import PreflightForm from '../components/PreflightForm';
import ExportButton from '../components/ExportButton';

const Dashboard: React.FC = () => (
  <div className="p-4 space-y-4">
    <h1 className="text-2xl font-bold">Operational Confidence Dashboard</h1>
    <HealthPanel />
    <AlertList />
    <PreflightForm />
    <ExportButton />
  </div>
);

export default Dashboard;
