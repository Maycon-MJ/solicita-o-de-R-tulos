import React, { useState, useRef } from 'react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Department, LabelRequest } from '../types';
import { Timeline } from './Timeline';
import { Button } from './ui/Button';
import { Download, Upload, Clock, Send, FileIcon } from 'lucide-react';
import { QuotationForm } from './purchasing/QuotationForm';
import { PrinterSelection } from './purchasing/PrinterSelection';
import { useStore } from '../store';

interface RequestDetailsProps {
  request: LabelRequest;
  onClose: () => void;
}

interface FileDisplayProps {
  label: string;
  url: string;
  date: string;
  status?: string;
}

function FileDisplay({ label, url, date, status }: FileDisplayProps) {
  const getBackgroundColor = () => {
    if (status === 'print-rejected') return 'bg-red-50 border-red-200';
    if (status === 'print-approved') return 'bg-green-50 border-green-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${getBackgroundColor()}`}>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500">
          {format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </span>
      </div>
      <a
        href={url}
        download
        className="inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <Download className="h-4 w-4 mr-1" />
        Download
      </a>
    </div>
  );
}

export function RequestDetails({ request, onClose }: RequestDetailsProps) {
  // ... (previous code remains the same until the files section)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* ... (previous sections remain the same) */}

          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Arquivos</h3>
            <div className="space-y-3">
              {request.fileLink && (
                <FileDisplay
                  label="Link do Arquivo Original"
                  url={request.fileLink}
                  date={request.requestDate}
                />
              )}
              {request.fileUpload && (
                <FileDisplay
                  label="Arquivo Original Anexado"
                  url={request.fileUpload}
                  date={request.requestDate}
                />
              )}
              {request.correctedFile && (
                <FileDisplay
                  label="Arquivo Corrigido pelo Marketing"
                  url={request.correctedFile}
                  date={request.correctedFileDate || request.requestDate}
                />
              )}
              {request.printFile && (
                <FileDisplay
                  label={request.status === 'awaiting-new-print' ? 'Novo Print para Aprovação' : 'Print para Aprovação'}
                  url={request.printFile}
                  date={request.printFileDate || request.requestDate}
                  status={request.status}
                />
              )}
            </div>
          </div>

          {/* ... (rest of the component remains the same) */}
        </div>
      </div>
    </div>
  );
}