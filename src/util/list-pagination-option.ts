import { LessThan } from 'typeorm';

export const LIST_PAGINATION_OPTION = (start: number) =>
  start > -1 ? { id: LessThan(start) } : {};
