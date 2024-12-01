import React from 'react';
import { Clock } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { LabelRequest } from '../types';
import { RequestActions } from './RequestActions';
import { Timeline } from './Timeline';
import { FileList } from './FileList';
import { QuotationList } from './QuotationList';

interface RequestCardProps {
  request: LabelRequest;
  onQuotationClick: (requestId: string) => void;
  onPrinterSelect: (requestId: string) => void;
  onFileUpload: (requestId: string, type: 'print' | 'correction' | 'newPrint') => void;
  onPrintAction: (requestId: string, action: 'approve' | 'reject', department: 'marketing' | 'regulatory') => void;
  onQuotationApprove: (requestId: string, quotationId: string) => void;
}

export function RequestCard({
  request,
  onQuotationClick,
  onPrinterSelect,
  onFileUpload,
  onPrintAction,
  onQuotationApprove
}: RequestCardProps) {
  const renderDeliveryStatus = () => {
    if (!request.deliveryDeadline) return null;

    const deadline = new Date(request.deliveryDeadline);
    const isLate = isPast(deadline);
    
    return (
      <div className={`flex items-center gap-2 ${isLate ? 'text-red-600' : 'text-blue-600'}`}>
        <Clock className="h-4 w-4" />
        <span className="text-sm">
          {isLate
            ? `Atrasado: ${formatDistanceToNow(deadline, { locale: ptBR })} de atraso`
            : `Prazo: ${formatDistanceToNow(deadline, { locale: ptBR })} restantes`}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {request.labelName}
          </h3>
          <p className="text-sm text-gray-500">
            Código: {request.labelCode}
          </p>
          {renderDeliveryStatus()}
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Detalhes do Pedido</h4>
          <dl className="space-y-1">
            <div>
              <dt className="text-sm text-gray-500">Quantidade</dt>
              <dd className="text-sm text-gray-900">{request.unitQuantity}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Dimensões</dt>
              <dd className="text-sm text-gray-900">{request.dimensions}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Empresa</dt>
              <dd className="text-sm text-gray-900">{request.company}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Status do Produto</dt>
              <dd className="text-sm text-gray-900">{request.productStatus}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Arquivos</h4>
          <FileList files={request.files} />
        </div>
      </div>

      <RequestActions
        request={request}
        onQuotationClick={onQuotationClick}
        onPrinterSelect={onPrinterSelect}
        onFileUpload={onFileUpload}
        onPrintAction={onPrintAction}
      />

      {request.quotations && request.quotations.length > 0 && (
        <QuotationList
          quotations={request.quotations}
          department={request.department}
          onApprove={(quotationId) => onQuotationApprove(request.id, quotationId)}
        />
      )}

      <Timeline events={request.timeline} />
    </div>
  );
}