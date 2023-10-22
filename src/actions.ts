import { Action } from './action';
import { Save } from './actions/save';

export const Actions: Action[] = [Save];

export function imagineActions(count: number): Action[] {
  return [Save];
}
