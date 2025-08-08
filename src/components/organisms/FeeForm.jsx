import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";

const FeeForm = ({ isOpen, onClose, onSubmit, fee = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    dueDate: "",
    recurring: false,
    frequency: "monthly"
  });

  useEffect(() => {
    if (fee) {
      setFormData({
        name: fee.name,
        amount: fee.amount.toString(),
        category: fee.category,
        dueDate: fee.dueDate,
        recurring: fee.recurring,
        frequency: fee.frequency
      });
    } else {
      setFormData({
        name: "",
        amount: "",
        category: "",
        dueDate: "",
        recurring: false,
        frequency: "monthly"
      });
    }
  }, [fee]);

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={fee ? "Edit Fee" : "Add New Fee"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Fee Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter fee name"
          required
        />

        <Input
          label="Amount ($)"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          placeholder="0.00"
          required
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          required
        >
          <option value="">Select category</option>
          <option value="Tuition">Tuition</option>
          <option value="Books">Books</option>
          <option value="Activities">Activities</option>
          <option value="Equipment">Equipment</option>
          <option value="Other">Other</option>
        </Select>

        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Recurring Fee
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.recurring}
              onChange={(e) => handleChange("recurring", e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">This is a recurring fee</span>
          </label>
        </div>

        {formData.recurring && (
          <Select
            label="Frequency"
            value={formData.frequency}
            onChange={(e) => handleChange("frequency", e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </Select>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {fee ? "Update Fee" : "Add Fee"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeeForm;