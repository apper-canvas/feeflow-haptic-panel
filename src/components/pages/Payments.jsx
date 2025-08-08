import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import PaymentForm from "@/components/organisms/PaymentForm";
import ApperIcon from "@/components/ApperIcon";
import { paymentService } from "@/services/api/paymentService";
import { studentService } from "@/services/api/studentService";
import { feeService } from "@/services/api/feeService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [paymentsData, studentsData, feesData] = await Promise.all([
        paymentService.getAll(),
        studentService.getAll(),
        feeService.getAll()
      ]);
      setPayments(paymentsData);
      setStudents(studentsData);
      setFees(feesData);
    } catch (err) {
      setError("Failed to load payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleSubmitPayment = async (paymentData) => {
    try {
      if (editingPayment) {
        await paymentService.update(editingPayment.Id, paymentData);
        toast.success("Payment updated successfully!");
      } else {
        await paymentService.create(paymentData);
        toast.success("Payment recorded successfully!");
      }
      loadData();
    } catch (err) {
      toast.error("Failed to save payment. Please try again.");
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await paymentService.delete(id);
        toast.success("Payment deleted successfully!");
        loadData();
      } catch (err) {
        toast.error("Failed to delete payment. Please try again.");
      }
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? student.name : "Unknown Student";
  };

  const getFeeName = (feeId) => {
    const fee = fees.find(f => f.Id === feeId);
    return fee ? fee.name : "Unknown Fee";
  };

  const filteredPayments = payments.filter(payment => {
    const studentName = getStudentName(payment.studentId);
    const feeName = getFeeName(payment.feeId);
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Payments</h1>
          <p className="text-gray-600 mt-1">Track and manage all payment transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => window.location.href = '/reminders'} 
            variant="outline"
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name="Settings" className="h-4 w-4" />
            <span>Reminder Config</span>
          </Button>
          <Button onClick={handleAddPayment} className="inline-flex items-center space-x-2">
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>Record Payment</span>
          </Button>
        </div>
      </div>

      <SearchBar
        onSearch={setSearchTerm}
        onFilterChange={setStatusFilter}
        filters={statusFilters}
      />

      {filteredPayments.length === 0 ? (
        <Empty
          title="No payments found"
          description="Start tracking payments by recording your first transaction."
          actionLabel="Record Payment"
          onAction={handleAddPayment}
          icon="Wallet"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fee</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/90 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{getStudentName(payment.studentId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getFeeName(payment.feeId)}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">${payment.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-gray-600">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPayment(payment)}
                          className="p-2"
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePayment(payment.Id)}
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

      <PaymentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitPayment}
        payment={editingPayment}
        students={students}
        fees={fees}
      />
    </div>
  );
};

export default Payments;