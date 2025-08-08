import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";

const PaymentForm = ({ isOpen, onClose, onSubmit, payment = null, students = [], fees = [] }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    feeId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    method: "cash",
    reference: "",
    status: "completed"
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        studentId: payment.studentId,
        feeId: payment.feeId,
        amount: payment.amount.toString(),
        paymentDate: payment.paymentDate,
        method: payment.method,
        reference: payment.reference || "",
        status: payment.status
      });
    } else {
      setFormData({
        studentId: "",
        feeId: "",
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        method: "cash",
        reference: "",
        status: "completed"
      });
    }
  }, [payment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    onSubmit(submitData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedStudent = students.find(s => s.Id === parseInt(formData.studentId));
  const selectedFee = fees.find(f => f.Id === parseInt(formData.feeId));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={payment ? "Edit Payment" : "Record New Payment"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Student"
          value={formData.studentId}
          onChange={(e) => handleChange("studentId", e.target.value)}
          required
        >
          <option value="">Select student</option>
          {students.map((student) => (
            <option key={student.Id} value={student.Id}>
              {student.name}
            </option>
          ))}
        </Select>

        <Select
          label="Fee"
          value={formData.feeId}
          onChange={(e) => handleChange("feeId", e.target.value)}
          required
        >
          <option value="">Select fee</option>
          {fees.map((fee) => (
            <option key={fee.Id} value={fee.Id}>
              {fee.name} - ${fee.amount}
            </option>
          ))}
        </Select>

        {selectedFee && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Fee Amount: <span className="font-semibold">${selectedFee.amount}</span>
            </p>
          </div>
        )}

        <Input
          label="Payment Amount ($)"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          placeholder="0.00"
          required
        />

        <Input
          label="Payment Date"
          type="date"
          value={formData.paymentDate}
          onChange={(e) => handleChange("paymentDate", e.target.value)}
          required
        />

        <Select
          label="Payment Method"
          value={formData.method}
          onChange={(e) => handleChange("method", e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="transfer">Bank Transfer</option>
          <option value="check">Check</option>
        </Select>

        <Input
          label="Reference Number (Optional)"
          value={formData.reference}
          onChange={(e) => handleChange("reference", e.target.value)}
          placeholder="Enter reference number"
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </Select>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {payment ? "Update Payment" : "Record Payment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentForm;