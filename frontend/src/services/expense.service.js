import api from '../api/axios'

export const expenseService = {
  getGroupExpenses: (groupId) =>
    api.get(`/api/expense/group/${groupId}`),

  getGroupBalances: (groupId) =>
    api.get(`/api/expense/group/${groupId}/balances`),

  createExpense: (data) =>
    api.post('/api/expense', data),

  deleteExpense: (id) =>
    api.delete(`/api/expense/${id}`),
}
