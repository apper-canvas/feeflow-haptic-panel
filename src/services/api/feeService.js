import feesData from "@/services/mockData/fees.json";

let fees = [...feesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const feeService = {
  async getAll() {
    await delay();
    return [...fees];
  },

  async getById(id) {
    await delay();
    return fees.find(fee => fee.Id === parseInt(id));
  },

  async create(feeData) {
    await delay();
    const newFee = {
      ...feeData,
      Id: Math.max(...fees.map(f => f.Id)) + 1
    };
    fees.push(newFee);
    return newFee;
  },

  async update(id, feeData) {
    await delay();
    const index = fees.findIndex(fee => fee.Id === parseInt(id));
    if (index !== -1) {
      fees[index] = { ...fees[index], ...feeData };
      return fees[index];
    }
    throw new Error("Fee not found");
  },

  async delete(id) {
    await delay();
    const index = fees.findIndex(fee => fee.Id === parseInt(id));
    if (index !== -1) {
      const deletedFee = fees.splice(index, 1)[0];
      return deletedFee;
    }
    throw new Error("Fee not found");
  }
};