import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import StudentForm from "@/components/organisms/StudentForm";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleSubmitStudent = async (studentData) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.Id, studentData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(studentData);
        toast.success("Student added successfully!");
      }
      loadStudents();
    } catch (err) {
      toast.error("Failed to save student. Please try again.");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(id);
        toast.success("Student deleted successfully!");
        loadStudents();
      } catch (err) {
        toast.error("Failed to delete student. Please try again.");
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Students</h1>
          <p className="text-gray-600 mt-1">Manage student profiles and enrollment information</p>
        </div>
        <Button onClick={handleAddStudent} className="inline-flex items-center space-x-2">
          <ApperIcon name="UserPlus" className="h-4 w-4" />
          <span>Add Student</span>
        </Button>
      </div>

      <SearchBar
        onSearch={setSearchTerm}
        onFilterChange={setStatusFilter}
        filters={statusFilters}
      />

      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          description="Start building your student database by adding your first student."
          actionLabel="Add Student"
          onAction={handleAddStudent}
          icon="Users"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Enrollment Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr key={student.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/90 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {student.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">ID: {student.Id.toString().padStart(4, "0")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">{student.email}</p>
                        <p className="text-sm text-gray-600">{student.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                          className="p-2"
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.Id)}
                          className="p-2 text-error hover:text-error"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <StudentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitStudent}
        student={editingStudent}
      />
    </div>
  );
};

export default Students;