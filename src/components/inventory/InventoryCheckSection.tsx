
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BalloonType } from '@/types/inventory';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface InventoryCheckSectionProps {
  balloonTypes: BalloonType[];
  refreshTrigger?: number;
}

type InventoryStatus = 'in-stock' | 'low' | 'out-of-stock';

interface InventoryItem {
  color: string;
  size: string;
  quantity: number;
  required: number;
  status: InventoryStatus;
  remaining: number;
}

const InventoryCheckSection: React.FC<InventoryCheckSectionProps> = ({
  balloonTypes,
  refreshTrigger
}) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  const generateDemoItems = () => {
    if (balloonTypes.length === 0) {
      return [];
    }

    // Create demo inventory check with the actual inventory
    return balloonTypes.slice(0, 5).flatMap(balloon => {
      // For demonstration purposes, we'll show some as in stock, some as low, and some as out
      const required11 = Math.floor(Math.random() * (balloon.quantity + 10));
      const remaining11 = balloon.quantity - required11;
      const status11: InventoryStatus = 
        remaining11 > 10 ? 'in-stock' : 
        remaining11 > 0 ? 'low' : 'out-of-stock';

      const required16 = Math.floor(Math.random() * 20);
      const status16: InventoryStatus = 
        balloon.quantity > required16 * 2 ? 'in-stock' : 
        balloon.quantity > required16 ? 'low' : 'out-of-stock';
      
      return [
        {
          color: balloon.color,
          size: '11in',
          quantity: balloon.quantity,
          required: required11,
          status: status11,
          remaining: Math.max(0, remaining11)
        },
        {
          color: balloon.color,
          size: '16in',
          quantity: balloon.quantity,
          required: required16,
          status: status16,
          remaining: Math.max(0, balloon.quantity - required16)
        }
      ];
    });
  };

  const handleInventoryCheck = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const items = generateDemoItems();
      setInventoryItems(items);
      setShowInventory(true);
      setIsLoading(false);
    }, 800);
  };

  const getStatusIcon = (status: InventoryStatus) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'out-of-stock':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: InventoryStatus) => {
    switch (status) {
      case 'in-stock':
        return <span className="text-green-600">In Stock</span>;
      case 'low':
        return <span className="text-amber-600">Low Stock</span>;
      case 'out-of-stock':
        return <span className="text-red-600">Out of Stock</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-blue-800 text-sm">
              Use inventory check to verify if you have enough balloons for your project.
              This demo shows how the inventory check would work with your actual inventory data.
            </p>
          </div>
          
          {!showInventory ? (
            <div className="text-center py-6">
              <Button 
                onClick={handleInventoryCheck} 
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isLoading ? 'Checking Inventory...' : 'Check Project Inventory'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Balloon Color</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">In Stock</TableHead>
                      <TableHead className="text-right">Required</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item, index) => (
                      <TableRow key={`${item.color}-${item.size}-${index}`}>
                        <TableCell className="font-medium">{item.color}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.required}</TableCell>
                        <TableCell className="text-right">{item.remaining}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {getStatusText(item.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleInventoryCheck} 
                  variant="outline"
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Check
                </Button>
                
                {inventoryItems.length > 0 && !inventoryItems.some(item => item.status === 'out-of-stock') && (
                  <Button className="flex-1">
                    Generate Production Form
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCheckSection;
