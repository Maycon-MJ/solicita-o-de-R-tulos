import React from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import type { LabelRequest } from '../types';

interface RequestActionsProps {
  request: LabelRequest;
  onQuotationClick: (requestId: string) => void;
  onPrinterSelect: (requestId: string) => void;
  onFileUpload: (requestId: string, type: 'print' | 'correction' | 'newPrint') => void;
  onPrintAction: (requestId: string, action: 'approve' | 'reject', department: 'marketing' | 'regulatory') => void;
}

export function RequestActions({
  request,
  onQuotationClick,
  onPrinterSelect,
  onFileUpload,
  onPrintAction
}: RequestActionsProps) {
  return (
    <div className="mb-4">
      {request.department === 'purchasing' && !request.selectedPrinter && (
        <div className="flex gap-2">
          <Button
            onClick={() => onQuotationClick(request.id)}
            variant="primary"
          >
            <FileText className="h-4 w-4 mr-2" />
            Adicionar Cotação
          </Button>
          {request.quotations?.some(q => q.status === 'approved') && (
            <Button
              onClick={() => onPrinterSelect(request.id)}
              variant="secondary"
            >
              Selecionar Gráfica
            </Button>
          )}
        </div>
      )}

      {request.department.includes('printer') && (
        <div className="flex gap-2">
          <Button
            onClick={() => onFileUpload(
              request.id,
              request.status === 'awaiting-new-print' ? 'newPrint' : 'print'
            )}
          >
            <Upload className="h-4 w-4 mr-2" />
            {request.status === 'awaiting-new-print' ? 'Enviar Novo Print' : 'Enviar Print'}
          </Button>
        </div>
      )}

      {(request.department === 'marketing' || request.department === 'regulatory') && 
       request.status === 'awaiting-print-approval' && (
        <div className="flex gap-2">
          <Button
            onClick={() => onPrintAction(request.id, 'approve', request.department)}
            variant="primary"
          >
            Aprovar Print
          </Button>
          <Button
            onClick={() => onPrintAction(request.id, 'reject', request.department)}
            variant="danger"
          >
            Rejeitar Print
          </Button>
        </div>
      )}

      {request.department === 'marketing' && 
       request.status === 'print-rejected' && (
        <Button
          onClick={() => onFileUpload(request.id, 'correction')}
        >
          <Upload className="h-4 w-4 mr-2" />
          Enviar Rótulo Corrigido
        </Button>
      )}
    </div>
  );
}