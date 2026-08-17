const style = {
  section: "grid min-h-screen lg:grid-cols-[1fr_380px]",
  column: "flex flex-col",

  red: "bg-[#D33A23] text-white",
  dark: "bg-[#3A3D39] text-white",
  border: "border-gray-600",

  banner: "flex min-h-[70vh] flex-col justify-between p-10",
  nav: "flex items-center justify-between",
  logo: "text-xl font-bold",

  heroContent: "grid grid-cols-1 items-end gap-6 md:grid-cols-2",
  heading: "text-7xl font-bold tracking-tight",
  description: "text-lg",

  drone: "min-h-[80vh] bg-cover bg-center",

  news: "grid grid-cols-1 border-t md:grid-cols-3",
  card: "border-r p-6",
  cardLast: "p-6",
  newsTitle: "text-lg font-semibold",
  meta: "mt-4 font-mono text-xs text-gray-400",

  sidebar:
    "sticky top-0 flex h-screen flex-col justify-between border-l border-gray-700 bg-[#4A4E4A] text-white",

  sidebarHeader:
    "flex items-start justify-between border-b p-8 border-gray-600",
  sidebarText: "max-w-[200px] text-xl font-medium",
  menu: "rounded bg-gray-700 px-3 py-1 font-mono text-sm uppercase",

  status:
    "flex-1 space-y-2 bg-[#232523] p-8 font-mono text-xs",
  statusTitle: "mb-4 font-sans text-base font-bold",
  binary: "mt-6 text-emerald-400 opacity-80",

  cta:
    "flex h-[250px] flex-col justify-between bg-[#D33A23] p-8 transition-opacity hover:opacity-95",
  arrow: "self-end text-6xl",
  ctaText: "text-2xl font-bold",
};

export function HeroSection() {
  return (
    <section className={style.section}>
      <div className={style.column}>
        <div className={`${style.red} ${style.banner}`}>
          <nav className={style.nav}>
            <span className={style.logo}>SHIFT5</span>
          </nav>

          <div className={style.heroContent}>
            <h1 className={style.heading}>
              Op /
              <br />
              Intelligence
            </h1>

            <p className={style.description}>
              Operational Intelligence for Every Vehicle, Every Fleet, Every
              Mission.
            </p>
          </div>
        </div>

        <div
          className={style.drone}
          style={{ backgroundImage: "url('/drone.jpg')" }}
        />

        <div className={`${style.news} ${style.dark} ${style.border}`}>
          {[
            "Shift5 Recognized as One of Fast Company...",
            "Shift5 Launches Advanced RF-Enabled...",
            "Shift5 Named North American Leader...",
          ].map((title, i) => (
            <article
              key={title}
              className={i < 2 ? style.card : style.cardLast}
            >
              <h3 className={style.newsTitle}>{title}</h3>style.sidebar
              <p className={style.meta}>
                {
                  [
                    "NAMED FOR DEFENSE TECH...",
                    "NEXT-GENERATION CAPABILITY...",
                    "ANALYST FIRM RECOGNIZES...",
                  ][i]
                }
              </p>
            </article>
          ))}
        </div>
      </div>

      <aside className={style.sidebar}>
        <div className={style.sidebarHeader}>
          <p className={style.sidebarText}>
            Powering actionable insights for America's defense...
          </p>

          <button className={style.menu}>Menu</button>
        </div>

        <div className={style.status}>
          <h4 className={style.statusTitle}>System Status</h4>

          <p>01. GPS ..............</p>
          <p>02. RADAR ............</p>
          <p>03. ENGINES ..........</p>

          <div className={style.binary}>
            <p>01001101 00111110</p>
            <p>10010001 00000010</p>
          </div>
        </div>

        <a href="#explore" className={style.cta}>
          <span className={style.arrow}>↗</span>
          <span className={style.ctaText}>Explore the platform.</span>
        </a>
      </aside>
    </section>
  );
}