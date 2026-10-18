import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Globe2,
  LayoutTemplate,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

const services = [
  {
    icon: LayoutTemplate,
    title: "Website Design",
    description:
      "Professional, custom-designed websites that give your business a strong online presence.",
  },
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Fast, secure, and reliable websites built using modern technologies.",
  },
  {
    icon: Search,
    title: "Search Engine Optimization",
    description:
      "SEO-friendly website foundations to help customers discover your business online.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly Design",
    description:
      "Your website will look great and work smoothly on phones, tablets, and computers.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Us About Your Business",
    description:
      "Share what your business does, what you need, and what you want your website to accomplish.",
  },
  {
    number: "02",
    title: "We Design Your Website",
    description:
      "We create a professional design that reflects your brand and presents your services clearly.",
  },
  {
    number: "03",
    title: "We Build & Refine",
    description:
      "We develop your website, optimize it for mobile devices, and make sure everything works properly.",
  },
  {
    number: "04",
    title: "Your Website Goes Live",
    description:
      "Once everything is approved, we launch your website and help you get started.",
  },
];

const faqs = [
  {
    question: "How much does a website cost?",
    answer:
      "Pricing depends on the size and features of your website. Tell us what you need, and we'll provide a quote before beginning.",
  },
  {
    question: "How long does it take?",
    answer:
      "A typical small business website can take a few weeks, depending on the content, features, and project requirements.",
  },
  {
    question: "Will my website work on phones?",
    answer:
      "Absolutely. Every website we build is designed to work on mobile phones, tablets, and desktop computers.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Yes. We can redesign your current website to improve its appearance, usability, and performance.",
  },
  {
    question: "Do I need to provide the content?",
    answer:
      "You can provide your existing text and images, and we can help organize them into a professional website.",
  },
];

function Logo() {
  return (
    <Link href="#home" className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#a5a8ff] text-xl font-bold text-[#101116]">
        f.
      </div>
      <span className="text-xl font-semibold tracking-tight text-white">
        Hafs<span className="text-[#a5a8ff]">LLC</span>
      </span>
    </Link>
  );
}

function Header() {
  const links = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "How It Works", href: "#process" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101116]/95 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Logo />

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button className="hidden rounded-full bg-[#a5a8ff] px-6 font-semibold text-[#101116] hover:bg-[#c0c2ff] md:inline-flex">
          <Link href="#contact">Get a Quote</Link>
        </Button>

        <Sheet>
          <SheetTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="text-white md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-white/10 bg-[#15161d] p-6"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-white">HafsLLC</SheetTitle>
            </SheetHeader>
            <nav className="mt-10 flex flex-col gap-6">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg text-zinc-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Button className="mt-4 bg-[#a5a8ff] text-[#101116]">
                <Link href="#contact">Get a Quote</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-white/10"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#777ad8]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#777ad8]/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-36">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#a5a8ff]/20 bg-[#a5a8ff]/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#a5a8ff]">
            <span className="size-2 rounded-full bg-[#a5a8ff]" />
            Professional Website Design
          </div>

          <h1 className="max-w-2xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your business deserves a{" "}
            <span className="text-[#a5a8ff]">better website.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
            We design and build modern, professional websites that help your
            business look its best, connect with customers, and grow online.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              size="lg"
              className="h-13 rounded-full bg-[#a5a8ff] px-8 font-semibold text-[#101116] hover:bg-[#c0c2ff]"
            >
              <Link href="#contact">
                Let's Build Your Website
                {/* <ArrowRight className="ml-2 size-4" /> */}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-13 rounded-full border-white/20 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="#services">Explore Our Services</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-8">
            {["Mobile Responsive", "Modern Design", "SEO Ready"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-zinc-400"
              >
                <CheckCircle2 className="size-4 text-[#a5a8ff]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-[#777ad8]/10 blur-3xl" />

          <div className="relative rounded-2xl border border-white/10 bg-[#1b1c26] p-3 shadow-2xl">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#f5f3ef]">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                <span className="font-serif text-lg font-bold text-zinc-900">
                  STUDIO NORTH
                </span>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span>Home</span>
                  <span>About</span>
                  <span>Contact</span>
                </div>
              </div>

              <div className="grid min-h-80 grid-cols-2">
                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <span className="text-xs uppercase tracking-widest text-zinc-500">
                    Interior Design
                  </span>
                  <h3 className="mt-5 font-serif text-3xl leading-tight text-zinc-900 sm:text-4xl">
                    Spaces made for living.
                  </h3>
                  <p className="mt-4 text-xs leading-6 text-zinc-600">
                    Thoughtful interiors for modern lifestyles.
                  </p>
                  <span className="mt-6 inline-flex w-fit items-center gap-2 border-b border-zinc-900 pb-1 text-xs font-semibold text-zinc-900">
                    Discover More <ArrowUpRight className="size-3" />
                  </span>
                </div>
                <div
                  className="bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85')",
                  }}
                  role="img"
                  aria-label="Example interior design website"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-2 pt-4 text-xs text-zinc-500">
              <span>Example website concept</span>
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400" />
                Responsive design
              </span>
            </div>
          </div>

          <div className="absolute -bottom-7 -left-5 hidden rounded-xl border border-white/10 bg-[#252632] p-4 shadow-xl sm:block">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#a5a8ff]/10 p-3">
                <MonitorSmartphone className="size-6 text-[#a5a8ff]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Beautiful on every screen
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Desktop, tablet, and mobile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#a5a8ff]">
            What We Do
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Everything your business needs to get online.
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            From a brand-new website to a complete redesign, we handle the
            details so you can focus on running your business.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-white/10 bg-[#181920] p-8 transition-colors hover:border-[#a5a8ff]/40 lg:p-10"
            >
              <div className="mb-10 flex items-start justify-between">
                <div className="flex size-14 items-center justify-center rounded-xl bg-[#a5a8ff]/10 text-[#a5a8ff]">
                  <service.icon className="size-7" strokeWidth={1.5} />
                </div>
                <span className="text-sm text-zinc-600">0{index + 1}</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-4 max-w-md leading-7 text-zinc-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="border-y border-white/10 bg-[#171820] py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#a5a8ff]">
            Why Your Website Matters
          </p>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Make the right first impression.
          </h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-zinc-400">
            Your website is often the first place customers learn about your
            business. A professional online presence helps establish trust and
            makes it easier for people to choose you.
          </p>
          <Button className="mt-9 rounded-full bg-[#a5a8ff] px-7 text-[#101116] hover:bg-[#c0c2ff]">
            <Link href="#contact">
              Get Started <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-7">
          {[
            {
              icon: ShieldCheck,
              title: "Build Credibility",
              description:
                "Show customers that your business is professional, established, and ready to serve them.",
            },
            {
              icon: Globe2,
              title: "Be Available Around the Clock",
              description:
                "Give customers a place to learn about your services and contact you at any time.",
            },
            {
              icon: Zap,
              title: "Make Things Simple",
              description:
                "Help visitors quickly find the information they need and take the next step.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-5 border-b border-white/10 pb-7"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#a5a8ff]">
                <item.icon className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 leading-7 text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#a5a8ff]">
            Our Process
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Getting your website built is simple.
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            We keep the process clear and straightforward from the first
            conversation to launch day.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="border-t border-white/20 pt-7">
              <span className="text-4xl font-semibold text-[#a5a8ff]">
                {step.number}
              </span>
              <h3 className="mt-8 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-4 leading-7 text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-y border-white/10 bg-[#171820] py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#a5a8ff]">
            Frequently Asked Questions
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Have questions?
            <br />
            We have answers.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-zinc-400">
            Here's what you should know before getting started on your new
            website.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="border-white/10"
            >
              <AccordionTrigger className="py-6 text-left text-base font-medium text-white hover:no-underline hover:text-[#a5a8ff]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 leading-7 text-zinc-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-[#a5a8ff]/20 bg-[#1d1f35] px-8 py-16 text-center sm:px-16 lg:py-24">
          <div className="pointer-events-none absolute -right-20 -top-32 size-96 rounded-full bg-[#777ad8]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 size-96 rounded-full bg-[#777ad8]/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl border border-[#a5a8ff]/20 bg-[#a5a8ff]/10">
              <Sparkles className="size-8 text-[#a5a8ff]" />
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let's build your website.
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-zinc-300">
              Whether you're starting a new business or updating your existing
              website, we'd love to hear about your project.
            </p>

            <Button
              size="lg"
              className="mt-10 h-13 rounded-full bg-[#a5a8ff] px-9 font-semibold text-[#101116] hover:bg-[#c0c2ff]"
            >
              <a
                href={
                  CONTACT_EMAIL
                    ? `mailto:${CONTACT_EMAIL}?subject=Website%20Project%20Inquiry`
                    : "mailto:?subject=Website%20Project%20Inquiry"
                }
              >
                {/* <Mail className="mr-2 size-4" /> */}
                Request a Free Quote
                {/* <ArrowUpRight className="ml-2 size-4" /> */}
              </a>
            </Button>

            <p className="mt-5 text-sm text-zinc-400">
              Tell us about your project. No obligation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-10">
        <Logo />
        <p className="text-sm text-zinc-500">
          © 2026 HafsLLC. All rights reserved.
        </p>
        <Link
          href="#home"
          className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Back to top <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen scroll-smooth bg-[#101116] font-sans text-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <Process />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
