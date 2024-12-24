import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AutoCalculateSwitch } from "./accessories/AutoCalculateSwitch"
import { AccessoryInput, ACCESSORY_TYPES } from "./accessories/AccessoryInput"
import { AccessoriesTable } from "./accessories/AccessoriesTable"

interface Accessory {
  type: string
  quantity: number
}

interface AccessoriesDetailsFormProps {
  onNext: (accessories: Accessory[]) => void
  extraClusters?: number
}

export const AccessoriesDetailsForm = ({
  onNext,
  extraClusters = 0,
}: AccessoriesDetailsFormProps) => {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [accessoryType, setAccessoryType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [autoCalculate, setAutoCalculate] = useState(true)

  useEffect(() => {
    if (autoCalculate && extraClusters > 0) {
      const calculatedAccessories = [
        {
          type: "Starburst Large",
          quantity: Math.ceil(extraClusters * 0.5),
        },
        {
          type: "Starburst Small",
          quantity: Math.ceil(extraClusters * 0.75),
        },
        {
          type: "Pearl Garland",
          quantity: Math.ceil(extraClusters * 0.25),
        },
      ]
      setAccessories(calculatedAccessories)
    }
  }, [extraClusters, autoCalculate])

  const handleAddAccessory = () => {
    if (!accessoryType || !quantity) {
      toast.error("Please select both accessory type and quantity")
      return
    }

    const quantityNum = parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    const existingIndex = accessories.findIndex((acc) => acc.type === accessoryType)
    if (existingIndex !== -1) {
      const updatedAccessories = [...accessories]
      updatedAccessories[existingIndex].quantity = quantityNum
      setAccessories(updatedAccessories)
      toast.success("Accessory quantity updated")
    } else {
      setAccessories([...accessories, { type: accessoryType, quantity: quantityNum }])
      toast.success("Accessory added successfully")
    }

    setAccessoryType("")
    setQuantity("")
  }

  const handleAutoCalculateChange = (checked: boolean) => {
    setAutoCalculate(checked)
    if (!checked) {
      setAccessories([])
    } else if (extraClusters > 0) {
      const calculatedAccessories = [
        {
          type: "Starburst Large",
          quantity: Math.ceil(extraClusters * 0.5),
        },
        {
          type: "Starburst Small",
          quantity: Math.ceil(extraClusters * 0.75),
        },
        {
          type: "Pearl Garland",
          quantity: Math.ceil(extraClusters * 0.25),
        },
      ]
      setAccessories(calculatedAccessories)
    }
  }

  const handleRemoveAccessory = (type: string) => {
    setAccessories(accessories.filter((acc) => acc.type !== type))
    toast.success("Accessory removed")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Accessories Details</h2>

      <AutoCalculateSwitch
        autoCalculate={autoCalculate}
        onAutoCalculateChange={handleAutoCalculateChange}
      />

      {!autoCalculate && (
        <AccessoryInput
          accessoryType={accessoryType}
          quantity={quantity}
          onTypeChange={setAccessoryType}
          onQuantityChange={setQuantity}
          onAdd={handleAddAccessory}
        />
      )}

      {accessories.length > 0 && (
        <AccessoriesTable
          accessories={accessories}
          autoCalculate={autoCalculate}
          onRemove={!autoCalculate ? handleRemoveAccessory : undefined}
        />
      )}

      <Button
        onClick={() => onNext(accessories)}
        className="w-full"
        disabled={!autoCalculate && accessories.length === 0}
      >
        Next
      </Button>
    </div>
  )
}