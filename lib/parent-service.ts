import {
  children,
  conversations,
  notifications,
  parentAssignments,
  parentInvoices,
  parentSchedule,
} from "@/lib/parent-data";

export const parentService = {
  getChildren: async () => children,
  getSchedule: async () => parentSchedule,
  getAssignments: async () => parentAssignments,
  getInvoices: async () => parentInvoices,
  getConversations: async () => conversations,
  getNotifications: async () => notifications,
};
