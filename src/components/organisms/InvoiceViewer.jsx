import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import StatusBadge from "@/components/molecules/StatusBadge";
import { format } from "date-fns";

const InvoiceViewer = ({ isOpen, onClose, invoice, student, fees }) => {
  if (!invoice || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceFees = fees.filter(fee => invoice.fees.includes(fee.Id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invoice Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">Invoice #{invoice.Id.toString().padStart(4, "0")}</h2>
            <p className="text-gray-600">Created on {format(new Date(invoice.createdDate), "MMM dd, yyyy")}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="space-y-1">
              <p className="font-medium">{student.name}</p>
              <p className="text-gray-600">{student.email}</p>
              <p className="text-gray-600">{student.phone}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Invoice Details:</h3>
            <div className="space-y-1">
              <p className="text-gray-600">Due Date: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}</p>
              <p className="text-gray-600">Status: <StatusBadge status={invoice.status} /></p>
            </div>
          </div>
        </div>

        {/* Fee Items */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Fee Items</h3>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceFees.map((fee) => (
                  <tr key={fee.Id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{fee.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fee.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">${fee.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="2" className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Total Amount:</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">${invoice.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} className="inline-flex items-center space-x-2">
            <ApperIcon name="Printer" className="h-4 w-4" />
            <span>Print Invoice</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceViewer;