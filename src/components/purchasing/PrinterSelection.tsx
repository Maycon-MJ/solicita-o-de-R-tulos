import React from 'react';
import { Button } from '../ui/Button';
import { Department } from '../../types';

interface PrinterSelectionProps {
  onSelect: (printer: Department) => void;
  onCancel: () => void;
}

export function PrinterSelection({ onSelect, onCancel }: PrinterSelectionProps) {
  const printers: Department[] = ['printer1', 'printer2', 'printer3', 'printer4', 'printer5'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecionar Gráfica</h3>
      <div className="space-y-3">
        {printers.map((printer) => (
          <button
            key={printer}
            onClick={() => onSelect(printer)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {printer.replace(/(\d+)/, ' $1').replace('printer', 'Gráfica')}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}