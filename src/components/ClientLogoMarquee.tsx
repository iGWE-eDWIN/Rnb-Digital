const clientLogos = [
  { src: '/images/client-logos/client-01.webp', alt: 'Alni client logo' },
  { src: '/images/client-logos/client-02.webp', alt: 'Hotspot Rental Services client logo' },
  { src: '/images/client-logos/client-03.webp', alt: "Bari's Lifestyle client logo" },
  { src: '/images/client-logos/client-04.webp', alt: 'Client logo featuring a green emblem' },
  { src: '/images/client-logos/client-05.webp', alt: 'Talano Oil & Gas client logo' },
  { src: '/images/client-logos/client-06.webp', alt: 'Shop with Mercee client logo' },
  { src: '/images/client-logos/client-07.webp', alt: 'Pandrex Express client logo' },
  { src: '/images/client-logos/client-08.webp', alt: 'Green Pastures Livestock Limited client logo' },
  { src: '/images/client-logos/client-09.webp', alt: 'Estel Beauty client logo' },
  { src: '/images/client-logos/client-10.webp', alt: 'Fizzypay client logo' },
  { src: '/images/client-logos/client-11.webp', alt: 'Kafjans Treats client logo' },
  { src: '/images/client-logos/client-12.webp', alt: 'M. Construction client logo' },
  { src: '/images/client-logos/client-13.webp', alt: 'Treat by Anne client logo' },
  { src: '/images/client-logos/client-14.webp', alt: 'Torus Beauty client logo' },
  { src: '/images/client-logos/client-15.webp', alt: 'MLuxe client logo' },
  { src: '/images/client-logos/client-16.webp', alt: 'Cacin Limited client logo' },
  { src: '/images/client-logos/client-17.webp', alt: 'Goodlife Barbershop Gamehub & Laundromat client logo' },
  { src: '/images/client-logos/client-18.webp', alt: 'Harbour Homes client logo' },
];

export default function ClientLogoMarquee() {
  return (
    <section className="client-marquee-section" aria-label="Our clients">
      <p className="client-marquee-label">Trusted by growing brands</p>
      <div className="client-marquee">
        <div className="client-marquee-track">
          {[0, 1].map((copy) => (
            <div
              className="client-marquee-group"
              key={copy}
              aria-hidden={copy === 1}
            >
              {clientLogos.map((logo, index) => (
                <div className="client-logo-card" key={`${copy}-${index}`}>
                  <img
                    src={logo.src}
                    alt={copy === 0 ? logo.alt : ''}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
