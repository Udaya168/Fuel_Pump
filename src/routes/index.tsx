import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Fuel, Zap, MapPin, Coffee, ShoppingBag, Wifi, CreditCard, Truck, Dog,
  ShieldCheck, Leaf, Cpu, Clock, Star, Phone, Navigation, Mail, ArrowRight,
  ArrowUp, TrendingUp, TrendingDown, Search, Sun, Moon, Menu, X, Battery,
  Sparkles, Award, Users, Globe, Play, ChevronDown, Wind, Droplets, Cloud,
  MessageCircle, Send, Apple, PlayCircle, Gift, Percent, Cake, Wallet, Sandwich,
  IceCream, GlassWater, Croissant, ParkingCircle,
} from "lucide-react";

import heroImg from "@/assets/hero-station.jpg";
import evImg from "@/assets/ev-charging.jpg";
import cafeImg from "@/assets/cafe.jpg";
import pumpImg from "@/assets/pump.jpg";
import autobahnImg from "@/assets/autobahn.jpg";
import foodImg from "@/assets/food.jpg";

export const Route = createFileRoute("/")({
  component: JetHome,
});

/* ---------------- helpers ---------------- */

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return { dark, setDark };
}

function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.floor(v).toLocaleString("de-DE"));
  useEffect(() => {
    if (inView) {
      const controls = animate(value, to, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, to, duration, value]);
  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ---------------- component ---------------- */

function JetHome() {
  const { dark, setDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"DE" | "EN">("EN");
  const [showTop, setShowTop] = useState(false);
  const [cookieOK, setCookieOK] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const mouse = useRef({ x: 0, y: 0 });
  const [gradient, setGradient] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setCookieOK(localStorage.getItem("jet_cookie") === "1");
    const onScroll = () => setShowTop(window.scrollY > 500);
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setGradient({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* mouse gradient */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-opacity"
        style={{
          background: `radial-gradient(600px circle at ${gradient.x}% ${gradient.y}%, oklch(0.7 0.22 40 / 0.15), transparent 60%)`,
        }}
      />

      {/* scroll progress bar */}
      <motion.div
        style={{ scaleX: progressX }}
        className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-jet-yellow"
      />

      {/* fuel price ticker */}
      <div className="relative z-40 overflow-hidden border-b border-border bg-jet-black text-white">
        <div className="flex animate-[marquee_35s_linear_infinite] whitespace-nowrap py-2 text-xs font-medium">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-8 px-8">
              {[
                ["Diesel", "1.499", "up"], ["Super E10", "1.639", "down"], ["Super", "1.699", "up"],
                ["Super Plus", "1.799", "down"], ["AdBlue", "0.899", "up"], ["EV 350kW", "0.49 €/kWh", "down"],
                ["Berlin", "1.629", "up"], ["München", "1.679", "down"], ["Hamburg", "1.649", "up"],
              ].map(([n, p, t]) => (
                <span key={n + i} className="flex items-center gap-2">
                  <span className="text-jet-yellow">●</span>
                  <span className="opacity-70">{n}</span>
                  <span className="font-semibold">{p} €</span>
                  {t === "up" ? <TrendingUp className="h-3 w-3 text-emerald-400" /> : <TrendingDown className="h-3 w-3 text-red-400" />}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Header lang={lang} setLang={setLang} dark={dark} setDark={setDark} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="relative z-10">
        <Hero />
        <FuelPrices />
        <WhyChooseUs />
        <Services />
        <EVCharging />
        <StationFinder />
        <AboutStation />
        <Reviews />
        <FoodCafe />
        <MobileApp />
        <Rewards />
        <Contact />
      </main>
      <Footer />

      {/* Back to top */}
      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full btn-primary shadow-lg"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}

      {/* AI chat */}
      <div className="fixed bottom-6 left-6 z-50">
        {chatOpen ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass w-80 overflow-hidden rounded-3xl shadow-elegant">
            <div className="flex items-center justify-between border-b border-border bg-jet-black p-4 text-white">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-jet-yellow text-jet-black"><Sparkles className="h-4 w-4" /></div>
                <div>
                  <p className="text-sm font-semibold">JET Assistant</p>
                  <p className="text-[10px] opacity-70">Online · replies instantly</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-2 p-4 text-sm">
              <div className="rounded-2xl bg-muted px-3 py-2">Hallo! How can I help you fuel your journey today?</div>
              <div className="ml-8 rounded-2xl bg-jet-yellow px-3 py-2 text-jet-black">Find nearest station</div>
            </div>
            <div className="flex items-center gap-2 border-t border-border p-3">
              <input className="flex-1 rounded-full bg-muted px-3 py-2 text-sm outline-none" placeholder="Type a message…" />
              <button className="grid h-9 w-9 place-items-center rounded-full btn-primary"><Send className="h-4 w-4" /></button>
            </div>
          </motion.div>
        ) : (
          <button onClick={() => setChatOpen(true)} className="grid h-14 w-14 place-items-center rounded-full btn-primary shadow-lg">
            <MessageCircle className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Weather widget */}
      <div className="fixed right-6 top-24 z-40 hidden lg:block">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="glass rounded-2xl px-4 py-3 text-sm shadow-soft">
          <div className="flex items-center gap-3">
            <Cloud className="h-6 w-6 text-jet-yellow" />
            <div>
              <p className="font-semibold">Berlin · 14°</p>
              <p className="text-xs text-muted-foreground">Cloudy · Wind 12 km/h</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cookie banner */}
      {!cookieOK && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-24 left-1/2 z-50 w-[92%] max-w-2xl -translate-x-1/2 glass rounded-3xl p-4 shadow-elegant sm:p-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              🍪 We use cookies to enhance your experience and analyze traffic. By continuing you agree to our privacy policy.
            </p>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => setCookieOK(true)} className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted">Decline</button>
              <button onClick={() => { localStorage.setItem("jet_cookie", "1"); setCookieOK(true); }} className="rounded-full btn-primary px-5 py-2 text-xs font-semibold">Accept all</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------------- header ---------------- */

function Header({ lang, setLang, dark, setDark, menuOpen, setMenuOpen }: any) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["Home", "Fuel", "EV Charging", "Services", "Stations", "Rewards", "About", "Contact"];
  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "glass shadow-soft" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-jet-yellow font-black text-jet-black shadow-glow">J</div>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold">JET Fuel</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Premium Energy</p>
          </div>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-border p-1 text-xs sm:flex">
            <button onClick={() => setLang("DE")} className={`rounded-full px-3 py-1 font-semibold ${lang === "DE" ? "bg-jet-yellow text-jet-black" : ""}`}>DE</button>
            <button onClick={() => setLang("EN")} className={`rounded-full px-3 py-1 font-semibold ${lang === "EN" ? "bg-jet-yellow text-jet-black" : ""}`}>EN</button>
          </div>
          <button onClick={() => setDark(!dark)} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden">
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass border-t border-border lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted">
                {l}
              </a>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}

/* ---------------- hero ---------------- */

function Hero() {
  return (
    <section id="home" className="relative min-h-[92vh] overflow-hidden">
      {/* background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="JET Fuel Germany station at sunset" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />
      </div>

      {/* floating particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-jet-yellow/60"
          style={{ left: `${(i * 73) % 100}%`, top: `${(i * 41) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="max-w-3xl">
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2 text-xs font-medium text-white">
            <span className="grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 rounded-full bg-jet-yellow" />
              <span className="absolute h-2 w-2 animate-[pulse-ring_1.6s_ease-out_infinite] rounded-full bg-jet-yellow" />
            </span>
            250+ stations · Open right now
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Fueling Every <br />
            <span className="text-gradient-yellow">Journey</span> Across <br />
            Germany.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
            Premium Fuel · Ultra-Fast EV Charging · Fresh Food · Open 24/7. Engineered for the road, crafted for you.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a href="#stations" className="group inline-flex items-center gap-2 rounded-full btn-primary px-6 py-3.5 text-sm font-semibold">
              <MapPin className="h-4 w-4" /> Find a Station
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#services" className="inline-flex items-center gap-2 rounded-full glass-dark px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
              <Play className="h-4 w-4" /> Explore Services
            </a>
          </motion.div>

          {/* animated fuel pump card */}
          <motion.div variants={fadeUp} className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {[
              { icon: Fuel, label: "Premium", value: "1.79 €" },
              { icon: Zap, label: "350kW", value: "0.49 €" },
              { icon: Clock, label: "Open", value: "24/7" },
            ].map((s) => (
              <div key={s.label} className="glass-dark rounded-2xl p-3 text-white">
                <s.icon className="mb-2 h-5 w-5 text-jet-yellow" />
                <p className="text-xs opacity-70">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- fuel prices ---------------- */

const FUEL_TYPES = [
  { name: "Diesel", price: 1.499, trend: "down", color: "from-amber-500 to-yellow-400" },
  { name: "Super E10", price: 1.639, trend: "up", color: "from-emerald-500 to-lime-400" },
  { name: "Super", price: 1.699, trend: "up", color: "from-sky-500 to-blue-400" },
  { name: "Super Plus", price: 1.799, trend: "down", color: "from-fuchsia-500 to-pink-400" },
  { name: "AdBlue", price: 0.899, trend: "up", color: "from-cyan-500 to-teal-400" },
  { name: "Electric 350kW", price: 0.49, unit: "€/kWh", trend: "down", color: "from-yellow-400 to-orange-400" },
] as const;

function MiniChart({ trend }: { trend: string }) {
  const path = trend === "up" ? "M0 20 L15 15 L30 17 L45 10 L60 12 L75 5 L90 8 L100 2" : "M0 5 L15 8 L30 6 L45 12 L60 10 L75 16 L90 14 L100 20";
  return (
    <svg viewBox="0 0 100 24" className="h-8 w-full overflow-visible">
      <motion.path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
    </svg>
  );
}

function FuelPrices() {
  return (
    <Section id="fuel" eyebrow="Live pricing" title="Today's fuel prices" subtitle="Real-time prices from JET stations across Germany. Updated every 5 minutes.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {FUEL_TYPES.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-elegant"
          >
            <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${f.color} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{f.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold tabular-nums">{f.price.toFixed("unit" in f ? 2 : 3)}</span>
                <span className="text-xs text-muted-foreground">{"unit" in f ? f.unit : "€/L"}</span>
              </div>
              <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${f.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                {f.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {f.trend === "up" ? "+0.02" : "-0.03"}
              </div>
              <div className={`mt-3 ${f.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                <MiniChart trend={f.trend} />
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">Updated just now</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- why choose us ---------------- */

const WHY = [
  { icon: Award, title: "Premium Fuel Quality" },
  { icon: Clock, title: "Open 24 Hours" },
  { icon: Zap, title: "High-Speed EV Charging" },
  { icon: Users, title: "Friendly Staff" },
  { icon: Percent, title: "Affordable Prices" },
  { icon: ShoppingBag, title: "Convenience Store" },
  { icon: Coffee, title: "Fresh Coffee" },
  { icon: Truck, title: "Truck Friendly" },
  { icon: Dog, title: "Dog Friendly" },
  { icon: ShieldCheck, title: "Secure Payment" },
  { icon: Leaf, title: "Eco Friendly" },
  { icon: Cpu, title: "Modern Equipment" },
];

function WhyChooseUs() {
  return (
    <Section id="why" eyebrow="Why JET" title="Built for every kind of driver" subtitle="Twelve reasons why over a million drivers choose JET every month.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {WHY.map((w, i) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 transition-all hover:border-jet-yellow"
          >
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-jet-yellow text-jet-black transition-transform group-hover:scale-110">
              <w.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold">{w.title}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- services ---------------- */

const SERVICES = [
  { icon: Fuel, label: "Fuel Station" },
  { icon: Droplets, label: "Diesel" },
  { icon: Fuel, label: "Petrol" },
  { icon: Zap, label: "EV Chargers" },
  { icon: Wind, label: "Car Wash" },
  { icon: Truck, label: "Truck Fuel" },
  { icon: Wind, label: "Air & Water" },
  { icon: ParkingCircle, label: "Tyre Pressure" },
  { icon: Coffee, label: "Coffee Shop" },
  { icon: Croissant, label: "Bakery" },
  { icon: Sandwich, label: "Fresh Sandwiches" },
  { icon: GlassWater, label: "Cold Drinks" },
  { icon: ShoppingBag, label: "Convenience Store" },
  { icon: CreditCard, label: "ATM" },
  { icon: ShoppingBag, label: "Parcel Pickup" },
  { icon: Users, label: "Rest Area" },
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Wallet, label: "Mobile Payments" },
  { icon: CreditCard, label: "Fleet Cards" },
];

function Services() {
  return (
    <Section id="services" eyebrow="All-in-one" title="Everything you need, in one stop" subtitle="From premium fuel to fresh coffee — every JET station is designed for your entire journey.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
            whileHover={{ y: -3 }}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-jet-yellow"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-jet-yellow text-jet-black transition-colors group-hover:bg-jet-black group-hover:text-jet-yellow">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="min-w-0 truncate text-sm font-medium group-hover:text-jet-black">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- EV charging ---------------- */

function EVCharging() {
  return (
    <section id="ev-charging" className="relative overflow-hidden bg-jet-black py-24 text-white sm:py-32">
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at center, oklch(0.7 0.22 40 / 0.4), transparent 60%)" }} />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-jet-yellow">
            Electric Future
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Ultra-fast charging<br /><span className="text-gradient-yellow">at 350 kW.</span>
          </motion.h2>
          <p className="mt-5 max-w-lg text-white/70">
            Add 300 km of range in under 15 minutes. Reserve your slot, track charging progress in real-time, and pay contactless.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Battery, label: "Ultra Fast Charging" },
              { icon: Zap, label: "350kW Chargers" },
              { icon: Clock, label: "Real-time Availability" },
              { icon: MapPin, label: "Find Nearby Charger" },
            ].map((x, i) => (
              <motion.div key={x.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-dark flex items-center gap-3 rounded-2xl p-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-jet-yellow text-jet-black"><x.icon className="h-5 w-5" /></div>
                <p className="text-sm font-medium">{x.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-full btn-primary px-6 py-3 text-sm font-semibold">Reserve Charging Slot</button>
            <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10">Find Nearby Charger</button>
          </div>
        </div>

        <div className="relative">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative overflow-hidden rounded-4xl shadow-elegant">
            <img src={evImg} alt="EV charging" className="h-[500px] w-full object-cover" loading="lazy" width={1600} height={1200} />
            <div className="absolute inset-0 bg-gradient-to-t from-jet-black/80 to-transparent" />

            {/* Charging ring overlay */}
            <div className="absolute bottom-6 left-6 right-6 glass-dark rounded-3xl p-5">
              <div className="flex items-center gap-4">
                <ChargingRing percent={73} />
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-jet-yellow">Charging</p>
                  <p className="text-2xl font-bold">73% · 22 min left</p>
                  <p className="text-xs text-white/60">+318 km added · 340 kW</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ChargingRing({ percent }: { percent: number }) {
  const c = 2 * Math.PI * 32;
  return (
    <div className="relative grid h-20 w-20 place-items-center">
      <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
        <circle cx="40" cy="40" r="32" strokeWidth="6" stroke="oklch(1 0 0 / 0.15)" fill="none" />
        <motion.circle
          cx="40" cy="40" r="32" strokeWidth="6" strokeLinecap="round"
          stroke="var(--jet-yellow)" fill="none"
          initial={{ strokeDasharray: c, strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * percent) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <Battery className="h-6 w-6 text-jet-yellow" />
    </div>
  );
}

/* ---------------- station finder ---------------- */

function StationFinder() {
  return (
    <Section id="stations" eyebrow="Station finder" title="250+ stations across Germany" subtitle="Search by city, postal code, or use your current location.">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Search + Card */}
        <div className="space-y-4 lg:col-span-2">
          <div className="glass rounded-3xl p-4 shadow-soft">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-jet-yellow" placeholder="City or postal code" />
              </div>
              <button className="rounded-full btn-primary px-5 py-3 text-sm font-semibold">Near Me</button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border bg-jet-yellow px-5 py-4 text-jet-black">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest">Featured Station</p>
                <h3 className="mt-0.5 text-lg font-bold">JET Oberhonnefeld</h3>
              </div>
              <span className="rounded-full bg-jet-black px-3 py-1 text-[10px] font-semibold text-jet-yellow">OPEN 24H</span>
            </div>
            <div className="space-y-4 p-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-jet-yellow" />
                <div>
                  <p>Westerwaldstraße 23</p>
                  <p className="text-muted-foreground">56587 Oberhonnefeld-Gierend, Germany</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Diesel", "Petrol", "EV", "Car Wash", "Coffee", "Store", "Truck", "Dog Friendly"].map((a) => (
                  <span key={a} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium">{a}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button className="rounded-full btn-primary py-2.5 text-xs font-semibold">Directions</button>
                <button className="rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-muted">Call</button>
                <button className="rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-muted">Services</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-4xl border border-border bg-jet-black shadow-elegant">
            <img src={autobahnImg} alt="Germany map" className="h-full w-full object-cover opacity-70" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-br from-jet-black/60 via-transparent to-jet-black/60" />
            {/* map pins */}
            {[
              { top: "22%", left: "48%", label: "Hamburg" },
              { top: "38%", left: "72%", label: "Berlin" },
              { top: "52%", left: "42%", label: "Köln" },
              { top: "64%", left: "58%", label: "Frankfurt" },
              { top: "78%", left: "50%", label: "München" },
              { top: "48%", left: "30%", label: "Düsseldorf" },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring" }}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ top: p.top, left: p.left }}
              >
                <div className="relative">
                  <span className="absolute -inset-2 animate-[pulse-ring_1.8s_ease-out_infinite] rounded-full bg-jet-yellow/60" />
                  <div className="relative flex items-center gap-1.5 rounded-full bg-jet-yellow px-2.5 py-1 text-[10px] font-bold text-jet-black shadow-glow">
                    <MapPin className="h-3 w-3" /> {p.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- about ---------------- */

function AboutStation() {
  return (
    <Section id="about" eyebrow="About JET" title="30 years of trust on German roads">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <div className="overflow-hidden rounded-4xl shadow-elegant">
            <img src={pumpImg} alt="Premium fuel pump" className="h-[520px] w-full object-cover" loading="lazy" />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden rounded-3xl bg-jet-yellow p-5 text-jet-black shadow-glow sm:block">
            <p className="text-4xl font-black">4.4★</p>
            <p className="text-xs font-semibold">2,000+ reviews</p>
          </div>
        </motion.div>

        <div>
          <p className="text-muted-foreground">
            From the Autobahn to your neighborhood corner — JET has been fueling German drivers for over three decades with premium quality, honest prices, and a warm welcome.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: 250, s: "+", label: "Stations" },
              { v: 1, s: "M+", label: "Customers" },
              { v: 24, s: "/7", label: "Support" },
              { v: 30, s: "+", label: "Years" },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-3xl font-bold text-gradient-yellow">
                  <Counter to={k.v} suffix={k.s} />
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
            {["Open 24/7", "Premium Fuel", "Friendly Staff", "High-Speed Chargers", "Modern Facilities", "Free Parking"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-jet-yellow text-jet-black">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- reviews ---------------- */

const REVIEWS = [
  { name: "Lukas M.", city: "München", text: "Good fuel prices and excellent customer service. Always my go-to stop on the A9.", avatar: "https://i.pravatar.cc/100?img=12" },
  { name: "Anna K.", city: "Berlin", text: "Fast charging stations and clean facilities. Charged from 20% to 80% in 18 minutes.", avatar: "https://i.pravatar.cc/100?img=32" },
  { name: "Sebastian H.", city: "Hamburg", text: "Friendly staff and quality fuel. The fresh coffee is a genuine bonus at 3am.", avatar: "https://i.pravatar.cc/100?img=68" },
  { name: "Elena F.", city: "Frankfurt", text: "Dog-friendly, clean bathrooms, and the sandwiches are surprisingly excellent.", avatar: "https://i.pravatar.cc/100?img=45" },
];

function Reviews() {
  return (
    <Section id="reviews" eyebrow="Loved by drivers" title="What our customers say">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-3xl p-6 shadow-soft transition-transform hover:-translate-y-1"
          >
            <div className="mb-3 flex gap-0.5 text-jet-yellow">
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">"{r.text}"</p>
            <div className="mt-5 flex items-center gap-3">
              <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.city}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- food & cafe ---------------- */

const FOOD = [
  { label: "Fresh Coffee", icon: Coffee },
  { label: "Bakery", icon: Croissant },
  { label: "Sandwiches", icon: Sandwich },
  { label: "Cold Drinks", icon: GlassWater },
  { label: "Ice Cream", icon: IceCream },
  { label: "Snacks", icon: ShoppingBag },
];

function FoodCafe() {
  return (
    <Section id="food" eyebrow="Food & Café" title="Fresh, fast, and always ready">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="group relative overflow-hidden rounded-4xl shadow-elegant sm:col-span-2 sm:row-span-2">
          <img src={cafeImg} alt="Café interior" className="h-full min-h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-jet-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <p className="text-xs uppercase tracking-widest text-jet-yellow">Signature</p>
            <h3 className="mt-2 text-3xl font-bold sm:text-4xl">Barista coffee, freshly brewed.</h3>
            <p className="mt-2 max-w-md text-sm text-white/80">Beans roasted weekly in Hamburg. Served hot, 24 hours a day.</p>
          </div>
        </motion.div>

        {FOOD.slice(0, 4).map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft"
          >
            <img src={foodImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-30" loading="lazy" />
            <div className="relative">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-jet-yellow text-jet-black">
                <f.icon className="h-6 w-6" />
              </div>
              <p className="text-lg font-semibold">{f.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">Fresh daily · Grab & go</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- mobile app ---------------- */

function MobileApp() {
  return (
    <section className="relative overflow-hidden bg-jet-black py-24 text-white sm:py-32">
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse at 30% 50%, oklch(0.7 0.22 40 / 0.3), transparent 60%)" }} />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-jet-yellow">JET App</p>
          <h2 className="text-4xl font-bold sm:text-5xl md:text-6xl">Your journey, in your pocket.</h2>
          <p className="mt-4 max-w-lg text-white/70">
            Find stations, check live prices, pay at the pump, and collect rewards — all from one beautifully engineered app.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { icon: MapPin, label: "Find Stations" }, { icon: Fuel, label: "Fuel Prices" },
              { icon: CreditCard, label: "Pay at Pump" }, { icon: Gift, label: "Rewards" },
              { icon: Battery, label: "EV Charging Status" }, { icon: ShieldCheck, label: "Digital Receipts" },
            ].map((f) => (
              <div key={f.label} className="glass-dark flex items-center gap-3 rounded-2xl p-3.5">
                <f.icon className="h-5 w-5 text-jet-yellow" />
                <span className="text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-jet-black">
              <Apple className="h-6 w-6" />
              <div className="text-left">
                <p className="text-[10px] opacity-70">Download on the</p>
                <p className="text-sm font-semibold leading-tight">App Store</p>
              </div>
            </button>
            <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-jet-black">
              <PlayCircle className="h-6 w-6" />
              <div className="text-left">
                <p className="text-[10px] opacity-70">Get it on</p>
                <p className="text-sm font-semibold leading-tight">Google Play</p>
              </div>
            </button>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="relative mx-auto flex justify-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative h-[560px] w-[280px] rounded-[3rem] border-[10px] border-jet-graphite bg-jet-black shadow-elegant" style={{ animation: "float-slow 6s ease-in-out infinite" }}>
              <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-jet-black" />
              <div className="flex h-full flex-col overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-jet-graphite to-jet-black p-4 pt-8 text-white">
                <p className="text-xs opacity-60">Guten Morgen,</p>
                <p className="text-xl font-bold">Lukas 👋</p>
                <div className="mt-4 rounded-2xl bg-jet-yellow p-4 text-jet-black">
                  <p className="text-[10px] font-semibold uppercase">Nearest Station</p>
                  <p className="mt-1 text-sm font-bold">JET Oberhonnefeld</p>
                  <p className="text-[10px]">2.4 km · Open now</p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xs">Super E10</span>
                    <span className="text-lg font-black">1.639 €</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
                  {[{ i: Fuel, l: "Pay" }, { i: Zap, l: "Charge" }, { i: Gift, l: "Rewards" }].map((x) => (
                    <div key={x.l} className="rounded-2xl bg-white/10 p-3">
                      <x.i className="mx-auto mb-1 h-5 w-5 text-jet-yellow" />
                      <p>{x.l}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex-1 rounded-2xl bg-white/5 p-3 text-xs">
                  <p className="mb-2 font-semibold">Rewards balance</p>
                  <p className="text-2xl font-black text-jet-yellow">2,480 pts</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-jet-yellow" />
                  </div>
                  <p className="mt-2 text-[10px] opacity-60">520 pts to next reward</p>
                </div>
              </div>
            </div>
            {/* floating icons */}
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-8 top-16 glass-dark rounded-2xl p-3">
              <Zap className="h-5 w-5 text-jet-yellow" />
            </motion.div>
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-8 top-40 glass-dark rounded-2xl p-3">
              <Coffee className="h-5 w-5 text-jet-yellow" />
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute -right-6 bottom-24 glass-dark rounded-2xl p-3">
              <Gift className="h-5 w-5 text-jet-yellow" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- rewards ---------------- */

function Rewards() {
  const perks = [
    { icon: Sparkles, title: "Collect Points", desc: "1 pt per litre, 3 pts per €10." },
    { icon: Percent, title: "Fuel Discounts", desc: "Up to 4 ct/L off at all JET stations." },
    { icon: Coffee, title: "Free Coffee", desc: "Every 8th coffee is on us." },
    { icon: Cake, title: "Birthday Rewards", desc: "Surprise voucher every year." },
    { icon: Gift, title: "Exclusive Offers", desc: "Early access to partner deals." },
    { icon: Wallet, title: "Digital Loyalty Card", desc: "Live in your JET App." },
  ];
  return (
    <Section id="rewards" eyebrow="JET Rewards" title="Premium membership, zero cost">
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-jet-black to-jet-graphite p-8 text-white shadow-elegant">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-jet-yellow/30 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-jet-yellow">Member card</p>
            <p className="mt-2 text-3xl font-black">JET Premium</p>
            <p className="mt-8 text-xs opacity-60">Card number</p>
            <p className="tracking-widest">4923 · 7712 · •••• · 2044</p>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs opacity-60">Member</p>
                <p className="text-sm font-semibold">Lukas Müller</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-60">Points</p>
                <p className="text-2xl font-black text-jet-yellow">2,480</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2">
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl border border-border bg-card p-5 transition-colors hover:border-jet-yellow"
            >
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-jet-yellow text-jet-black">
                <p.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- contact ---------------- */

function Contact() {
  return (
    <Section id="contact" eyebrow="Get in touch" title="We're here 24/7">
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { icon: MapPin, title: "Address", lines: ["Westerwaldstraße 23", "56587 Oberhonnefeld-Gierend", "Germany"], cta: "Navigate", Icon: Navigation },
          { icon: Phone, title: "Phone", lines: ["+49 2634 940054", "Reception & Support"], cta: "Call", Icon: Phone },
          { icon: Clock, title: "Business Hours", lines: ["Open 24 Hours", "365 days a year"], cta: "Email", Icon: Mail },
        ].map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-3xl p-6 shadow-soft"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-jet-yellow text-jet-black">
              <c.icon className="h-6 w-6" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.title}</p>
            <div className="mt-2 space-y-1 text-sm">
              {c.lines.map((l) => <p key={l}>{l}</p>)}
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full btn-primary px-4 py-2 text-xs font-semibold">
              <c.Icon className="h-4 w-4" /> {c.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-jet-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-jet-yellow font-black text-jet-black">J</div>
              <div>
                <p className="font-display font-bold">JET Fuel</p>
                <p className="text-[10px] uppercase tracking-widest opacity-60">Germany</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Premium fuel, ultra-fast charging and 24/7 service across 250+ stations in Germany.
            </p>
            <div className="mt-4 flex gap-2">
              {["F", "X", "in", "Ig"].map((s) => (
                <a key={s} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-xs hover:bg-jet-yellow hover:text-jet-black">{s}</a>
              ))}
            </div>
          </div>

          {[
            { title: "Company", links: ["Services", "Station Finder", "Careers", "About", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Imprint", "Cookies", "Support"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-jet-yellow">{col.title}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((l) => <li key={l}><a href="#" className="text-white/70 hover:text-white">{l}</a></li>)}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-jet-yellow">Newsletter</p>
            <p className="mt-4 text-sm text-white/60">Fuel deals, station openings and EV news — monthly.</p>
            <form className="mt-4 flex overflow-hidden rounded-full border border-white/10 bg-white/5" onSubmit={(e) => e.preventDefault()}>
              <input className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/40" placeholder="you@example.com" />
              <button className="btn-primary px-5 text-sm font-semibold">Join</button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} JET Fuel Germany Demo. All rights reserved.</p>
          <p>Made with <span className="text-jet-yellow">♥</span> in Deutschland — a fictional client demo.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- section wrapper ---------------- */

function Section({ id, eyebrow, title, subtitle, children }: { id?: string; eyebrow?: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mb-10 max-w-3xl">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-jet-yellow">{eyebrow}</p>}
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">{title}</h2>
        {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
      </motion.div>
      {children}
    </section>
  );
}
