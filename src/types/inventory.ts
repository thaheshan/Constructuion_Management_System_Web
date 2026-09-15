export type MaterialCategory = 
  | 'CEMENT_CONCRETE'
  | 'STEEL_REINFORCEMENT'
  | 'BRICKS_MASONRY'
  | 'TIMBER_ROOFING'
  | 'ELECTRICAL'
  | 'PLUMBING_SANITARY'
  | 'FINISHING'
  | 'HARDWARE'
  | 'TOOLS_EQUIPMENT'
  | 'FUEL_LUBRICANTS';

export interface MaterialItem {
  id: string;
  sku: string;
  name: string;
  category: MaterialCategory;
  unitOfMeasure: string;
  currentStock: number;
  minStockLevel: number;
  lastPurchasePriceLKR: number;
  avgCostLKR: number;
  location: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  projectId: string;
  totalAmountLKR: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'RECEIVED' | 'REJECTED';
  approvedByOwner: boolean;
}
