export type Department = 
  | 'marketing'
  | 'regulatory'
  | 'purchasing'
  | 'printer1'
  | 'printer2'
  | 'printer3'
  | 'printer4'
  | 'printer5'
  | 'system';

export type Company = 'global' | 'akron' | 'third-party' | 'others';

export type ProductStatus = 'new' | 'priority' | 'launch' | 'repeat' | 'reprocess';

export type PaymentMethod = 'pix' | 'bank-slip' | 'credit-card';

export type RollDirection = 'round' | 'square' | 'carton';

export type RequestStatus = 
  | 'forwarded-to-purchasing'
  | 'awaiting-print-approval'
  | 'print-approved'
  | 'print-rejected'
  | 'awaiting-new-print'
  | 'label-approved'
  | 'label-delivered-on-time'
  | 'label-delivered-late';

export interface FileRecord {
  id: string;
  url: string;
  date: string;
  type: 'original-link' | 'original-upload' | 'marketing-correction' | 'print' | 'new-print';
  status?: 'print-rejected' | 'print-approved';
  department: Department;
  version: number;
}

export interface PrintApprovals {
  marketing: boolean;
  regulatory: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  description: string;
  type: 'success' | 'error' | 'info';
  department: Department;
}

export interface Quotation {
  id: string;
  requestId: string;
  orderRequestDate: string;
  productCode: string;
  productName: string;
  company: Company;
  printer: string;
  printerSendDate: string;
  unitPrice: number;
  paymentTerms: number;
  printPreview: string;
  paymentMethod: PaymentMethod;
  deliveryTime: string;
  rollDirection: RollDirection;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface LabelRequest {
  id: string;
  labelCode: string;
  requestDate: string;
  labelName: string;
  unitQuantity: number;
  dimensions: string;
  company: Company;
  fileLink: string;
  fileUpload: string | File;
  purchasingSendDate: string;
  productStatus: ProductStatus;
  finishing: string;
  observation: string;
  status: RequestStatus;
  department: Department;
  timeline: TimelineEvent[];
  files: FileRecord[];
  quotations?: Quotation[];
  selectedPrinter?: Department;
  printApprovals?: PrintApprovals;
  printRejectionReason?: string;
  approvalDate?: string;
  deliveryDeadline?: string;
  receivedDate?: string;
}