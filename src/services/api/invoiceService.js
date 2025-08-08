import invoicesData from "@/services/mockData/invoices.json";

let invoices = [...invoicesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const invoiceService = {
  async getAll() {
    await delay();
    return [...invoices];
  },

  async getById(id) {
    await delay();
    return invoices.find(invoice => invoice.Id === parseInt(id));
  },

  async create(invoiceData) {
    await delay();
    const newInvoice = {
      ...invoiceData,
      Id: Math.max(...invoices.map(i => i.Id)) + 1,
      createdDate: new Date().toISOString().split("T")[0]
    };
    invoices.push(newInvoice);
    return newInvoice;
  },

  async update(id, invoiceData) {
    await delay();
    const index = invoices.findIndex(invoice => invoice.Id === parseInt(id));
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...invoiceData };
      return invoices[index];
    }
    throw new Error("Invoice not found");
  },

  async delete(id) {
    await delay();
    const index = invoices.findIndex(invoice => invoice.Id === parseInt(id));
    if (index !== -1) {
      const deletedInvoice = invoices.splice(index, 1)[0];
      return deletedInvoice;
    }
    throw new Error("Invoice not found");
  }
};