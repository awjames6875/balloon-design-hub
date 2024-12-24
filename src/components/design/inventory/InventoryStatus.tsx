interface InventoryStatusProps {
  status: 'in-stock' | 'low' | 'out-of-stock'
}

export const InventoryStatus = ({ status }: InventoryStatusProps) => {
  const getStatusColor = (status: 'in-stock' | 'low' | 'out-of-stock') => {
    switch (status) {
      case 'in-stock':
        return 'text-green-500'
      case 'low':
        return 'text-yellow-500'
      case 'out-of-stock':
        return 'text-red-500'
    }
  }

  const getStatusText = (status: 'in-stock' | 'low' | 'out-of-stock') => {
    switch (status) {
      case 'in-stock':
        return 'In Stock'
      case 'low':
        return 'Low Stock'
      case 'out-of-stock':
        return 'Out of Stock'
    }
  }

  return (
    <span className={getStatusColor(status)}>
      {getStatusText(status)}
    </span>
  )
}