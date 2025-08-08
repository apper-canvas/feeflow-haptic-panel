import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import ReminderForm from "@/components/organisms/ReminderForm";
import ApperIcon from "@/components/ApperIcon";
import { reminderService } from "@/services/api/reminderService";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function RemindersConfig() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const loadReminders = async () => {
    try {
      setLoading(true);
      setError("");
      const remindersData = await reminderService.getAll();
      setReminders(remindersData);
    } catch (err) {
      setError("Failed to load reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleAddReminder = () => {
    setEditingReminder(null);
    setShowForm(true);
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleSubmitReminder = async (reminderData) => {
    try {
      if (editingReminder) {
        await reminderService.update(editingReminder.Id, reminderData);
        toast.success("Reminder updated successfully");
      } else {
        await reminderService.create(reminderData);
        toast.success("Reminder created successfully");
      }
      setShowForm(false);
      setEditingReminder(null);
      loadReminders();
    } catch (err) {
      toast.error("Failed to save reminder");
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) {
      return;
    }

    try {
      await reminderService.delete(id);
      toast.success("Reminder deleted successfully");
      loadReminders();
    } catch (err) {
      toast.error("Failed to delete reminder");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await reminderService.toggleActive(id);
      toast.success("Reminder status updated");
      loadReminders();
    } catch (err) {
      toast.error("Failed to update reminder status");
    }
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || reminder.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReminders} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Reminder Configuration</h1>
          <p className="text-gray-600 mt-1">Manage email and SMS reminder templates for payment notifications</p>
        </div>
        <Button onClick={handleAddReminder} className="inline-flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Create Reminder</span>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search reminders..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>

        {filteredReminders.length === 0 ? (
          <Empty
            title="No reminders found"
            description="Create your first reminder template to get started."
            action={
              <Button onClick={handleAddReminder} className="mt-4">
                Create Reminder
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReminders.map((reminder) => (
                  <tr key={reminder.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${reminder.type === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center`}>
                          <ApperIcon name={reminder.type === 'email' ? 'Mail' : 'MessageSquare'} className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{reminder.name}</div>
                          {reminder.subject && (
                            <div className="text-sm text-gray-500 mt-1">Subject: {reminder.subject}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        reminder.type === 'email' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {reminder.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        {reminder.schedule.daysBefore > 0 
                          ? `${reminder.schedule.daysBefore} days before due`
                          : `${Math.abs(reminder.schedule.daysBefore)} days after due`
                        }
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{reminder.schedule.frequency}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(reminder.Id)}
                        className="focus:outline-none"
                      >
                        <StatusBadge status={reminder.isActive ? 'active' : 'inactive'} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(new Date(reminder.updatedAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReminder(reminder)}
                          className="p-2"
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReminder(reminder.Id)}
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
        )}
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Template Variables</h3>
            <p className="text-sm text-blue-700 mt-1">
              Use these variables in your templates - they will be replaced with actual data:
            </p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{{studentName}}'}</code>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{{feeName}}'}</code>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{{amount}}'}</code>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{{dueDate}}'}</code>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{{daysOverdue}}'}</code>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{{contactPhone}}'}</code>
            </div>
          </div>
        </div>
      </Card>

      {showForm && (
        <ReminderForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingReminder(null);
          }}
          onSubmit={handleSubmitReminder}
          initialData={editingReminder}
        />
      )}
    </div>
  );
}