import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Department, 
  LabelRequest, 
  Quotation,
  FileRecord,
  TimelineEvent
} from '../types';

interface Store {
  currentDepartment: Department;
  requests: LabelRequest[];
  setCurrentDepartment: (department: Department) => void;
  addRequest: (request: LabelRequest) => void;
  addQuotation: (requestId: string, quotation: Quotation) => void;
  approveQuotation: (requestId: string, quotationId: string) => void;
  sendToPrinter: (requestId: string, printer: Department) => void;
  submitPrint: (requestId: string, file: File) => void;
  submitCorrectedFile: (requestId: string, file: File) => void;
  submitNewPrint: (requestId: string, file: File) => void;
  approvePrint: (requestId: string, department: Department) => void;
  rejectPrint: (requestId: string, department: Department, reason: string) => void;
  markLabelReceived: (requestId: string) => void;
}

const createTimelineEvent = (
  description: string,
  type: TimelineEvent['type'],
  department: Department
): TimelineEvent => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  description,
  type,
  department
});

const createBaseRequest = (request: LabelRequest, department: Department, files: FileRecord[]): LabelRequest => ({
  ...request,
  id: crypto.randomUUID(),
  files,
  department,
  status: 'forwarded-to-purchasing',
  timeline: [
    createTimelineEvent(
      department === 'marketing' ? 'Solicitação criada' : 'Solicitação recebida do Marketing',
      'info',
      department
    )
  ]
});

export const useStore = create<Store>()(
  persist(
    (set) => ({
      currentDepartment: 'marketing',
      requests: [],

      setCurrentDepartment: (department) => 
        set({ currentDepartment: department }),

      addRequest: (request) =>
        set((state) => {
          const files: FileRecord[] = [];
          const currentTime = new Date().toISOString();
          
          if (request.fileLink) {
            files.push({
              id: crypto.randomUUID(),
              url: request.fileLink,
              date: currentTime,
              type: 'original-link',
              department: 'marketing',
              version: 1
            });
          }
          
          if (request.fileUpload instanceof File) {
            files.push({
              id: crypto.randomUUID(),
              url: URL.createObjectURL(request.fileUpload),
              date: currentTime,
              type: 'original-upload',
              department: 'marketing',
              version: 1
            });
          }

          const departments: Department[] = ['marketing', 'purchasing', 'regulatory'];
          const newRequests = departments.map(dept => createBaseRequest(request, dept, files));

          return {
            requests: [...newRequests, ...state.requests]
          };
        }),

      addQuotation: (requestId, quotation) =>
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request.id === requestId || request.labelCode === state.requests.find(r => r.id === requestId)?.labelCode) {
              const updatedRequest = {
                ...request,
                quotations: [...(request.quotations || []), quotation],
                timeline: [
                  ...request.timeline,
                  createTimelineEvent(
                    `Cotação adicionada para ${quotation.printer}`,
                    'info',
                    request.department
                  )
                ]
              };
              return updatedRequest;
            }
            return request;
          })
        })),

      approveQuotation: (requestId, quotationId) =>
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request.id === requestId || 
                (request.labelCode === state.requests.find(r => r.id === requestId)?.labelCode)) {
              return {
                ...request,
                quotations: request.quotations?.map((q) =>
                  q.id === quotationId ? { ...q, status: 'approved' } : q
                ),
                timeline: [
                  ...request.timeline,
                  createTimelineEvent(
                    'Cotação aprovada',
                    'success',
                    request.department
                  )
                ]
              };
            }
            return request;
          })
        })),

      sendToPrinter: (requestId, printer) =>
        set((state) => {
          const sourceRequest = state.requests.find(r => r.id === requestId);
          if (!sourceRequest) return state;

          const printerRequest = createBaseRequest(sourceRequest, printer, sourceRequest.files);
          
          return {
            requests: [printerRequest, ...state.requests.map(request => {
              if (request.labelCode === sourceRequest.labelCode) {
                return {
                  ...request,
                  selectedPrinter: printer,
                  timeline: [
                    ...request.timeline,
                    createTimelineEvent(
                      `Solicitação enviada para ${printer}`,
                      'info',
                      request.department
                    )
                  ]
                };
              }
              return request;
            })]
          };
        }),

      submitPrint: (requestId, file) =>
        set((state) => {
          const sourceRequest = state.requests.find(r => r.id === requestId);
          if (!sourceRequest) return state;

          const fileUrl = URL.createObjectURL(file);
          const currentTime = new Date().toISOString();
          const newFile: FileRecord = {
            id: crypto.randomUUID(),
            url: fileUrl,
            date: currentTime,
            type: 'print',
            department: sourceRequest.department,
            version: 1
          };

          return {
            requests: state.requests.map(request => {
              if (request.labelCode === sourceRequest.labelCode) {
                return {
                  ...request,
                  status: 'awaiting-print-approval',
                  printApprovals: {
                    marketing: false,
                    regulatory: false
                  },
                  files: [...request.files, newFile],
                  timeline: [
                    ...request.timeline,
                    createTimelineEvent(
                      'Print enviado para aprovação',
                      'info',
                      sourceRequest.department
                    )
                  ]
                };
              }
              return request;
            })
          };
        }),

      submitCorrectedFile: (requestId, file) =>
        set((state) => {
          const sourceRequest = state.requests.find(r => r.id === requestId);
          if (!sourceRequest) return state;

          const fileUrl = URL.createObjectURL(file);
          const currentTime = new Date().toISOString();
          const newFile: FileRecord = {
            id: crypto.randomUUID(),
            url: fileUrl,
            date: currentTime,
            type: 'marketing-correction',
            department: 'marketing',
            version: sourceRequest.files.filter(f => f.type === 'marketing-correction').length + 1
          };

          return {
            requests: state.requests.map(request => {
              if (request.labelCode === sourceRequest.labelCode) {
                return {
                  ...request,
                  status: 'awaiting-new-print',
                  files: [...request.files, newFile],
                  timeline: [
                    ...request.timeline,
                    createTimelineEvent(
                      'Arquivo corrigido enviado para a gráfica',
                      'info',
                      'marketing'
                    )
                  ]
                };
              }
              return request;
            })
          };
        }),

      submitNewPrint: (requestId, file) =>
        set((state) => {
          const sourceRequest = state.requests.find(r => r.id === requestId);
          if (!sourceRequest) return state;

          const fileUrl = URL.createObjectURL(file);
          const currentTime = new Date().toISOString();
          const newFile: FileRecord = {
            id: crypto.randomUUID(),
            url: fileUrl,
            date: currentTime,
            type: 'new-print',
            department: sourceRequest.department,
            version: sourceRequest.files.filter(f => f.type === 'new-print').length + 1
          };

          return {
            requests: state.requests.map(request => {
              if (request.labelCode === sourceRequest.labelCode) {
                return {
                  ...request,
                  status: 'awaiting-print-approval',
                  printApprovals: {
                    marketing: false,
                    regulatory: false
                  },
                  files: [...request.files, newFile],
                  timeline: [
                    ...request.timeline,
                    createTimelineEvent(
                      'Novo print enviado para aprovação',
                      'info',
                      sourceRequest.department
                    )
                  ]
                };
              }
              return request;
            })
          };
        }),

      approvePrint: (requestId, department) =>
        set((state) => ({
          requests: state.requests.map(request => {
            if (request.labelCode === state.requests.find(r => r.id === requestId)?.labelCode) {
              const printApprovals = {
                ...request.printApprovals,
                [department]: true
              };

              const isFullyApproved = printApprovals.marketing && printApprovals.regulatory;
              const currentTime = new Date().toISOString();
              const deliveryDeadline = new Date(currentTime);
              deliveryDeadline.setDate(deliveryDeadline.getDate() + 15);

              const updatedFiles = request.files.map(file => {
                if (file.type === 'print' || file.type === 'new-print') {
                  return { ...file, status: 'print-approved' };
                }
                return file;
              });

              return {
                ...request,
                status: isFullyApproved ? 'print-approved' : request.status,
                printApprovals,
                files: updatedFiles,
                deliveryDeadline: isFullyApproved ? deliveryDeadline.toISOString() : undefined,
                timeline: [
                  ...request.timeline,
                  createTimelineEvent(
                    `Print aprovado por ${department}${isFullyApproved ? ' - Aprovação final' : ''}`,
                    'success',
                    department
                  )
                ]
              };
            }
            return request;
          })
        })),

      rejectPrint: (requestId, department, reason) =>
        set((state) => ({
          requests: state.requests.map(request => {
            if (request.labelCode === state.requests.find(r => r.id === requestId)?.labelCode) {
              const updatedFiles = request.files.map(file => {
                if (file.type === 'print' || file.type === 'new-print') {
                  return { ...file, status: 'print-rejected' };
                }
                return file;
              });

              return {
                ...request,
                status: 'print-rejected',
                printRejectionReason: reason,
                printApprovals: {
                  marketing: false,
                  regulatory: false
                },
                files: updatedFiles,
                timeline: [
                  ...request.timeline,
                  createTimelineEvent(
                    `Print rejeitado por ${department}. Motivo: ${reason}`,
                    'error',
                    department
                  )
                ]
              };
            }
            return request;
          })
        })),

      markLabelReceived: (requestId) =>
        set((state) => ({
          requests: state.requests.map(request => {
            if (request.labelCode === state.requests.find(r => r.id === requestId)?.labelCode) {
              const currentTime = new Date().toISOString();
              const deliveryDeadline = new Date(request.deliveryDeadline || '');
              const isLate = isPast(deliveryDeadline);

              return {
                ...request,
                status: isLate ? 'label-delivered-late' : 'label-delivered-on-time',
                receivedDate: currentTime,
                timeline: [
                  ...request.timeline,
                  createTimelineEvent(
                    `Rótulo recebido ${isLate ? 'com atraso' : 'no prazo'}`,
                    isLate ? 'error' : 'success',
                    request.department
                  )
                ]
              };
            }
            return request;
          })
        }))
    }),
    {
      name: 'label-requests-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          return {
            currentDepartment: 'marketing',
            requests: []
          };
        }
        return persistedState;
      }
    }
  )
);