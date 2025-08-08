import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Modal from "@/components/atoms/Modal";

export default function ReminderForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "email",
    subject: "",
    template: "",
    isActive: true,
    schedule: {
      daysBefore: 7,
      frequency: "once"
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "email",
        subject: initialData.subject || "",
        template: initialData.template || "",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        schedule: {
          daysBefore: initialData.schedule?.daysBefore || 7,
          frequency: initialData.schedule?.frequency || "once"
        }
      });
    } else {
      setFormData({
        name: "",
        type: "email",
        subject: "",
        template: "",
        isActive: true,
        schedule: {
          daysBefore: 7,
          frequency: "once"
        }
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    }

    if (formData.type === "email" && !formData.subject.trim()) {
      newErrors.subject = "Email subject is required";
    }

    if (!formData.template.trim()) {
      newErrors.template = "Template content is required";
    }

    if (!formData.schedule.daysBefore && formData.schedule.daysBefore !== 0) {
      newErrors.daysBefore = "Schedule timing is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const insertVariable = (variable) => {
    const textarea = document.querySelector('textarea[name="template"]');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.template;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + `{{${variable}}}` + after;
      
      setFormData(prev => ({
        ...prev,
        template: newText
      }));
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  const templateVariables = [
    'studentName',
    'feeName', 
    'amount',
    'dueDate',
    'daysOverdue',
    'contactPhone'
  ];
];

  const emailTemplate = `Dear \{\{studentName\}\},

This is a reminder that your payment for \{\{feeName\}\} in the amount of $\{\{amount\}\} is due on \{\{dueDate\}\}.

Please make your payment at your earliest convenience.

If you have any questions, please contact us at \{\{contactPhone\}\}.

Thank you,
FeeFlow Team`;

  const smsTemplate = `Hi \{\{studentName\}\}, your payment of $\{\{amount\}\} for \{\{feeName\}\} is due \{\{dueDate\}\}. Pay online or call \{\{contactPhone\}\}.`;
  const useTemplate = () => {
    const template = formData.type === 'email' ? emailTemplate : smsTemplate;
    setFormData(prev => ({
      ...prev,
      template: template,
      subject: formData.type === 'email' ? 'Payment Reminder - {{feeName}}' : ''
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Reminder" : "Create New Reminder"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Template Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            placeholder="e.g., Payment Due Soon - Email"
            required
          />

          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            options={[
              { value: "email", label: "Email" },
              { value: "sms", label: "SMS" }
            ]}
            required
          />

          {formData.type === "email" && (
            <Input
              label="Email Subject"
              name="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              error={errors.subject}
              placeholder="Payment Reminder - {{feeName}}"
              required
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Template Content *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={useTemplate}
              className="text-primary hover:text-primary/80"
            >
              <ApperIcon name="FileText" className="h-4 w-4 mr-1" />
              Use Template
            </Button>
          </div>
          
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {templateVariables.map((variable) => (
                <button
                  key={variable}
                  type="button"
                  onClick={() => insertVariable(variable)}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  {'{{' + variable + '}}'}
                </button>
              ))}
            </div>
          </div>

          <textarea
            name="template"
            rows={formData.type === "email" ? 8 : 4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-vertical"
            value={formData.template}
            onChange={(e) => handleChange("template", e.target.value)}
            placeholder={formData.type === "email" ? "Enter your email template..." : "Enter your SMS template..."}
            required
          />
          {errors.template && <p className="mt-1 text-sm text-error">{errors.template}</p>}
          {formData.type === "sms" && (
            <p className="mt-1 text-xs text-gray-500">
              SMS messages should be concise. Current length: {formData.template.length}/160 characters
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Timing
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="-30"
                max="30"
                className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={formData.schedule.daysBefore}
                onChange={(e) => handleChange("schedule.daysBefore", parseInt(e.target.value) || 0)}
                required
              />
              <span className="text-sm text-gray-600">days</span>
              <select
                className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={formData.schedule.daysBefore >= 0 ? "before" : "after"}
                onChange={(e) => {
                  const isAfter = e.target.value === "after";
                  const currentDays = Math.abs(formData.schedule.daysBefore);
                  handleChange("schedule.daysBefore", isAfter ? -currentDays : currentDays);
                }}
              >
                <option value="before">before due date</option>
                <option value="after">after due date</option>
              </select>
            </div>
            {errors.daysBefore && <p className="mt-1 text-sm text-error">{errors.daysBefore}</p>}
          </div>

          <Select
            label="Frequency"
            name="frequency"
            value={formData.schedule.frequency}
            onChange={(e) => handleChange("schedule.frequency", e.target.value)}
            options={[
              { value: "once", label: "Once" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" }
            ]}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Activate this reminder template
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Reminder" : "Create Reminder"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}