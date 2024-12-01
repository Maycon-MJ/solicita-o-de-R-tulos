import React from 'react';
import { RequestCard } from './RequestCard';
import type { LabelRequest } from '../types';

interface RequestListProps {
  requests: LabelRequest[];
  onQuotationClick: (requestId: string) => void;
  onPrinterSelect: (requestId: string) => void;
  onFileUpload: (requestId: string, type: 'print' | 'correction' | 'newPrint') => void;
  onPrintAction: (requestId: string, action: 'approve' | 'reject', department: 'marketing' | 'regulatory') => void;
  onQuotationApprove: (requestId: string, quotationId: string) => void;
}

export function RequestList({
  requests,
  onQuotationClick,
  onPrinterSelect,
  onFileUpload,
  onPrintAction,
  onQuotationApprove
}: RequestListProps) {
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma solicitação encontrada
      </div>
    );
  }

  // Sort requests by date, newest first
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedRequests.map((request) => (
        <RequestCard
          key={`${request.id}-${request.department}`}
          request={request}
          onQuotationClick={onQuotationClick}
          onPrinterSelect={onPrinterSelect}
          onFileUpload={onFileUpload}
          onPrintAction={onPrintAction}
          onQuotationApprove={onQuotationApprove}
        />
      ))}
    </div>
  );
}