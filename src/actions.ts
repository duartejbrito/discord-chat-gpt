import { Action } from './action';
import { Expand } from './actions/expand';
import { Reroll } from './actions/reroll';
import { Save } from './actions/save';
import { Variation } from './actions/variation';

export const Actions: Action[] = [Save, Reroll, Expand, Variation];

export function imagineActions(count: number): Action[] {
  return [Reroll, Variation, Save, Expand];
}

export function expandActions(count: number): Action[] {
  return [Save, Expand];
}
