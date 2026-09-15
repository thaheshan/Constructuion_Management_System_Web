import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createProjectSlice, ProjectSlice } from './slices/projectSlice';
import { createInventorySlice, InventorySlice } from './slices/inventorySlice';

export type RootStore = AuthSlice & ProjectSlice & InventorySlice;

export const useCMSStore = create<RootStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createProjectSlice(...a),
  ...createInventorySlice(...a),
}));
