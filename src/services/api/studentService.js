import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const studentService = {
  async getAll() {
    await delay();
    return [...students];
  },

  async getById(id) {
    await delay();
    return students.find(student => student.Id === parseInt(id));
  },

  async create(studentData) {
    await delay();
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id)) + 1
    };
    students.push(newStudent);
    return newStudent;
  },

  async update(id, studentData) {
    await delay();
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
      return students[index];
    }
    throw new Error("Student not found");
  },

  async delete(id) {
    await delay();
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      const deletedStudent = students.splice(index, 1)[0];
      return deletedStudent;
    }
    throw new Error("Student not found");
  }
};