import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import { studentService } from "@/services/api/studentService";
import { feeService } from "@/services/api/feeService";
import { paymentService } from "@/services/api/paymentService";
import { invoiceService } from "@/services/api/invoiceService";
import { format } from "date-fns";

const Dashboard = () => {
  const [data, setData] = useState({
    students: [],
    fees: [],
    payments: [],
    invoices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, fees, payments, invoices] = await Promise.all([
        studentService.getAll(),
        feeService.getAll(),
        paymentService.getAll(),
        invoiceService.getAll()
      ]);

      setData({ students, fees, payments, invoices });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const totalCollected = data.payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = data.invoices
    .filter(i => i.status === "unpaid" || i.status === "partial")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const overdueInvoices = data.invoices.filter(i => 
    i.status !== "paid" && new Date(i.dueDate) < new Date()
  );

  const collectionRate = data.invoices.length > 0 
    ? ((data.invoices.filter(i => i.status === "paid").length / data.invoices.length) * 100).toFixed(1)
    : 0;

  const recentPayments = data.payments
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Collected"
          value={`$${totalCollected.toLocaleString()}`}
          change="+12.5%"
          icon="DollarSign"
          color="success"
          trend="up"
        />
        <StatCard
          title="Pending Amount"
          value={`$${pendingAmount.toLocaleString()}`}
          change="-5.2%"
          icon="Clock"
          color="warning"
          trend="down"
        />
        <StatCard
          title="Overdue Fees"
          value={overdueInvoices.length.toString()}
          change="+2"
          icon="AlertTriangle"
          color="error"
          trend="up"
        />
        <StatCard
          title="Collection Rate"
          value={`${collectionRate}%`}
          change="+3.1%"
          icon="TrendingUp"
          color="info"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentPayments.map((payment) => {
              const student = data.students.find(s => s.Id === payment.studentId);
              const fee = data.fees.find(f => f.Id === payment.feeId);
              
              return (
                <div key={payment.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/90 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student?.name}</p>
                      <p className="text-sm text-gray-600">{fee?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${payment.amount}</p>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Overdue Invoices */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Overdue Invoices</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {overdueInvoices.slice(0, 5).map((invoice) => {
              const student = data.students.find(s => s.Id === invoice.studentId);
              const daysPastDue = Math.floor(
                (new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div key={invoice.Id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-error to-error/90 rounded-full flex items-center justify-center">
                      <ApperIcon name="AlertTriangle" className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student?.name}</p>
                      <p className="text-sm text-error">{daysPastDue} days overdue</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${invoice.totalAmount}</p>
                    <p className="text-xs text-gray-500">Due: {format(new Date(invoice.dueDate), "MMM dd")}</p>
                  </div>
                </div>
              );
            })}
            {overdueInvoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="CheckCircle" className="h-12 w-12 mx-auto mb-2 text-success" />
                <p>No overdue invoices!</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="h-16 flex-col space-y-1">
            <ApperIcon name="UserPlus" className="h-6 w-6" />
            <span>Add Student</span>
          </Button>
          <Button variant="secondary" className="h-16 flex-col space-y-1">
            <ApperIcon name="Plus" className="h-6 w-6" />
            <span>Create Fee</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col space-y-1">
            <ApperIcon name="Wallet" className="h-6 w-6" />
            <span>Record Payment</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col space-y-1">
            <ApperIcon name="FileText" className="h-6 w-6" />
            <span>Generate Invoice</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;