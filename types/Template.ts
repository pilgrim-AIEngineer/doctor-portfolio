// Template table row type
export interface Template {
  id: string
  name: 'classic' | 'modern' | 'bold' | 'oncology'
  preview_image: string
  is_active: boolean
}
