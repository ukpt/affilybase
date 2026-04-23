export default function Logo({ size = 'md', dark = false }: { size?: 'sm' | 'md' | 'lg', dark?: boolean }) {
  const sizes = {
    sm: { affily: '20px', base: '8px', line: '50px' },
    md: { affily: '28px', base: '10px', line: '70px' },
    lg: { affily: '40px', base: '12px', line: '90px' },
  }
  const s = sizes[size]
  const color = dark ? '#F5F0E8' : '#1A1814'
  const subColor = '#7A7468'

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'}}>
      <span style={{fontFamily: 'Georgia, serif', fontSize: s.affily, fontWeight: '700', color, letterSpacing: '-0.5px', lineHeight: 1}}>Affily</span>
      <div style={{width: s.line, height: '1.5px', background: color, opacity: 0.15}}></div>
      <span style={{fontFamily: 'sans-serif', fontSize: s.base, color: subColor, letterSpacing: '5px', textTransform: 'uppercase'}}>Base</span>
    </div>
  )
}