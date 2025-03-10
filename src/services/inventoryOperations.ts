
// This file re-exports all inventory operations from the new modular structure
// for backwards compatibility with existing code
import { 
  getBalloonTypes 
} from './inventory/fetchOperations';

import { 
  addBalloonType,
  addNewBalloonType 
} from './inventory/addOperations';

import { 
  updateBalloonQuantity 
} from './inventory/updateOperations';

import { 
  enableRealtimeForInventory 
} from './inventory/realtimeOperations';

// Re-export everything for backwards compatibility
export {
  getBalloonTypes,
  addBalloonType,
  addNewBalloonType,
  updateBalloonQuantity,
  enableRealtimeForInventory
};
