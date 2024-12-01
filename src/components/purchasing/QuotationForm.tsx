import React from 'react';
import { Button } from '../ui/Button';
import { Company, PaymentMethod, RollDirection } from '../../types';

interface QuotationFormProps {
  requestId: string;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export function QuotationForm({ requestId, onSubmit, onCancel }: QuotationFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <input type="hidden" name="requestId" value={requestId} />
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="orderRequestDate" className="block text-sm font-medium text-gray-700">
            Data da Solicitação do Pedido
          </label>
          <input
            type="date"
            name="orderRequestDate"
            id="orderRequestDate"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="productCode" className="block text-sm font-medium text-gray-700">
            Código do Produto
          </label>
          <input
            type="text"
            name="productCode"
            id="productCode"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            Nome do Produto
          </label>
          <input
            type="text"
            name="productName"
            id="productName"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Empresa
          </label>
          <select
            name="company"
            id="company"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="global">Global</option>
            <option value="akron">Akron</option>
            <option value="third-party">Terceirização</option>
            <option value="others">Outros</option>
          </select>
        </div>

        <div>
          <label htmlFor="printer" className="block text-sm font-medium text-gray-700">
            Gráfica
          </label>
          <input
            type="text"
            name="printer"
            id="printer"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="printerSendDate" className="block text-sm font-medium text-gray-700">
            Data de Envio para Gráfica
          </label>
          <input
            type="date"
            name="printerSendDate"
            id="printerSendDate"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
            Valor Unitário (R$)
          </label>
          <input
            type="number"
            name="unitPrice"
            id="unitPrice"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">
            Condição de Pagamento (dias)
          </label>
          <select
            name="paymentTerms"
            id="paymentTerms"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map((days) => (
              <option key={days} value={days}>{days}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="printPreview" className="block text-sm font-medium text-gray-700">
            Previsão do Print
          </label>
          <input
            type="date"
            name="printPreview"
            id="printPreview"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Forma de Pagamento
          </label>
          <select
            name="paymentMethod"
            id="paymentMethod"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pix">Pix</option>
            <option value="bank-slip">Boleto</option>
            <option value="credit-card">Cartão de Crédito</option>
          </select>
        </div>

        <div>
          <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700">
            Prazo de entrega do Rótulo
          </label>
          <select
            name="deliveryTime"
            id="deliveryTime"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="1-5">1-5 dias</option>
            <option value="6-10">6-10 dias</option>
            <option value="11-15">11-15 dias</option>
            <option value="16+">Acima de 16 Dias</option>
          </select>
        </div>

        <div>
          <label htmlFor="rollDirection" className="block text-sm font-medium text-gray-700">
            Sentido da Bobina
          </label>
          <select
            name="rollDirection"
            id="rollDirection"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="round">Usar o Sentido 5 para frasco Redondo</option>
            <option value="square">Usar o sentido 6 para Frasco Quadrado</option>
            <option value="carton">Cartucho</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Cotação
        </Button>
      </div>
    </form>
  );
}