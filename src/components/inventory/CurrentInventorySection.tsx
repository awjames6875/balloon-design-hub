
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BalloonType } from '@/types/inventory';
import AddBalloonForm from './AddBalloonForm';
import BalloonInventoryTable from './BalloonInventoryTable';

interface CurrentInventorySectionProps {
  balloonTypes: BalloonType[];
  onBalloonAdded?: () => void;
  onQuantityUpdate?: () => void;
}

const CurrentInventorySection: React.FC<CurrentInventorySectionProps> = ({
  balloonTypes,
  onBalloonAdded,
  onQuantityUpdate
}) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleAddSuccess = () => {
    // Call the onBalloonAdded callback if it exists
    if (onBalloonAdded) {
      onBalloonAdded();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Current Inventory</h2>
        <Button onClick={() => setIsAddFormOpen(true)}>Add Balloon Type</Button>
      </div>
      
      <BalloonInventoryTable 
        balloonTypes={balloonTypes} 
        onQuantityUpdate={onQuantityUpdate}
      />
      
      <AddBalloonForm 
        open={isAddFormOpen} 
        onOpenChange={setIsAddFormOpen} 
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default CurrentInventorySection;
