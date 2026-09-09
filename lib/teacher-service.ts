import {
  teacherAssignments,
  teacherClasses,
  teacherNotifications,
  teacherSessions,
  teacherStudents,
} from "./teacher-data";

export const teacherService = {
  async getDashboard() {
    return {
      teacherClasses,
      teacherSessions,
      teacherAssignments,
      teacherStudents,
      teacherNotifications,
    };
  },
  async getClasses() {
    return teacherClasses;
  },
  async getStudents() {
    return teacherStudents;
  },
  async getSchedule() {
    return teacherSessions;
  },
  async getAssignments() {
    return teacherAssignments;
  },
};
