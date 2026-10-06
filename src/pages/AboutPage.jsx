import { useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  ArrowDown,
  ArrowRight,
  Award,
  Globe2,
  Hand,
  ShieldCheck,
} from "lucide-react";
import "./AboutPage.css";

const collections = [
  { title: "Gautam Buddha", image: "/Golden Buddha Shrine with Incense and Candlelight.png", alt: "Golden Gautam Buddha statue in a Himalayan shrine", category: "Buddha" },
  { title: "Chenrezig", image: "/chengrezig.webp", alt: "Chenrezig Buddhist statue", category: "Chenrezig" },
  { title: "Manjushree", image: "/Manjushree.webp", alt: "Manjushree Buddhist statue", category: "Manjushri" },
  { title: "Kubera", image: "/kubera.webp", alt: "Kubera statue from the collection", category: "Wealth Deities" },
  { title: "21 Tara", image: "/21TaraStatue.webp", alt: "21 Tara statue from the collection", category: "Tara" },
  { title: "Zhabdrung", image: "/zhabdung.webp", alt: "Zhabdrung statue from the collection", category: "Buddhist Masters" },
   { title: "Gautam Buddha", image: "/Golden Buddha Shrine with Incense and Candlelight.png", alt: "Golden Gautam Buddha statue in a Himalayan shrine", category: "Buddha" },
  { title: "Chenrezig", image: "/chengrezig.webp", alt: "Chenrezig Buddhist statue", category: "Chenrezig" },
  { title: "Manjushree", image: "/Manjushree.webp", alt: "Manjushree Buddhist statue", category: "Manjushri" },
  { title: "Kubera", image: "/kubera.webp", alt: "Kubera statue from the collection", category: "Wealth Deities" },
  { title: "21 Tara", image: "/21TaraStatue.webp", alt: "21 Tara statue from the collection", category: "Tara" },
  { title: "Zhabdrung", image: "/zhabdung.webp", alt: "Zhabdrung statue from the collection", category: "Buddhist Masters" },
];

const features = [
  {
    title: "Authentic craftsmanship",
    description: "Made with skilled artisans in Patan, where metalwork traditions remain a living practice.",
    Icon: Hand,
  },
  {
    title: "Premium materials",
    description: "Copper and bronze forms, finished with carefully selected precious-metal plating.",
    Icon: Award,
  },
  {
    title: "Carefully finished",
    description: "Fine details are refined, polished, and checked with care before each piece is ready.",
    Icon: ShieldCheck,
  },
  {
    title: "Safe worldwide delivery",
    description: "Thoughtfully packed and prepared for delivery to collectors and homes around the world.",
    Icon: Globe2,
  },
];

const Reveal = ({ children, className = "", delay = 0 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`about-reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AboutHero = () => (
  <section className="about-hero">
    <img
      className="about-hero-image"
      src="/Golden Buddha Shrine with Incense and Candlelight.png"
      alt="Golden Buddha in a candlelit Himalayan shrine"
    />
    <div className="about-hero-shade" />
    <div className="about-shell about-hero-content">
      <Reveal>
        <p className="about-eyebrow">The art of sacred craft</p>
        <h1>Crafted with devotion.<br /><span>Made to endure.</span></h1>
        <p className="about-hero-copy">
          Singha Handicraft brings together generations of craftsmanship,
          sacred Buddhist iconography, and meticulous metalwork to create
          statues made for homes, altars, temples, and collectors.
        </p>
        <Link className="about-text-link about-hero-link" to="/shop">
          Explore our collection <ArrowRight size={16} />
        </Link>
      </Reveal>
    </div>
    <a href="#story" className="about-scroll-cue" aria-label="Scroll to our story">
      <span>Discover our story</span><ArrowDown size={15} />
    </a>
    <span className="about-hero-index">Patan · Lalitpur · Nepal</span>
  </section>
);

const BrandStory = () => (
  <section className="about-story about-section" id="story">
    <div className="about-shell about-story-layout">
      <Reveal>
        <p className="about-eyebrow">Our story</p>
        <h2>More than<br />a statue.</h2>
      </Reveal>
      <Reveal className="about-story-copy" delay={100}>
        <p>
          Each Singha Handicraft statue is an expression of craftsmanship,
          devotion, and cultural heritage. Made in Patan, our work carries
          forward the living traditions of Himalayan metal artistry.
        </p>
        <p>
          We bring this heritage to contemporary collectors and sacred spaces,
          creating meaningful works that can be kept, cherished, and passed on.
        </p>
        <Link className="about-text-link" to="/about#artists">
          Meet the artists <ArrowRight size={16} />
        </Link>
      </Reveal>
    </div>
  </section>
);

const Craftsmanship = () => (
  <section className="about-craft about-section">
    <div className="about-shell about-split-layout">
      <Reveal className="about-image-frame about-craft-image">
        <img src="/work.jpg" alt="A Patan artisan hand-finishing a sculpture" loading="lazy" />
        <span className="about-image-caption">The atelier · Patan, Nepal</span>
      </Reveal>
      <Reveal className="about-copy-block" delay={100}>
        <p className="about-eyebrow">The making</p>
        <h2>Crafted<br />by hand.</h2>
        <p>
          From copper and bronze to the final polish, every stage is shaped by
          skilled hands. Artisans form the figure, refine its details, apply
          precious-metal plating, then carefully polish and finish each piece.
        </p>
        <ul className="about-craft-list">
          <li>Hand-finished details and traditional techniques</li>
          <li>Quality metals and considered surface finishes</li>
          <li>Careful attention to iconographic accuracy</li>
        </ul>
      </Reveal>
    </div>
  </section>
);

const SacredMeaning = () => (
  <section className="about-meaning about-section">
    <div className="about-shell about-split-layout about-meaning-layout">
      <Reveal className="about-copy-block">
        <p className="about-eyebrow">Sacred meaning</p>
        <h2>Every form<br />carries meaning.</h2>
        <p>
          Buddhist iconography gives each figure its own qualities and story.
          These statues are created with respect for that symbolism—not simply
          as objects of beauty, but as reminders of qualities to cultivate.
        </p>
        <div className="about-qualities">
          <span><b>Compassion</b> · Chenrezig</span>
          <span><b>Wisdom</b> · Manjushree</span>
          <span><b>Prosperity</b> · Kubera</span>
          <span><b>Compassionate protection</b> · 21 Tara</span>
          <span><b>Enlightenment</b> · Gautam Buddha</span>
        </div>
      </Reveal>
      <Reveal className="about-image-frame about-meaning-image" delay={100}>
        <img src="/chengrezig.webp" alt="Chenrezig, the bodhisattva of compassion" loading="lazy" />
        <span className="about-image-caption">Chenrezig · compassion in form</span>
      </Reveal>
    </div>
  </section>
);

const Collections = () => (
  <section className="about-collections about-section">
    <div className="about-shell">
      <Reveal className="about-collections-heading">
        <div>
          <p className="about-eyebrow">A living tradition</p>
          <h2>Our collections</h2>
        </div>
        <p>Explore sacred forms shaped by centuries of devotion and artistry.</p>
      </Reveal>
      <div
        className="about-collection-track"
        role="region"
        aria-label="Featured collections, automatically scrolling"
      >
        {collections.map((item, index) => (
          <Reveal
            key={`${item.category}-${index}`}
            className="about-collection-reveal"
            delay={index < collections.length ? index * 65 : 0}
          >
            <Link
              className="about-collection"
              to={`/shop?category=${encodeURIComponent(item.category)}`}
              aria-label={`Explore ${item.title} statues`}
              aria-hidden={index >= collections.length || undefined}
              tabIndex={index >= collections.length ? -1 : undefined}
            >
              <div className="about-collection-image">
                <img src={item.image} alt={item.alt} loading="lazy" />
                <span className="about-collection-arrow"><ArrowRight size={18} /></span>
              </div>
              <div className="about-collection-title">
                <span>{item.title}</span><span>0{index + 1}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Artists = () => (
  <section className="about-artists about-section" id="artists">
    <div className="about-shell about-artists-layout">
      <Reveal className="about-artists-image about-image-frame">
        <img
          src="/Sculptor Crafting a Serene Buddha.png"
          alt="Sculptor carefully crafting a serene Buddha statue"
          loading="lazy"
        />
      </Reveal>
      <Reveal className="about-copy-block" delay={100}>
        <p className="about-eyebrow">The hands behind the work</p>
        <h2>Made together.<br /><span>Rooted in Patan.</span></h2>
        <p>
          Our sculptures are made with skilled Newar artisans whose knowledge
          lives in every stage of the process—from forming the figure to
          bringing its smallest details into focus.
        </p>
        <p>
          Sculptors, metalworkers, and finishers contribute their experience
          as a team. We honour the shared craft and care behind each work.
        </p>
        <Link className="about-text-link" to="/shop">
          Discover their work <ArrowRight size={16} />
        </Link>
      </Reveal>
    </div>
  </section>
);

const Consecration = () => (
  <section className="about-consecration about-section" id="consecration">
    <div className="about-shell about-consecration-inner">
      <Reveal>
        <p className="about-eyebrow">A sacred preparation</p>
        <h2>Prepared<br />with reverence.</h2>
        <p>
          Consecration may be requested for selected statues. A sacred chamber
          can be filled with mantras, relics, and other sacred materials, and
          the statue may undergo traditional Buddhist rituals performed by
          monks. Please contact us to discuss availability and arrangements.
        </p>
        <a
          className="about-text-link"
          href={`https://wa.me/977XXXXXXXXXX?text=${encodeURIComponent("Hello Singha Handicraft, I would like to learn about consecration.")}`}
          target="_blank"
          rel="noreferrer"
        >
          Learn about consecration <ArrowRight size={16} />
        </a>
      </Reveal>
      <Reveal className="about-consecration-art" delay={120}>
        <img src="/21TaraStatue.webp" alt="A sacred Tara statue prepared with care" loading="lazy" />
      </Reveal>
    </div>
  </section>
);

const WhySingha = () => (
  <section className="about-why about-section">
    <div className="about-shell">
      <Reveal className="about-why-heading">
        <p className="about-eyebrow">The Singha standard</p>
        <h2>Made with intention.</h2>
      </Reveal>
      <div className="about-feature-list">
        {features.map(({ title, description, Icon }, index) => (
          <Reveal key={title} delay={index * 60}>
            <div className="about-feature">
              <div className="about-feature-top">
                <span className="about-feature-index">0{index + 1} / 04</span>
                <Icon size={21} strokeWidth={1.5} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const AboutCTA = () => (
  <section className="about-final">
    <img src="/Golden Buddha Shrine with Incense and Candlelight.png" alt="" loading="lazy" />
    <div className="about-final-shade" />
    <Reveal className="about-final-content">
      <p className="about-eyebrow">A work to keep for generations</p>
      <h2>Bring sacred craftsmanship home.</h2>
      <p>
        Discover a collection created with patience, devotion, and respect for
        Himalayan Buddhist tradition.
      </p>
      <Link className="about-text-link" to="/shop">
        Explore collection <ArrowRight size={16} />
      </Link>
    </Reveal>
  </section>
);

const AboutPage = () => (
  <main className="about-page">
    <AboutHero />
    <BrandStory />
    <Craftsmanship />
    <SacredMeaning />
    <Collections />
    <Artists />
    <Consecration />
    <WhySingha />
    <AboutCTA />
  </main>
);

export default AboutPage;
