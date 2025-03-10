
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BalloonType } from '@/types/inventory';
import { getBalloonTypes } from '@/services/inventoryOperations';
import NavigationCard from '@/components/NavigationCard';
import CurrentInventorySection from '@/components/inventory/CurrentInventorySection';

const Index = () => {
  const [balloonTypes, setBalloonTypes] = useState<BalloonType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const data = await getBalloonTypes();
      setBalloonTypes(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleBalloonAdded = () => {
    // Refresh inventory data when a new balloon is added
    fetchInventory();
  };

  const handleQuantityUpdate = () => {
    // Refresh inventory data when a quantity is updated
    fetchInventory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-5 py-8 md:px-10">
        <div className="grid grid-cols-1 gap-8 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <h1 className="text-3xl md:text-4xl font-bold text-center flex-1">Inventory Management</h1>
            <NavigationCard />
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">Loading inventory data...</div>
          ) : (
            <CurrentInventorySection 
              balloonTypes={balloonTypes} 
              onBalloonAdded={handleBalloonAdded}
              onQuantityUpdate={handleQuantityUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
