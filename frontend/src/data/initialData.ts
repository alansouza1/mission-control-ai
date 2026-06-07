/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RawCycle } from '../types/mission';

/**
 * Exact data implemented in the Python project version.
 * Order: [temperature, communication, battery, oxygen, stability]
 */
export const INITIAL_CYCLES: RawCycle[] = [
  [22, 95, 92, 98, 96],
  [25, 89, 85, 95, 91],
  [29, 76, 72, 93, 84],
  [33, 61, 57, 89, 73],
  [37, 45, 41, 84, 58],
  [35, 52, 48, 86, 63]
];

export const MISSION_NAME = 'Orion Sentinel';
export const MISSION_TEAM = 'Horizon';
