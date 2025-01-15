import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface SimpleDesignAssistantProps {
  designData?: {
    totalClusters: number
  }
  onUpdate: (update: { type: string; value: number }) => void
}

export const SimpleDesignAssistant = ({ designData, onUpdate }: SimpleDesignAssistantProps) => {
  const [command, setCommand] = useState('')
  const [recentChanges, setRecentChanges] = useState<string[]>([])

  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value)
  }

  const processCommand = (inputCommand: string) => {
    const commandLower = inputCommand.toLowerCase()
    
    if (commandLower.includes('total clusters')) {
      const matches = commandLower.match(/\d+/)
      if (matches) {
        const newValue = parseInt(matches[0])
        onUpdate({
          type: 'UPDATE_TOTAL_CLUSTERS',
          value: newValue
        })
        setRecentChanges([
          `Changed total clusters to ${newValue}`,
          ...recentChanges.slice(0, 4)
        ])
        toast.success(`Updated total clusters to ${newValue}`)
      } else {
        toast.error("Could not find a number in your command")
      }
    } else {
      toast.error("Command not recognized. Try 'change total clusters to 5'")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim()) {
      processCommand(command.trim())
      setCommand('') // Clear the input after processing
    }
  }

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Design Assistant</h2>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Tell me what needs to be corrected... (e.g., change total clusters to 5)"
              value={command}
              onChange={handleCommandChange}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
            {designData && (
              <div className="text-sm text-gray-600">
                Current total clusters: {designData.totalClusters}
              </div>
            )}
            {recentChanges.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Changes:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {recentChanges.map((change, index) => (
                    <li key={index}>• {change}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}