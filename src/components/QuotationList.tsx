import React from 'react';
import { Button } from './ui/Button';
import type { Quotation, Department } from '../types';

interface QuotationListProps {
  quotations: Quotation[];
  department: Department;
  onApprove: (quotationId: string) => void;
}

export function QuotationList({ quotations, department, onApprove }: QuotationListProps) {
  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-700 mb-2">Cotações</h4>
      <div className="space-y-2">
        {quotations.map((quotation) => (
          <div
            key={quotation.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">
                {quotation.printer}
              </p>
              <p className="text-sm text-gray-500">
                R$ {quotation.unitPrice.toFixed(2)} por unidade
              </p>
            </div>
            {quotation.status === 'pending' && department === 'purchasing' && (
              <Button
                onClick={() => onApprove(quotation.id)}
                size="sm"
              >
                Aprovar Cotação
              </Button>
            )}
            {quotation.status === 'approved' && (
              <span className="text-green-600 text-sm font-medium">
                Aprovada
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}