import React from 'react';
import { useStore } from '../../store';
import { Button } from '../ui/Button';
import { Company, ProductStatus } from '../../types';

export function LabelRequestForm() {
  const addRequest = useStore((state) => state.addRequest);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileUploadInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    
    const request = {
      id: crypto.randomUUID(),
      labelCode: formData.get('labelCode') as string,
      requestDate: new Date().toISOString(),
      labelName: formData.get('labelName') as string,
      unitQuantity: Number(formData.get('unitQuantity')),
      dimensions: formData.get('dimensions') as string,
      company: formData.get('company') as Company,
      fileLink: formData.get('fileLink') as string,
      fileUpload: fileUploadInput.files?.[0] || '',
      purchasingSendDate: new Date().toISOString(),
      productStatus: formData.get('productStatus') as ProductStatus,
      finishing: formData.get('finishing') as string,
      observation: formData.get('observation') as string,
      status: 'forwarded-to-purchasing',
      department: 'marketing',
      files: [],
      timeline: [{
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        description: 'Solicitação criada',
        type: 'info',
        department: 'marketing'
      }]
    };

    addRequest(request);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="labelCode" className="block text-sm font-medium text-gray-700">
            Código do Rótulo
          </label>
          <input
            type="text"
            name="labelCode"
            id="labelCode"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="labelName" className="block text-sm font-medium text-gray-700">
            Nome do Rótulo
          </label>
          <input
            type="text"
            name="labelName"
            id="labelName"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="unitQuantity" className="block text-sm font-medium text-gray-700">
            Quantidade Unitária
          </label>
          <input
            type="number"
            name="unitQuantity"
            id="unitQuantity"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
            Tamanho (X por Y)
          </label>
          <input
            type="text"
            name="dimensions"
            id="dimensions"
            required
            placeholder="Ex: 10cm x 15cm"
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
            <option value="third-party">Terceiros</option>
            <option value="others">Outros</option>
          </select>
        </div>

        <div>
          <label htmlFor="productStatus" className="block text-sm font-medium text-gray-700">
            Status do Produto
          </label>
          <select
            name="productStatus"
            id="productStatus"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="new">Novo</option>
            <option value="priority">Prioridade</option>
            <option value="launch">Lançamento</option>
            <option value="repeat">Repetição</option>
            <option value="reprocess">Reprocesso</option>
          </select>
        </div>

        <div>
          <label htmlFor="fileLink" className="block text-sm font-medium text-gray-700">
            Link do Arquivo
          </label>
          <input
            type="url"
            name="fileLink"
            id="fileLink"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
            Upload de Arquivo
          </label>
          <input
            type="file"
            name="fileUpload"
            id="fileUpload"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="finishing" className="block text-sm font-medium text-gray-700">
            Acabamento
          </label>
          <input
            type="text"
            name="finishing"
            id="finishing"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="observation" className="block text-sm font-medium text-gray-700">
            Observação
          </label>
          <textarea
            name="observation"
            id="observation"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Solicitar Rótulo
        </Button>
      </div>
    </form>
  );
}