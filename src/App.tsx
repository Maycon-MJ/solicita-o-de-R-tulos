import React from 'react';
import { Sidebar } from './components/Sidebar';
import { useStore } from './store';
import { LabelRequestForm } from './components/marketing/LabelRequestForm';
import { QuotationForm } from './components/purchasing/QuotationForm';
import { PrinterSelection } from './components/purchasing/PrinterSelection';
import { RequestList } from './components/RequestList';
import { Plus } from 'lucide-react';
import { Button } from './components/ui/Button';
import type { Department, Quotation } from './types';

function App() {
  const { currentDepartment, requests } = useStore();
  const [showForm, setShowForm] = React.useState(false);
  const [showQuotationForm, setShowQuotationForm] = React.useState<string | null>(null);
  const [showPrinterSelection, setShowPrinterSelection] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const {
    submitPrint,
    submitCorrectedFile,
    submitNewPrint,
    approvePrint,
    rejectPrint,
    addQuotation,
    approveQuotation,
    sendToPrinter
  } = useStore();

  const departmentRequests = requests.filter(
    (request) => request.department === currentDepartment
  );

  const handleFileUpload = (requestId: string, type: 'print' | 'correction' | 'newPrint') => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.requestId = requestId;
      fileInputRef.current.dataset.uploadType = type;
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const requestId = e.target.dataset.requestId;
    const uploadType = e.target.dataset.uploadType as 'print' | 'correction' | 'newPrint';

    if (file && requestId) {
      switch (uploadType) {
        case 'print':
          submitPrint(requestId, file);
          break;
        case 'correction':
          submitCorrectedFile(requestId, file);
          break;
        case 'newPrint':
          submitNewPrint(requestId, file);
          break;
      }
      e.target.value = '';
    }
  };

  const handleQuotationSubmit = (formData: FormData) => {
    const requestId = formData.get('requestId') as string;
    const quotation: Quotation = {
      id: crypto.randomUUID(),
      requestId,
      orderRequestDate: formData.get('orderRequestDate') as string,
      productCode: formData.get('productCode') as string,
      productName: formData.get('productName') as string,
      company: formData.get('company') as any,
      printer: formData.get('printer') as string,
      printerSendDate: formData.get('printerSendDate') as string,
      unitPrice: Number(formData.get('unitPrice')),
      paymentTerms: Number(formData.get('paymentTerms')),
      printPreview: formData.get('printPreview') as string,
      paymentMethod: formData.get('paymentMethod') as any,
      deliveryTime: formData.get('deliveryTime') as string,
      rollDirection: formData.get('rollDirection') as any,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    addQuotation(requestId, quotation);
    setShowQuotationForm(null);
  };

  const handlePrintAction = (
    requestId: string,
    action: 'approve' | 'reject',
    department: 'marketing' | 'regulatory'
  ) => {
    if (action === 'approve') {
      approvePrint(requestId, department);
    } else {
      const reason = window.prompt('Por favor, insira o motivo da rejeição:');
      if (reason) {
        rejectPrint(requestId, department, reason);
      }
    }
  };

  const handlePrinterSelection = (requestId: string, printer: Department) => {
    sendToPrinter(requestId, printer);
    setShowPrinterSelection(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentDepartment === 'marketing' && 'Marketing Dashboard'}
              {currentDepartment === 'regulatory' && 'Regulatórios Dashboard'}
              {currentDepartment === 'purchasing' && 'Compras Dashboard'}
              {currentDepartment.includes('printer') && `${currentDepartment.replace(/\d+/, ' $&')} Dashboard`}
            </h2>
            {currentDepartment === 'marketing' && (
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="h-5 w-5 mr-2" />
                Solicitar Rótulo
              </Button>
            )}
          </div>

          {showForm && currentDepartment === 'marketing' && (
            <div className="mb-8">
              <LabelRequestForm />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInputChange}
          />

          <RequestList
            requests={departmentRequests}
            onQuotationClick={setShowQuotationForm}
            onPrinterSelect={setShowPrinterSelection}
            onFileUpload={handleFileUpload}
            onPrintAction={handlePrintAction}
            onQuotationApprove={approveQuotation}
          />
        </div>
      </main>

      {showQuotationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <QuotationForm
            requestId={showQuotationForm}
            onSubmit={handleQuotationSubmit}
            onCancel={() => setShowQuotationForm(null)}
          />
        </div>
      )}

      {showPrinterSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <PrinterSelection
            onSelect={(printer) => handlePrinterSelection(showPrinterSelection, printer)}
            onCancel={() => setShowPrinterSelection(null)}
          />
        </div>
      )}
    </div>
  );
}

export default App;