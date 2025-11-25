import { OurFileRouter } from 'config/uploadthing'
import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react'

export const UploadButton: ReturnType<typeof generateUploadButton<OurFileRouter>> =
    generateUploadButton<OurFileRouter>()
export const UploadDropzone: ReturnType<typeof generateUploadDropzone<OurFileRouter>> =
    generateUploadDropzone<OurFileRouter>()
