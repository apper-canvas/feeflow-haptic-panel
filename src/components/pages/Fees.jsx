import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import FeeForm from "@/components/organisms/FeeForm";
import ApperIcon from "@/components/ApperIcon";
import { feeService } from "@/services/api/feeService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const loadFees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await feeService.getAll();
      setFees(data);
    } catch (err) {
      setError("Failed to load fees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handleAddFee = () => {
    setEditingFee(null);
    setShowForm(true);
  };

  const handleEditFee = (fee) => {
    setEditingFee(fee);
    setShowForm(true);
  };

  const handleSubmitFee = async (feeData) => {
    try {
      if (editingFee) {
        await feeService.update(editingFee.Id, feeData);
        toast.success("Fee updated successfully!");
      } else {
        await feeService.create(feeData);
        toast.success("Fee created successfully!");
      }
      loadFees();
    } catch (err) {
      toast.error("Failed to save fee. Please try again.");
    }
  };

  const handleDeleteFee = async (id) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      try {
        await feeService.delete(id);
        toast.success("Fee deleted successfully!");
        loadFees();
      } catch (err) {
        toast.error("Failed to delete fee. Please try again.");
      }
    }
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || fee.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryFilters = [
    { value: "Tuition", label: "Tuition" },
    { value: "Books", label: "Books" },
    { value: "Activities", label: "Activities" },
    { value: "Equipment", label: "Equipment" },
    { value: "Other", label: "Other" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadFees} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Fee Structure</h1>
          <p className="text-gray-600 mt-1">Manage fee categories, amounts, and payment schedules</p>
        </div>
        <Button onClick={handleAddFee} className="inline-flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Fee</span>
        </Button>
      </div>

      <SearchBar
        onSearch={setSearchTerm}
        onFilterChange={setCategoryFilter}
        filters={categoryFilters}
      />

      {filteredFees.length === 0 ? (
        <Empty
          title="No fees found"
          description="Set up your fee structure by creating your first fee category."
          actionLabel="Add Fee"
          onAction={handleAddFee}
          icon="CreditCard"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFees.map((fee) => (
            <Card key={fee.Id} className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary/90 rounded-lg flex items-center justify-center">
                    <ApperIcon name="CreditCard" className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{fee.name}</h3>
                    <p className="text-sm text-gray-600">{fee.category}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditFee(fee)}
                    className="p-2"
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFee(fee.Id)}
                    className="p-2 text-error hover:text-error"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-lg font-bold text-gray-900">${fee.amount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <span className="text-sm text-gray-900">
                    {format(new Date(fee.dueDate), "MMM dd, yyyy")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recurring</span>
                  {fee.recurring ? (
                    <Badge variant="success" size="sm">
                      {fee.frequency}
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      One-time
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FeeForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitFee}
        fee={editingFee}
      />
    </div>
  );
};

export default Fees;