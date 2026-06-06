import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Phone, Mail, Zap, Shield, Heart } from "lucide-react";

const STEPS = [
  {
    emoji: "🍽️",
    title: "Browse & Choose",
    desc: "Explore our diverse menu with fresh, high-quality ingredients prepared daily by our chefs.",
    color: "from-orange-500/20 to-orange-400/10",
  },
  {
    emoji: "🛒",
    title: "Place Your Order",
    desc: "Add items to your cart, fill in your delivery address, and pay securely via Stripe.",
    color: "from-blue-500/20 to-blue-400/10",
  },
  {
    emoji: "🚀",
    title: "Fast Delivery",
    desc: "Sit back and relax. Your hot, fresh meal will arrive at your door in under 35 minutes.",
    color: "from-emerald-500/20 to-emerald-400/10",
  },
];

const VALUES = [
  { icon: Zap, title: "Speed", desc: "Average delivery time under 35 minutes — we respect your hunger!", color: "bg-amber-50 text-amber-600" },
  { icon: Shield, title: "Quality", desc: "Every dish is prepared fresh daily with premium, locally sourced ingredients.", color: "bg-blue-50 text-blue-600" },
  { icon: Heart, title: "Care", desc: "We treat every order like it's for family — because you deserve the best.", color: "bg-rose-50 text-rose-600" },
];

const FAQS = [
  { q: "How long does delivery take?", a: "We aim for 25–35 minutes depending on your location and traffic. You can track your order in real time." },
  { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards through our secure Stripe integration. Your payment info is never stored on our servers." },
  { q: "Can I cancel my order?", a: "You can cancel within 2 minutes of placing your order. After that, our kitchen has already started preparing your food." },
  { q: "Is there a minimum order amount?", a: "There's no minimum order amount! A flat delivery fee of 50 EGP applies to all orders." },
  { q: "Do you offer vegetarian / vegan options?", a: "Yes! Filter by category in our menu to find salads and plant-based options clearly labeled for dietary preferences." },
  { q: "How do I track my order?", a: "Head to 'My Orders' after placing your order. The status updates in real time: Processing → Out for Delivery → Delivered." },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,oklch(95%_0.06_60),oklch(98%_0.01_60)_50%)]">
        <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-10 right-0 h-60 w-60 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
            🍕 &nbsp;Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Food delivered{" "}
            <span className="text-gradient-orange">with love</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            FoodDel started with a simple mission: make great food accessible to everyone, fast.
            We partner with the best local restaurants to bring restaurant-quality meals straight to your door.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { val: "10K+", label: "Happy Customers" },
              { val: "50+", label: "Menu Items" },
              { val: "4.8★", label: "Average Rating" },
            ].map(({ val, label }) => (
              <div key={label} className="rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm px-5 py-4 shadow-sm">
                <p className="text-3xl font-extrabold text-primary">{val}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Process</span>
            <span className="h-1 w-6 rounded-full bg-primary" />
          </div>
          <h2 className="text-3xl font-bold">How it works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-border z-0" />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative z-10 text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-gradient-to-br ${step.color} mb-5 mx-auto text-5xl shadow-sm border border-border/30`}>
                {step.emoji}
              </div>
              <div className="absolute top-2 right-1/4 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="bg-muted/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-1 w-6 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Values</span>
              <span className="h-1 w-6 rounded-full bg-primary" />
            </div>
            <h2 className="text-3xl font-bold">What drives us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm card-lift">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
            <span className="h-1 w-6 rounded-full bg-primary" />
          </div>
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden"
            >
              <button
                id={`faq-${i}`}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm hover:bg-muted/40 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                {openFaq === i ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3 animate-fade-in-fast">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="bg-gradient-to-br from-primary/5 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-1 w-6 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
              <span className="h-1 w-6 rounded-full bg-primary" />
            </div>
            <h2 className="text-3xl font-bold">Get in touch</h2>
            <p className="text-muted-foreground mt-2">We're here to help 7 days a week</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: MapPin, label: "Address", value: "Cairo, Egypt", color: "bg-rose-50 text-rose-600" },
              { icon: Phone, label: "Phone", value: "+20 100 000 0000", color: "bg-emerald-50 text-emerald-600" },
              { icon: Mail, label: "Email", value: "hello@foodel.eg", color: "bg-blue-50 text-blue-600" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm text-center card-lift">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
