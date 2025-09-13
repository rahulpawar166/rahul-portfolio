import React, { useEffect, useMemo, useRef, useState } from "react";

import { motion } from "framer-motion";

// Fallback SVG for experience cover images (neutral gradient)
const FALLBACK_COVER = `data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 700'>\
  <defs>\
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>\
      <stop offset='0%' stop-color='%23d4d4d4'/>\
      <stop offset='100%' stop-color='%23909090'/>\
    </linearGradient>\
  </defs>\
  <rect width='100%' height='100%' fill='url(%23g)'/>\
</svg>`;

// Apple‑style portfolio — Medium first (carousel), Experience elaborated, Projects third.
// Update per request: remove images from Project cards, use Medium's own article images,
// and use provided profile image at /images/rahul-profile.jpg

export default function PortfolioAppleStyle() {
  /* ——— THEME ——— */
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("rahul-theme");
    if (stored) return stored === "dark";
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark"); else root.classList.remove("dark");
    localStorage.setItem("rahul-theme", isDark ? "dark" : "light");
  }, [isDark]);

  

  /* ——— GITHUB ——— */
  const [repos, setRepos] = useState([]);
  const [repoError, setRepoError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.github.com/users/rahulpawar166/repos?per_page=100", { cache: "no-store" });
        if (!res.ok) throw new Error("GitHub API error: " + res.status);
        const data = await res.json();
        const sorted = data
          .filter((r) => !r.fork)
          .sort((a, b) => {
            const rank = (lang) => (lang === "Swift" || lang === "Kotlin" ? 0 : 1);
            const la = rank(a.language), lb = rank(b.language);
            if (la !== lb) return la - lb;
            return new Date(b.pushed_at) - new Date(a.pushed_at);
          });
        setRepos(sorted);
      } catch (e) { setRepoError(e.message || "Unable to fetch repositories"); }
    })();
  }, []);

  // Featured & Blocklisted repos per request
  const FEATURED_REPOS = ["RestSync", "iSEN"];
  const BLOCKLIST_REPOS = new Set(["Eulerity", "Swift XCTest Demo Project", "Swift-XCTest-Demo-Project", "rahul-portfolio", "Rahul-Portfolio"]);

  /* ——— MEDIUM ——— */
  const [articles, setArticles] = useState([]);
  const [articleError, setArticleError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const url = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40rahulpawar166";
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Medium feed error: " + res.status);
        const data = await res.json();
        const items = (data.items || []).map((it) => ({
          title: it.title,
          link: it.link,
          pubDate: it.pubDate,
          categories: it.categories,
          author: it.author,
          content: it.content || it.description || "",
          thumbnail: it.thumbnail || (it.enclosure && it.enclosure.link) || null,
        }));
        setArticles(items);
      } catch (e) { setArticleError(e.message || "Unable to fetch Medium articles"); }
    })();
  }, []);

  /* ——— RESUME‑DRIVEN DATA ——— */
  const experience = useMemo(() => [
    {
      role: "iOS Developer",
      company: "Eulerity, NY, USA",
      period: "Feb 2023 – Present",
      cover: "/images/eulerity.png",
      sentences: [
        "I lead the iOS development effort day‑to‑day: planning sprints, unblocking engineers, and reviewing PRs with a strong focus on architecture and readability. The goal is fast iteration without regressions, so I pair code owners with targeted test plans and automated checks to keep velocity high and quality consistent.",
        "I partner closely with backend, design, and product to deliver features end‑to‑end. From API shape and error states to motion, haptics, and empty‑state copy, I ensure the experience is coherent and polished across the entire flow, not just individual screens.",
        "I championed MVVM across the app and introduced a small set of conventions (bindable view models, dependency injection boundaries, and view composition guidelines). This reduced rewrite churn and context switching, improving team productivity by ~20% and making new‑feature onboarding far smoother.",
        "I migrated third‑party dependencies from CocoaPods to Swift Package Manager, simplifying dependency graphs and CI setup. Build times dropped by ~25% on average and we removed an entire class of integration issues related to podspec drift.",
        "I designed and shipped a real‑time data sync layer using Swift Concurrency and Combine. It coalesces updates, debounces bursty network traffic, and guarantees main‑thread UI delivery—resulting in a more responsive app and fewer data consistency bugs across screens.",
        "I own App Store releases end‑to‑end: versioning, release notes, TestFlight rollout, phased release, and post‑ship monitoring. I’m also guiding a measured transition to SwiftUI, establishing patterns that interoperate cleanly with UIKit so we can modernize UI without risking stability."
      ],
    },
    {
      role: "iOS Developer Intern",
      company: "Eulerity, NY, USA",
      period: "May 2022 – Dec 2022",
      cover: "/images/eulerity.png",
      sentences: [
        "Integrated KIF UI testing across critical user journeys (login, onboarding, publishing flows) and wired it into CI; we standardized accessibility identifiers, built deterministic fixtures, and added screenshot diffs. This cut flaky regressions and reduced manual QA time by ~50%.",
        "Introduced a lightweight testing pyramid around KIF (unit → view‑model → UI) with clear data builders and network stubs so features shipped with predictable coverage and fast feedback.",
        "Tracked and fixed memory issues on older devices using Instruments (Leaks/Allocations/Time Profiler); eliminated retain cycles in delegate/closure code, audited singletons, and optimized image caching. Result: fewer background terminations and smoother scrolling.",
        "Authored concise developer docs for complex flows (sequence diagrams, error/fallback states, performance budgets) so onboarding engineers could make changes confidently."
      ],
    },
    {
      role: "Software Engineer",
      company: "Schnell Technologies, India",
      period: "Dec 2019 – Aug 2021",
      cover: "/images/schnell.jpg",
      sentences: [
        "Delivered multiple web and mobile apps end‑to‑end (React/Swift + Node/Firebase), from scoping and API contracts to releases; partnered with design/PM and demoed to clients, turning feedback into weekly increments.",
        "Set up CI/CD and a reusable module template, cutting project bootstrap time by ~30% and keeping repos consistent across teams.",
        "Introduced a cloud‑first data workflow: seed scripts, staging environments, and anonymized fixtures with a lightweight verification harness. This removed brittle CSV hand‑offs and cut data‑testing time by ~60%."
      ],
    },
    {
      role: "iOS Developer Intern",
      company: "Seva Tech, India",
      period: "May 2019 – Jul 2019",
      cover: "/images/seva.jpg",
      sentences: [
        "Led a 6‑person team to deliver the Rojgaar iOS app in ~8 weeks using Firebase (Auth, Firestore, Storage). I built job search, profile, and messaging with offline‑friendly queries and safe writes.",
        "Implemented push notifications and crash/analytics dashboards, wrote a simple release checklist, and handed off clear docs so the client could operate the app after delivery."
      ],
    },
  ], []);

  const skills = useMemo(() => [
    { group: "Languages", items: ["Swift", "SwiftUI", "Objective‑C", "Kotlin", "Python", "Java", "C/C++", "JavaScript", "SQL"] },
    { group: "Frameworks", items: ["XCTest", "Swift Testing", "Concurrency", "Combine", "KIF", "EarlGrey", "Swinject", "Core Data"] },
    { group: "Tools", items: ["Xcode", "TestFlight", "SPM", "CocoaPods", "Android Studio", "Figma", "App Store Connect"] },
    { group: "Platforms", items: ["iOS", "macOS", "Android", "AWS", "Firebase", "Crashlytics", "Docker", "MongoDB", "React"] },
  ], []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/50 border-b border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/rahul-profile.jpg" alt="Rahul Pawar" className="h-7 w-7 rounded-full object-cover border border-black/10 dark:border-white/10" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <span className="font-semibold tracking-tight">Rahul Pawar</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm opacity-80">
            <a href="#writing" className="hover:opacity-100">Writing</a>
            <a href="#experience" className="hover:opacity-100">Experience</a>
            <a href="#projects" className="hover:opacity-100">Projects</a>
            <a href="#skills" className="hover:opacity-100">Skills</a>
            <a href="#contact" className="hover:opacity-100">Contact</a>
          </nav>
          <button aria-label="Toggle dark mode" className="rounded-2xl border border-black/10 dark:border-white/10 px-3 py-1 text-xs hover:scale-[1.02] active:scale-[0.98] transition" onClick={() => setIsDark((v) => !v)}>
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="cover" className="relative">
        {/* LinkedIn‑style cover image */}
        <div className="relative z-0 w-full h-56 sm:h-72 md:h-80 lg:h-[22rem] rounded-b-3xl overflow-hidden border-b border-black/10 dark:border-white/10 bg-neutral-200 dark:bg-neutral-900">
          <img
            src="/images/cover.png"
            alt="Cover"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>

        {/* Profile overlay */}
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="mt-6 sm:mt-8 flex items-end gap-4">
            <img
              src="/images/rahul-profile.jpg"
              alt="Rahul Pawar"
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl object-cover border-4 border-white dark:border-neutral-950 shadow"
              onError={(e)=>{e.currentTarget.style.display='none'}}
            />
            <div className="pb-2">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Rahul Pawar</h1>
              <p className="text-sm opacity-80">iOS/macOS Engineer · Swift | SwiftUI · Minimal, Apple‑quality experiences</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href="https://github.com/rahulpawar166" target="_blank" rel="noreferrer" className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">GitHub</a>
                <a href="https://medium.com/@rahulpawar166" target="_blank" rel="noreferrer" className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Medium</a>
                <a href="mailto:rahulpawar166@gmail.com" className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Email</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1) WRITING FIRST — CAROUSEL */}
      <section id="writing" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader title="Writing" subtitle="Fresh takes on Swift, SwiftUI & shipping delightful apps" />
        {articleError && <InlineNote text={`Medium fetch issue: ${articleError}. Using a lightweight fallback.`} />}
        <Carousel>
          {(articles.length ? articles : demoArticles).slice(0, 12).map((a, i) => (
            <ArticleCard key={i} article={a} />
          ))}
        </Carousel>
      </section>

      {/* 2) EXPERIENCE — ELABORATED */}
      <section id="experience" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader title="Experience" subtitle="Impact explained in plain language" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {experience.map((exp, idx) => {
            const candidates = [
              exp.cover,
              (exp.cover || '').endsWith('.png') ? exp.cover.replace('.png', '.jpg') : undefined,
              (exp.cover || '').endsWith('.jpg') ? exp.cover.replace('.jpg', '.jpeg') : undefined,
            ].filter(Boolean);
            return (
              <motion.article key={idx} whileHover={{ y: -4 }} className="rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden">
                <div className="aspect-[16/7] w-full bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={candidates[0] || FALLBACK_COVER}
                    data-try="0"
                    loading="lazy"
                    alt="Experience cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const i = Number(e.currentTarget.dataset.try || 0) + 1;
                      const next = candidates[i];
                      if (next) {
                        e.currentTarget.dataset.try = String(i);
                        e.currentTarget.src = next;
                      } else {
                        e.currentTarget.src = FALLBACK_COVER;
                      }
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{exp.role} · <span className="opacity-80">{exp.company}</span></h3>
                  <p className="text-sm opacity-70">{exp.period}</p>
                  <div className="mt-3 space-y-3">
                    {exp.sentences.map((s, i) => (
                      <p key={i} className="text-sm leading-relaxed opacity-90">{s}</p>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* 3) PROJECTS — NO IMAGES */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader title="Projects" subtitle="Selected GitHub work (auto‑fetched)" />
        {repoError && <InlineNote text={`GitHub fetch issue: ${repoError}. Showing a subset if available.`} />}
        {(() => {
          const list = (repos.length ? repos : demoRepos)
            .filter(r => !BLOCKLIST_REPOS.has(r.name))
            .sort((a, b) => {
              const ai = FEATURED_REPOS.indexOf(a.name);
              const bi = FEATURED_REPOS.indexOf(b.name);
              const as = ai === -1 ? 999 : ai;
              const bs = bi === -1 ? 999 : bi;
              if (as !== bs) return as - bs; // featured first in order
              return 0;
            });
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.slice(0, 9).map((repo) => (
                <ProjectCard key={repo.id || repo.name} repo={repo} />
              ))}
            </div>
          );
        })()}
      </section>

      {/* SKILLS */}
      <section id="skills" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader title="Skills" subtitle="A toolbox tuned for Apple platforms" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((s, i) => (
            <div key={i} className="rounded-2xl border border-black/10 dark:border-white/10 p-5">
              <h4 className="font-medium mb-3">{s.group}</h4>
              <div className="flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span key={it} className="text-xs px-2 py-1 rounded-full border border-black/10 dark:border-white/10 opacity-90">{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Send me an Email</h3>
          <p className="mt-3 opacity-80 text-center">Or call/text: <a href="tel:+15516897590" className="underline text-base sm:text-lg font-medium"><span role="img" aria-label="USA flag" className="mr-1 text-lg sm:text-xl align-[-2px]">🇺🇸</span>+1 (551) 689‑7590</a></p>

          <ContactForm />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-xs opacity-60">© {new Date().getFullYear()} Rahul Pawar. Crafted with Swift‑like precision.</footer>
    </div>
  );


  /* ——— PRIMITIVES ——— */
  function ContactForm() {
    const [first, setFirst] = React.useState("");
    const [last, setLast] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [err, setErr] = React.useState("");

    const onSubmit = (e) => {
      e.preventDefault();
      setErr("");
      if (!first.trim() || !last.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        setErr("Please fill out all fields.");
        return;
      }
      const mailto = new URL("mailto:rahulpawar166@gmail.com");
      mailto.searchParams.set("subject", subject);
      const body = `From: ${first} ${last}
Email: ${email}

${message}`;
      mailto.searchParams.set("body", body);
      window.location.href = mailto.toString();
    };

    return (
      <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs opacity-70">First Name</label>
          <input value={first} onChange={(e) => setFirst(e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20" placeholder="Jane" />
        </div>
        <div>
          <label className="text-xs opacity-70">Last Name</label>
          <input value={last} onChange={(e) => setLast(e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20" placeholder="Doe" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs opacity-70">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20" placeholder="you@example.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs opacity-70">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20" placeholder="Hello Rahul" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs opacity-70">Email</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20" placeholder="Write your message here..." />
        </div>
        {err && <div className="sm:col-span-2 text-sm text-red-500">{err}</div>}
        <div className="sm:col-span-2 flex items-center justify-center mt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-medium
                       bg-gradient-to-r from-neutral-900 via-black to-neutral-800 text-white
                       dark:from-white dark:via-neutral-200 dark:to-neutral-300 dark:text-black
                       shadow-lg shadow-black/20 dark:shadow-white/10 border border-black/10 dark:border-white/10
                       hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Send Email
          </button>
        </div>
      </form>
    );
  }

  /* ——— PRIMITIVES ——— */
  function SectionHeader({ title, subtitle }) {
    return (
      <div className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm opacity-70 mt-1">{subtitle}</p>}
      </div>
    );
  }

  function InlineNote({ text }) {
    return <div className="mb-4 text-xs rounded-xl border border-black/10 dark:border-white/10 p-3 opacity-80">{text}</div>;
  }

  function Carousel({ children }) {
    const scrollerRef = useRef(null);
    const scrollBy = (dir) => {
      const el = scrollerRef.current; if (!el) return;
      el.scrollBy({ left: dir * Math.min(el.clientWidth, 640), behavior: 'smooth' });
    };
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="opacity-0">.</div>
          <div className="flex gap-2">
            <button aria-label="Prev" onClick={() => scrollBy(-1)} className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-1 text-xs">◀</button>
            <button aria-label="Next" onClick={() => scrollBy(1)} className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-1 text-xs">▶</button>
          </div>
        </div>
        <div ref={scrollerRef} className="overflow-x-auto snap-x snap-mandatory no-scrollbar">
          <div className="grid auto-cols-[85%] sm:auto-cols-[60%] lg:auto-cols-[33%] grid-flow-col gap-4 items-stretch">
            {React.Children.map(children, (c, i) => (
              <div key={i} className="snap-center">
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function ProjectCard({ repo }) {
    const updated = repo.pushed_at ? new Date(repo.pushed_at) : null;
    const updatedFmt = updated
      ? updated.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
      : "";

    // Build tags: language, tech, platform (best-effort from name/description)
    const tags = (() => {
      const arr = [];
      const lang = repo.language?.toString();
      const name = (repo.name || '').toLowerCase();
      const desc = (repo.description || '').toLowerCase();

      // Language
      if (lang) arr.push(lang);

      // Tech stack hints from description/name
      if (/swiftui/.test(desc) || /swiftui/.test(name)) arr.push('SwiftUI');
      if (/combine\b/.test(desc)) arr.push('Combine');
      if (/concurrency|async\b|await\b/.test(desc)) arr.push('Swift Concurrency');
      if (/kotlin/.test(desc) || /kotlin/.test(name)) arr.push('Kotlin');
      if (/react\b|reactjs|react\.js/.test(desc) || /react/.test(name)) arr.push('React');
      if (/node\b|express\b/.test(desc)) arr.push('Node');
      if (/firebase/.test(desc)) arr.push('Firebase');

      // Platform inference (keyword-based, not just language)
      if (/\bios\b|iphone|ipad/.test(name + ' ' + desc)) arr.push('iOS');
      if (/swiftui|appkit|macos|mac\s?app/.test(name + ' ' + desc)) arr.push('macOS');
      if (lang === 'Kotlin' || /android/.test(name + ' ' + desc)) arr.push('Android');
      if (/react|web|browser|vite|next\.js|nextjs/.test(name + ' ' + desc)) arr.push('Web');

      // Special-case corrections
      if (name === 'restsync') {
        // Ensure macOS tag for RestSync
        arr.push('macOS');
        // If iOS got inferred elsewhere, remove it
        const idx = arr.indexOf('iOS');
        if (idx !== -1) arr.splice(idx, 1);
      }

      // Deduplicate and limit
      return Array.from(new Set(arr)).slice(0, 5);
    })();

    return (
      <motion.a
        href={repo.html_url || repo.link}
        target="_blank"
        rel="noreferrer"
        whileHover={{ y: -4 }}
        className="group rounded-2xl border border-black/10 dark:border-white/10 p-5 block h-full"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-medium group-hover:opacity-100 opacity-90">{repo.name}</h3>
            {repo.language && (
              <p className="text-xs opacity-60 mt-0.5">{repo.language}</p>
            )}
          </div>
          <span className="text-[11px] rounded-full border border-black/10 dark:border-white/10 px-2 py-0.5 opacity-70">
            ★ {repo.stargazers_count ?? repo.stars ?? 0}
          </span>
        </div>
        {repo.description && (
          <p className="text-sm opacity-80 mt-3 line-clamp-3">{repo.description}</p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 opacity-80"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {updated && (
          <p className="text-[11px] opacity-60 mt-4">Updated {updatedFmt}</p>
        )}
      </motion.a>
    );
  }

  function ArticleCard({ article }) {
    const date = article.pubDate ? new Date(article.pubDate) : null;
    const df = date ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) : "";

    // Extract first <img> from HTML content if available
    const extractFirstImage = (html) => {
      try { const div = document.createElement('div'); div.innerHTML = html || ''; const img = div.querySelector('img'); return img?.getAttribute('src') || null; } catch { return null; }
    };

    // Extract plain text from the article's HTML to use as an excerpt
    const extractPlainText = (html) => {
      try { const div = document.createElement('div'); div.innerHTML = html || ''; return (div.textContent || '').replace(/\s+/g, ' ').trim(); } catch { return ''; }
    };

    // Truncate to a readable length (about 30–40 words)
    const truncateWords = (text, n = 40) => {
      const words = text.split(' ');
      if (words.length <= n) return text;
      return words.slice(0, n).join(' ') + '…';
    };

    const cover = extractFirstImage(article.content) || article.thumbnail;
    const plain = extractPlainText(article.content || '');
    const excerpt = truncateWords(plain, 42);

    return (
      <motion.a
        href={article.link}
        target="_blank"
        rel="noreferrer"
        whileHover={{ y: -2 }}
        className="group rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden block flex flex-col h-full"
      >
        <div className="aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-900">
          {cover ? (
            <img src={cover} alt="Article cover" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-400 dark:from-neutral-800 dark:to-neutral-700" />
          )}
        </div>

        <div className="p-5 flex flex-col h-full">
          <h3 className="font-medium group-hover:opacity-100 opacity-90 line-clamp-2">{article.title}</h3>
          {df && <p className="text-xs opacity-60 mt-1">{df}</p>}
          {article.categories && article.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {article.categories.slice(0, 4).map((c) => (
                <span key={c} className="text-[11px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 opacity-70">{c}</span>
              ))}
            </div>
          )}

          {/* Excerpt from the article content */}
          {excerpt && <p className="mt-3 text-sm opacity-80 leading-relaxed">{excerpt}</p>}

          {/* Show more button */}
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex self-start items-center rounded-full px-4 py-1.5 text-sm font-medium
                       border border-black/10 dark:border-white/10
                       bg-white/70 dark:bg-neutral-900/70 backdrop-blur
                       hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Show more →
          </a>
        </div>
      </motion.a>
    );
  }
}

/* ——— FALLBACKS ——— */
const demoRepos = [
  { id: "demo1", name: "Screenshot-Resizer", description: "macOS tool to batch‑resize App Store screenshots with ZIP export.", language: "Swift", stargazers_count: 0, pushed_at: "2025-06-01T00:00:00Z", html_url: "https://github.com/rahulpawar166" },
  { id: "demo2", name: "Companion-Kit", description: "Xcode extensions for AI‑powered refactors, bug‑spotting, and docs.", language: "Swift", stargazers_count: 0, pushed_at: "2025-05-18T00:00:00Z", html_url: "https://github.com/rahulpawar166" },
  { id: "demo3", name: "Memory-Capsule", description: "Send time‑locked digital messages with tasteful animations.", language: "SwiftUI", stargazers_count: 0, pushed_at: "2025-04-22T00:00:00Z", html_url: "https://github.com/rahulpawar166" },
];

const demoArticles = [
  { title: "SwiftUI Animations: Designing Delight", link: "https://medium.com/@rahulpawar166", pubDate: "2025-01-10", thumbnail: null, categories: ["SwiftUI", "Animation"], content: "" },
  { title: "From CocoaPods to SPM: Faster Builds", link: "https://medium.com/@rahulpawar166", pubDate: "2024-12-05", thumbnail: null, categories: ["SPM", "Tooling"], content: "" },
  { title: "Testing iOS at Scale: KIF + XCTest", link: "https://medium.com/@rahulpawar166", pubDate: "2024-10-21", thumbnail: null, categories: ["Testing"], content: "" },
];
