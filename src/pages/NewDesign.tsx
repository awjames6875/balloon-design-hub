import { useState } from "react"
import { DesignHeader } from "@/components/design/page/DesignHeader"
import { ImageUploadSection } from "@/components/design/page/ImageUploadSection"
import { DesignWorkflow } from "@/components/design/page/DesignWorkflow"

const NewDesign = () => {
  const [designImage, setDesignImage] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <DesignHeader />
      <ImageUploadSection onImageUploaded={setDesignImage} />
      <DesignWorkflow designImage={designImage} />
    </div>
  )
}

export default NewDesign