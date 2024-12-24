import { Header } from "@/components/Header"
import { DesignSpecsForm } from "@/components/design/DesignSpecsForm"
import { ImageUpload } from "@/components/design/ImageUpload"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function NewDesign() {
  const [designImage, setDesignImage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('design_images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('design_images')
        .getPublicUrl(filePath)

      setDesignImage(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      // Save form data to production_details table
      const { error } = await supabase
        .from('production_details')
        .insert([
          {
            ...formData,
            dimensions_ft: parseInt(formData.length),
            colors: formData.colorClusters.map((c: any) => c.color),
          }
        ])

      if (error) throw error

      toast.success('Design saved successfully')
      navigate('/production-forms')
    } catch (error) {
      console.error('Error saving design:', error)
      toast.error('Failed to save design')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Create New Design</h1>
            <p className="text-gray-600">
              Upload your design image and specify the requirements
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <ImageUpload
              title="Design Image"
              description="Upload your balloon design image"
              image={designImage}
              onImageUpload={handleImageUpload}
            />
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DesignSpecsForm
                onSubmit={handleFormSubmit}
                designImage={designImage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}