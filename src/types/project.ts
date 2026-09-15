export type ProjectStage = 
  | 'TENDER' 
  | 'AWARDED' 
  | 'PLANNING' 
  | 'IN_PROGRESS' 
  | 'PUNCH_LIST' 
  | 'HANDOVER' 
  | 'COMPLETED' 
  | 'ON_HOLD';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  targetDate: string;
  completionPercentage: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assignedTo: string;
}

export interface Project {
  id: string;
  name: string;
  refNumber: string;
  clientName: string;
  siteAddress: string;
  contractValueLKR: number;
  startDate: string;
  targetCompletionDate: string;
  stage: ProjectStage;
  pmId: string;
  supervisorId: string;
  budgetBreakdown: {
    labour: number;
    materials: number;
    subcontractors: number;
    overheads: number;
  };
}
