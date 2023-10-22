import { Action } from './action';
import { Expand } from './actions/expand';
import { Reroll } from './actions/reroll';
import { Save } from './actions/save';

export const Actions: Action[] = [Save, Reroll, Expand];

export function imagineActions(count: number): Action[] {
  return [Reroll, Save, Expand];
}

export function expandActions(count: number): Action[] {
  return [Save, Expand];
}
