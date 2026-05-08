// Shared utility functions
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10)
  return `+91${digits}`
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
