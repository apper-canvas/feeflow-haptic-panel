import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import InvoiceViewer from "@/components/organisms/InvoiceViewer";
import ApperIcon from "@/components/ApperIcon";
import { invoiceService } from "@/services/api/invoiceService";
import { studentService } from "@/services/api/studentService";
import { feeService } from "@/services/api/feeService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [invoicesData, studentsData, feesData] = await Promise.all([
        invoiceService.getAll(),
        studentService.getAll(),
        feeService.getAll()
      ]);
      setInvoices(invoicesData);
      setStudents(studentsData);
      setFees(feesData);
    } catch (err) {
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInvoice = async () => {
    try {
      const newInvoice = {
        studentId: students[0]?.Id || 1,
        fees: [fees[0]?.Id || 1],
        totalAmount: fees[0]?.amount || 100,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "unpaid"
      };
      
      await invoiceService.create(newInvoice);
      toast.success("Invoice created successfully!");
      loadData();
    } catch (err) {
      toast.error("Failed to create invoice. Please try again.");
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await invoiceService.delete(id);
        toast.success("Invoice deleted successfully!");
        loadData();
      } catch (err) {
        toast.error("Failed to delete invoice. Please try again.");
      }
    }
  };

  const handleViewInvoice = (invoice) => {
    setViewingInvoice(invoice);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? student.name : "Unknown Student";
  };

  const getStudent = (studentId) => {
    return students.find(s => s.Id === studentId);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const studentName = getStudentName(invoice.studentId);
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { value: "unpaid", label: "Unpaid" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and track all student invoices</p>
        </div>
        <Button onClick={handleCreateInvoice} className="inline-flex items-center space-x-2">
          <ApperIcon name="FileText" className="h-4 w-4" />
          <span>Create Invoice</span>
        </Button>
      </div>

      <SearchBar
        onSearch={setSearchTerm}
        onFilterChange={setStatusFilter}
        filters={statusFilters}
      />

      {filteredInvoices.length === 0 ? (
        <Empty
          title="No invoices found"
          description="Generate your first invoice to start tracking fee collections."
          actionLabel="Create Invoice"
          onAction={handleCreateInvoice}
          icon="FileText"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Invoice</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => {
                  const isOverdue = invoice.status !== "paid" && new Date(invoice.dueDate) < new Date();
                  
                  return (
                    <tr key={invoice.Id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-info to-info/90 rounded-lg flex items-center justify-center">
                            <ApperIcon name="FileText" className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">#{invoice.Id.toString().padStart(4, "0")}</p>
                            <p className="text-xs text-gray-500">
                              Created: {format(new Date(invoice.createdDate), "MMM dd")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{getStudentName(invoice.studentId)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">${invoice.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${isOverdue ? "text-error font-medium" : "text-gray-900"}`}>
                          {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                          {isOverdue && (
                            <p className="text-xs text-error">Overdue</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={isOverdue && invoice.status !== "paid" ? "overdue" : invoice.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-2"
                          >
                            <ApperIcon name="Eye" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice.Id)}
                            className="p-2 text-error hover:text-error"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <InvoiceViewer
        isOpen={!!viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        invoice={viewingInvoice}
        student={viewingInvoice ? getStudent(viewingInvoice.studentId) : null}
        fees={fees}
      />
    </div>
  );
};

export default Invoices;