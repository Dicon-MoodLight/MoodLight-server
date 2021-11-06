import { FindOperator, LessThan } from 'typeorm';

export const LIST_PAGINATION_OPTION = (
  start: number,
): { id: FindOperator<number> } | {} =>
  start > -1 ? { id: LessThan(start) } : {};
