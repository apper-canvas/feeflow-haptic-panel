import remindersData from "@/services/mockData/reminders.json";

let reminders = [...remindersData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const reminderService = {
  async getAll() {
    await delay();
    return [...reminders];
  },

  async getById(id) {
    await delay();
    return reminders.find(reminder => reminder.Id === parseInt(id));
  },

  async create(reminderData) {
    await delay();
    const newReminder = {
      ...reminderData,
      Id: Math.max(...reminders.map(r => r.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    reminders.push(newReminder);
    return newReminder;
  },

  async update(id, reminderData) {
    await delay();
    const index = reminders.findIndex(reminder => reminder.Id === parseInt(id));
    if (index !== -1) {
      reminders[index] = { 
        ...reminders[index], 
        ...reminderData,
        updatedAt: new Date().toISOString()
      };
      return reminders[index];
    }
    throw new Error("Reminder not found");
  },

  async delete(id) {
    await delay();
    const index = reminders.findIndex(reminder => reminder.Id === parseInt(id));
    if (index !== -1) {
      const deletedReminder = reminders.splice(index, 1)[0];
      return deletedReminder;
    }
    throw new Error("Reminder not found");
  },

  async toggleActive(id) {
    await delay();
    const index = reminders.findIndex(reminder => reminder.Id === parseInt(id));
    if (index !== -1) {
      reminders[index].isActive = !reminders[index].isActive;
      reminders[index].updatedAt = new Date().toISOString();
      return reminders[index];
    }
    throw new Error("Reminder not found");
  }
};