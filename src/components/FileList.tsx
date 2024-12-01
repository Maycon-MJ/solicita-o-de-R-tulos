import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Download, FileIcon } from 'lucide-react';
import type { FileRecord } from '../types';

interface FileListProps {
  files: FileRecord[];
}

export function FileList({ files }: FileListProps) {
  if (!files || files.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Nenhum arquivo disponível
      </div>
    );
  }

  const sortedFiles = [...files].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getFileLabel = (file: FileRecord) => {
    const versionSuffix = file.version > 1 ? ` v${file.version}` : '';
    
    switch (file.type) {
      case 'original-link':
        return `Link Original${versionSuffix}`;
      case 'original-upload':
        return `Arquivo Original${versionSuffix}`;
      case 'marketing-correction':
        return `Correção Marketing${versionSuffix}`;
      case 'print':
        return `Print${versionSuffix}`;
      case 'new-print':
        return `Novo Print${versionSuffix}`;
      default:
        return `Arquivo${versionSuffix}`;
    }
  };

  const getFileStyle = (file: FileRecord) => {
    const baseStyle = 'flex items-center justify-between p-2 rounded-lg border mb-2 transition-colors';
    
    if (file.status === 'print-rejected') {
      return `${baseStyle} bg-red-50 border-red-200`;
    }
    if (file.status === 'print-approved') {
      return `${baseStyle} bg-green-50 border-green-200`;
    }
    
    switch (file.type) {
      case 'original-link':
        return `${baseStyle} bg-blue-50 border-blue-200`;
      case 'original-upload':
        return `${baseStyle} bg-purple-50 border-purple-200`;
      case 'marketing-correction':
        return `${baseStyle} bg-yellow-50 border-yellow-200`;
      case 'print':
      case 'new-print':
        return `${baseStyle} bg-gray-50 border-gray-200`;
      default:
        return `${baseStyle} bg-gray-50 border-gray-200`;
    }
  };

  const getDepartmentName = (department: string) => {
    if (department.includes('printer')) {
      return department.replace(/(\d+)/, ' $1').replace('printer', 'Gráfica');
    }
    switch (department) {
      case 'marketing':
        return 'Marketing';
      case 'regulatory':
        return 'Regulatórios';
      case 'purchasing':
        return 'Compras';
      default:
        return department;
    }
  };

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
      {sortedFiles.map((file) => (
        <div key={file.id} className={getFileStyle(file)}>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FileIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 truncate">
                {getFileLabel(file)}
              </span>
            </div>
            <div className="flex flex-col text-xs text-gray-500 mt-1">
              <span>
                {format(new Date(file.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
              <span className="truncate">
                Por: {getDepartmentName(file.department)}
              </span>
            </div>
          </div>
          <a
            href={file.url}
            download
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 ml-2"
          >
            <Download className="h-4 w-4 mr-1" />
            Baixar
          </a>
        </div>
      ))}
    </div>
  );
}