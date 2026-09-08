import type { DemoCase } from '../interface';

export const getGroups = (cases: readonly DemoCase[]): string[] => [...new Set(cases.map(({ group }) => group))];
