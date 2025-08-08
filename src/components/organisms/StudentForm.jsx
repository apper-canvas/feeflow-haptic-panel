import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";

const StudentForm = ({ isOpen, onClose, onSubmit, student = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enrollmentDate: "",
    status: "active"
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        enrollmentDate: student.enrollmentDate,
        status: student.status
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        enrollmentDate: "",
        status: "active"
      });
    }
  }, [student]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? "Edit Student" : "Add New Student"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter student name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter email address"
          required
        />

        <Input
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Enter phone number"
          required
        />

        <Input
          label="Enrollment Date"
          type="date"
          value={formData.enrollmentDate}
          onChange={(e) => handleChange("enrollmentDate", e.target.value)}
          required
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {student ? "Update Student" : "Add Student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentForm;