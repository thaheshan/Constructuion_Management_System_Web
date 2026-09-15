import { StateCreator } from 'zustand';
import { MaterialItem, PurchaseOrder } from '../../types/inventory';

export interface InventorySlice {
  materials: MaterialItem[];
  purchaseOrders: PurchaseOrder[];
  lowStockAlerts: MaterialItem[];
  setMaterials: (materials: MaterialItem[]) => void;
  addPurchaseOrder: (po: PurchaseOrder) => void;
}

export const createInventorySlice: StateCreator<InventorySlice> = (set) => ({
  materials: [],
  purchaseOrders: [],
  lowStockAlerts: [],
  setMaterials: (materials) => 
    set({ 
      materials, 
      lowStockAlerts: materials.filter(m => m.currentStock <= m.minStockLevel) 
    }),
  addPurchaseOrder: (po) => set((state) => ({ purchaseOrders: [...state.purchaseOrders, po] })),
});
