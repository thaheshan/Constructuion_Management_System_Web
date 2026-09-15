export interface PayrollRecord {
  id: string;
  workerId: string;
  monthYear: string;
  basicSalaryLKR: number;
  overtimeLKR: number;
  allowancesLKR: number;
  grossPayLKR: number;
  epfEmployeeLKR: number; // 8%
  epfEmployerLKR: number; // 12%
  etfEmployerLKR: number; // 3%
  payeTaxLKR: number;
  advanceDeductionLKR: number;
  netPayLKR: number;
}
