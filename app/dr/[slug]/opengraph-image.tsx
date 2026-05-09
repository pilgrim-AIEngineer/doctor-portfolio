// Generates dynamic OG image for /dr/[slug] — inline styles required (Satori limitation)
// Exception to CLAUDE.md no-inline-styles rule: Satori renders only style props, not Tailwind classes
import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: { slug: string }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default async function OgImage({ params }: Props) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data: doctor } = await supabase
    .from('doctors')
    .select('id, name, specialty')
    .eq('slug', params.slug)
    .single()

  const name = doctor?.name ?? 'DocFolio'
  const specialty = doctor?.specialty ?? 'Indian Doctor Portfolios'
  let photoUrl: string | null = null

  if (doctor?.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('data')
      .eq('doctor_id', doctor.id)
      .eq('section_key', 'personal')
      .single()

    const personal = profile?.data as { photo?: string } | null
    photoUrl = personal?.photo ?? null
  }

  const initials = getInitials(name)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#1d4ed8',
          padding: '64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flex: 1 }}>
          {photoUrl ? (
            <img
              src={photoUrl}
              width={140}
              height={140}
              style={{ borderRadius: '70px', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '70px',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'white', fontSize: '52px', fontWeight: 700 }}>
                {initials}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ color: 'white', fontSize: '52px', fontWeight: 700, lineHeight: 1.1 }}>
              Dr. {name}
            </span>
            <span style={{ color: '#bfdbfe', fontSize: '28px', fontWeight: 400 }}>
              {specialty}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px' }}>
            Beautiful portfolios for Indian doctors
          </span>
          <span style={{ color: 'white', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            DocFolio
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
