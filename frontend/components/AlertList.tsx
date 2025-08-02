import React, { useEffect, useState } from 'react';

type Alert = { id: number; message: string; createdAt: string };

const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch('/api/alerts')
      .then((res) => res.json())
      .then(setAlerts)
      .catch(() => setAlerts([]));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Alerts</h2>
      <ul className="space-y-1">
        {alerts.map((a) => (
          <li key={a.id} className="border p-2 rounded">
            <span className="text-sm text-gray-500 mr-2">
              {new Date(a.createdAt).toLocaleString()}
            </span>
            {a.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertList;
