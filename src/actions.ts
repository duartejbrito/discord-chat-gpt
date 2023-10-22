import { Action } from './action';
import { Reroll } from './actions/reroll';
import { Save } from './actions/save';

export const Actions: Action[] = [Save, Reroll];

export function imagineActions(count: number): Action[] {
  return [Reroll, Save];
}
