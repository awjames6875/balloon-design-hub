
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BalloonType } from '@/types/inventory';

interface BalloonFormFieldsProps {
  initialValues?: Partial<BalloonType>;
  onChange: (values: Partial<BalloonType>) => void;
}

const BALLOON_SIZES = ['5 inch', '9 inch', '11 inch', '16 inch', '36 inch'];

const BalloonFormFields: React.FC<BalloonFormFieldsProps> = ({
  initialValues = { color: '', size: '', quantity: 0 },
  onChange
}) => {
  const [formValues, setFormValues] = useState<Partial<BalloonType>>(initialValues);
  
  // Update form values when initialValues change
  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);
  
  const handleChange = (field: keyof BalloonType, value: string | number) => {
    console.log(`Field changed: ${field} = ${value}`);
    
    const newValues = {
      ...formValues,
      [field]: value
    };
    
    setFormValues(newValues);
    onChange(newValues);
  };
  
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          value={formValues.color || ''}
          onChange={(e) => handleChange('color', e.target.value)}
          placeholder="Enter balloon color"
        />
        <div className="text-sm text-muted-foreground">
          Use standard color names like "Wild Berry" or "Golden Rod"
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Select
          value={formValues.size || ''}
          onValueChange={(value) => handleChange('size', value)}
        >
          <SelectTrigger id="size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {BALLOON_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">Initial Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="0"
          value={formValues.quantity || ''}
          onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
          placeholder="Enter quantity"
        />
      </div>
    </div>
  );
};

export default BalloonFormFields;
