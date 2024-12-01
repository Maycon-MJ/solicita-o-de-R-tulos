import React from 'react';
import { useStore } from '../store';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileCheck, 
  Printer,
  Megaphone
} from 'lucide-react';

const departments = [
  { id: 'marketing', name: 'Marketing', icon: Megaphone },
  { id: 'regulatory', name: 'Regulatórios', icon: FileCheck },
  { id: 'purchasing', name: 'Compras', icon: ShoppingCart },
  { id: 'printer1', name: 'Gráfica 1', icon: Printer },
  { id: 'printer2', name: 'Gráfica 2', icon: Printer },
  { id: 'printer3', name: 'Gráfica 3', icon: Printer },
  { id: 'printer4', name: 'Gráfica 4', icon: Printer },
  { id: 'printer5', name: 'Gráfica 5', icon: Printer },
];

export function Sidebar() {
  const { currentDepartment, setCurrentDepartment } = useStore();

  return (
    <div className="w-64 bg-gray-900 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <LayoutDashboard className="h-6 w-6 text-blue-400" />
        <h1 className="text-white text-lg font-semibold">Solicitação de Rótulos</h1>
      </div>
      <nav>
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <button
              key={dept.id}
              onClick={() => setCurrentDepartment(dept.id as Department)}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg mb-1 transition-colors ${
                currentDepartment === dept.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{dept.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}