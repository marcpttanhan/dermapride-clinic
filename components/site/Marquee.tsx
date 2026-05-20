export default function Marquee() {
  const items = [
    'ยาแท้','หมอแท้','ขั้นตอนแท้','ราคาแท้',
    'Botox · Allergan','Filler · Restylane','Laser · Q-Switch','Meso Reverse',
    'ยาแท้','หมอแท้','ขั้นตอนแท้','ราคาแท้',
    'Botox · Allergan','Filler · Restylane','Laser · Q-Switch','Meso Reverse',
  ]
  return (
    <div className="dpe-marquee" aria-hidden="true">
      <div className="dpe-marquee-track">
        {items.map((item, i) => <span key={i}>{item}</span>)}
      </div>
    </div>
  )
}
