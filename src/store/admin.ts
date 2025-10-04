import { create } from 'zustand';
import apiClient from '../utils/apiClient';

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  statusCounts: Record<string, number>;
  topSellingProducts: Array<{
    id: string;
    name: string;
    image: string;
    totalSold: number;
    totalRevenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    customer: string;
    email: string;
    createdAt: string;
  }>;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  vat: number;
  shipping: number;
  grandTotal: number;
  payment: string;
  address: any;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    totalPrice: number;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

type AdminState = {
  stats: AdminStats | null;
  orders: AdminOrder[];
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  createUser: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
  }) => Promise<AdminUser>;
  updateUser: (userId: string, userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: string;
  }) => Promise<AdminUser>;
  deleteUser: (userId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  orders: [],
  users: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/admin/dashboard');
      set({ stats: response.data.data, loading: false });
    } catch (error: any) {
      console.error('Failed to fetch admin stats:', error);
      set({ error: 'Failed to fetch statistics', loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/admin/orders');
      set({ orders: response.data.data, loading: false });
    } catch (error: any) {
      console.error('Failed to fetch admin orders:', error);
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/admin/users');
      set({ users: response.data.data, loading: false });
    } catch (error: any) {
      console.error('Failed to fetch admin users:', error);
      set({ error: 'Failed to fetch users', loading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status });
      
      // Update local state
      set(state => ({
        orders: state.orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        ),
        loading: false
      }));
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      set({ error: 'Failed to update order status', loading: false });
    }
  },

  deleteOrder: async (orderId: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/admin/orders/${orderId}`);
      
      // Update local state
      set(state => ({
        orders: state.orders.filter(order => order.id !== orderId),
        loading: false
      }));
    } catch (error: any) {
      console.error('Failed to delete order:', error);
      set({ error: 'Failed to delete order', loading: false });
    }
  },

  createUser: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
  }) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/admin/users', userData);
      
      // Update local state
      set(state => ({
        users: [...state.users, response.data.data],
        loading: false
      }));
      
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to create user:', error);
      set({ error: 'Failed to create user', loading: false });
      throw error;
    }
  },

  updateUser: async (userId: string, userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: string;
  }) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      
      // Update local state
      set(state => ({
        users: state.users.map(user => 
          user.id === userId ? response.data.data : user
        ),
        loading: false
      }));
      
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to update user:', error);
      set({ error: 'Failed to update user', loading: false });
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      
      // Update local state
      set(state => ({
        users: state.users.filter(user => user.id !== userId),
        loading: false
      }));
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      set({ error: 'Failed to delete user', loading: false });
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/admin/products/${productId}`);
      
      // Update local state - remove from products store
      // Note: This will need to be handled in the products store
      set({ loading: false });
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      set({ error: 'Failed to delete product', loading: false });
      throw error;
    }
  }
}));
