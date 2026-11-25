export const DEFAULT_PO_AUTO_APPROVE_LIMIT_LKR = 50_000;
export const DEFAULT_WEEKLY_DIGEST_SCHEDULE = 'Monday at 8:00 AM';
export const DEFAULT_INVENTORY_VALUATION = 'FIFO';

export const OWNER_STARTING_DEFAULTS: readonly string[] = [
  `PO approval limits set to auto-approve below LKR ${DEFAULT_PO_AUTO_APPROVE_LIMIT_LKR.toLocaleString('en-US')}`,
  `Weekly operational digest sent every ${DEFAULT_WEEKLY_DIGEST_SCHEDULE}`,
  `Standard inventory valuation (${DEFAULT_INVENTORY_VALUATION}) enabled`,
];
