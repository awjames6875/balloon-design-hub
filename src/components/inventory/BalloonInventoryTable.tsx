
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BalloonType } from '@/types/inventory';
import { InventoryUpdateForm } from "./InventoryUpdateForm";

interface BalloonInventoryTableProps {
  balloonTypes: BalloonType[];
  onQuantityUpdate?: () => void;
}

const BalloonInventoryTable: React.FC<BalloonInventoryTableProps> = ({
  balloonTypes,
  onQuantityUpdate
}) => {
  if (balloonTypes.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No balloon types found. Add some inventory to get started.</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Balloon Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">In Stock</TableHead>
            <TableHead>Update Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balloonTypes.map((balloon, index) => (
            <TableRow key={`${balloon.color}-${balloon.size}-${index}`}>
              <TableCell className="font-medium">{balloon.color}</TableCell>
              <TableCell>{balloon.size}</TableCell>
              <TableCell className="text-right">{balloon.quantity}</TableCell>
              <TableCell>
                <InventoryUpdateForm
                  color={balloon.color}
                  size={balloon.size}
                  currentQuantity={balloon.quantity}
                  onUpdate={onQuantityUpdate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BalloonInventoryTable;
