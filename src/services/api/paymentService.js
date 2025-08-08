import paymentsData from "@/services/mockData/payments.json";

let payments = [...paymentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const paymentService = {
  async getAll() {
    await delay();
    return [...payments];
  },

  async getById(id) {
    await delay();
    return payments.find(payment => payment.Id === parseInt(id));
  },

  async create(paymentData) {
    await delay();
    const newPayment = {
      ...paymentData,
      Id: Math.max(...payments.map(p => p.Id)) + 1
    };
    payments.push(newPayment);
    return newPayment;
  },

  async update(id, paymentData) {
    await delay();
    const index = payments.findIndex(payment => payment.Id === parseInt(id));
    if (index !== -1) {
      payments[index] = { ...payments[index], ...paymentData };
      return payments[index];
    }
    throw new Error("Payment not found");
  },

  async delete(id) {
    await delay();
    const index = payments.findIndex(payment => payment.Id === parseInt(id));
    if (index !== -1) {
      const deletedPayment = payments.splice(index, 1)[0];
      return deletedPayment;
    }
    throw new Error("Payment not found");
  }
};