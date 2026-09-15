export type SkillTrade = 'MASON' | 'CARPENTER' | 'BAR_BENDER' | 'ELECTRICIAN' | 'PLUMBER' | 'PAINTER' | 'HELPER';
export type WorkerCategory = 'SKILLED' | 'SEMI_SKILLED' | 'UNSKILLED' | 'SUBCONTRACTOR';

export interface Worker {
  id: string;
  fullName: string;
  nic: string;
  category: WorkerCategory;
  trade: SkillTrade;
  dailyWageLKR: number;
  epfNumber?: string;
  bankAccountDetails?: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  projectId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  overtimeHours: number;
  isSundayHoliday: boolean;
}
