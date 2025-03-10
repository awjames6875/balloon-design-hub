
// AddBalloonForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import BalloonFormFields from './BalloonFormFields';
import { BalloonType } from '@/types/inventory';
import { addBalloonType } from '@/services/inventoryOperations';
import { validateBalloonType } from '@/utils/inventoryValidation';

interface AddBalloonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddBalloonForm: React.FC<AddBalloonFormProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [formData, setFormData] = useState<Partial<BalloonType>>({
    color: '',
    size: '',
    quantity: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFormChange = (values: Partial<BalloonType>) => {
    setFormData(values);
    // Clear errors for fields that have been changed
    const updatedErrors = { ...errors };
    Object.keys(values).forEach(key => {
      if (key in updatedErrors) {
        delete updatedErrors[key as keyof BalloonType];
      }
    });
    setErrors(updatedErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateBalloonType(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Add some debugging to see what's being submitted
      console.log('Submitting balloon type:', formData);
      
      // Make sure we're passing a clean object to the database
      const balloonType: BalloonType = {
        color: formData.color?.trim() || '',
        size: formData.size || '',
        quantity: typeof formData.quantity === 'number' ? formData.quantity : 0
      };
      
      await addBalloonType(balloonType);
      
      toast.success('Balloon type added successfully');
      setFormData({ color: '', size: '', quantity: 0 });
      
      // Close the dialog and call onSuccess if provided
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding balloon type:', error);
      toast.error('Failed to add balloon type');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <BalloonFormFields 
        initialValues={formData}
        onChange={handleFormChange}
      />
      
      {/* Show validation errors */}
      {Object.entries(errors).length > 0 && (
        <div className="mt-4 text-sm text-red-500">
          {Object.entries(errors).map(([field, message]) => (
            <p key={field}>{message}</p>
          ))}
        </div>
      )}
      
      <DialogFooter className="mt-6">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Adding...' : 'Add Balloon Type'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddBalloonForm;
