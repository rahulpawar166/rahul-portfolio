import React, { useEffect, useMemo, useRef, useState } from "react";

import emailjs from '@emailjs/browser';
import { liquidGlass } from "./liquidGlass";

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
  const RESUME_URL = "/resume/Rahul_Pawar_Resume.pdf";

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
  const resumeHighlights = useMemo(() => [
    "Senior iOS Developer leading SwiftUI, platform architecture, releases, and mobile AI tooling.",
    "Built real-time sync with Swift Concurrency and Combine, improving responsiveness by 30%.",
    "Created Claude Code agent skills, PR review automation, and Jenkins-backed XCTest workflows.",
    "Ships across iOS, macOS, Android, backend, and AI-assisted developer workflows.",
  ], []);

  const featuredProjects = useMemo(() => [
    {
      name: "RestSync",
      type: "macOS menubar app",
      description: "A SwiftUI break reminder inspired by the 20-20-20 rule, designed around macOS HIG, accessibility, and a minimal daily-use footprint.",
      tags: ["SwiftUI", "macOS", "Accessibility"],
      link: "https://github.com/rahulpawar166",
    },
    {
      name: "CompanionKit",
      type: "Xcode Source Editor Extension",
      description: "An OpenAI-powered Xcode extension for refactoring code, finding bugs, and explaining selected code without leaving the IDE.",
      tags: ["Swift", "XcodeKit", "OpenAI API"],
      link: "https://github.com/rahulpawar166",
    },
  ], []);

  const experience = useMemo(() => [
    {
      role: "Senior iOS Developer",
      company: "Eulerity, NY, USA",
      period: "Feb 2023 – Present",
      cover: "/images/eulerity.png",
      sentences: [
        "Lead iOS development across feature implementation, architecture, code quality, and App Store releases for a production mobile platform.",
        "Led a multi-phase app transformation across iOS, Android, and backend, shipping delta banners, pulse indicators, guided tours, pull-to-refresh freshness timestamps, and feature-flagged platform parity.",
        "Led the full transition to SwiftUI and established it as the team standard, making subsequent product work faster and more consistent.",
        "Built Claude Code agent skills, phase-aware PR review automation with Jira and Figma MCP integration, and Xcode agentic AI configuration for the mobile team.",
        "Implemented a real-time data sync system with Swift Concurrency and Combine, improving responsiveness by 30% and reducing data-related issues by 20%.",
        "Improved team productivity by 20% through MVVM conventions, replaced CocoaPods with Swift Package Manager for 25% faster builds, and authored the iOS code review standard.",
        "Leveraged Jenkins to automate XCTest unit test execution, improving code quality and reducing manual testing effort.",
        "Contribute across platforms by delivering Android features with Kotlin, XML, and Jetpack Compose while partnering with recruiting on mobile engineering candidates."
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
    { group: "Languages", items: ["Swift", "Objective-C", "Kotlin", "Python", "Java", "C", "C++", "JavaScript", "SQL"] },
    { group: "Apple Platforms", items: ["iOS", "iPadOS", "macOS", "watchOS", "SwiftUI", "UIKit", "XcodeKit", "HealthKit"] },
    { group: "Frameworks", items: ["Swift Concurrency", "Combine", "Core Data", "XCTest", "Swift Testing", "KIF", "EarlGrey", "Swinject"] },
    { group: "Tools", items: ["Xcode", "App Store Connect", "TestFlight", "SPM", "CocoaPods", "Android Studio", "Figma", "Jenkins", "CI/CD"] },
    { group: "AI & Backend", items: ["Xcode Agentic AI", "Claude Code", "Claude Agent Skills", "Claude Cowork", "MCP", "Codex", "GitHub Copilot", "RAG Systems", "OpenAI API", "Firebase", "AWS", "Docker", "MongoDB", "React"] },
  ], []);

  // ——— EDUCATION & CERTIFICATIONS DATA ———
const education = useMemo(() => [
  {
    school: "New England College",
    degree: "M.S. in Artificial Intelligence",
    period: "Jan 2026 – Present",
    location: "New Hampshire, USA",
    logo: "/images/new-england-college-shield.png",
    details: [],
  },
  {
    school: "Stevens Institute of Technology",
    degree: "M.S. in Computer Science",
    period: "Aug 2021 – May 2023",
    location: "New Jersey, USA",
    logo: "/images/stevens.png",
    details: [],
  },
], []);

const certifications = useMemo(() => [
  { title: "iOS Development", file: "/certs/iOS Development (Udemy).pdf" },
  { title: "Deep Learning", file: "/certs/Deep Learning (Udemy).pdf" },
  { title: "Machine Learning", file: "/certs/Machine Learning (Udemy).pdf" },
  { title: "Flutter Development", file: "/certs/Flutter Development (Udemy).pdf" },
  { title: "Web Development", file: "/certs/Web Development (Udemy).jpeg" },
  { title: "Seva Tech Internship", file: "/certs/Seva_Tech_Internship.jpg" },
  { title: "Core JAVA", file: "/certs/Core Java (SEED).pdf" },
  { title: "Advanced JAVA Programming", file: "/certs/Advanced Java Programming (SEED).pdf" },
  { title: "Image Processing", file: "/certs/Image Processing (Udemy).pdf" },
  { title: "IoT", file: "/certs/Internet of Things_Training (Internshala).pdf" },
  { title: "Javascript Algorithmic Scripting", file: "/certs/JavaScript (Udemy).pdf" },
  { title: "Python competency - Entry Level I ", file: "/certs/Python (MU).pdf" },
], []);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_46%,#f8fafc_100%)] pt-28 text-neutral-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_30%),linear-gradient(135deg,#020617_0%,#111827_48%,#18181b_100%)] dark:text-neutral-100 antialiased selection:bg-teal-900 selection:text-white dark:selection:bg-teal-200 dark:selection:text-neutral-950 sm:pt-24">
      <div className="ambient-field" aria-hidden="true">
        <span className="abstract-grid" />
        <span className="abstract-ribbon abstract-ribbon-a" />
        <span className="abstract-ribbon abstract-ribbon-b" />
        <span className="abstract-ribbon abstract-ribbon-c" />
        <span className="abstract-noise" />
        <span className="ambient-shape ambient-shape-a" />
        <span className="ambient-shape ambient-shape-b" />
        <span className="ambient-shape ambient-shape-c" />
      </div>

      {/* NAV */}
      <GlassSurface as="header" glass={{ scale: -92, chroma: 5, border: 0.075, mapBlur: 12, blur: 2, fallbackBlur: 22 }} className="nav-glass-shell fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 rounded-[1.65rem] border border-white/70 bg-white/75 shadow-2xl shadow-slate-900/10 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 dark:border-white/10 dark:bg-neutral-950/70 dark:shadow-black/35 dark:supports-[backdrop-filter]:bg-neutral-950/70">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <img src="/images/rahul-profile.jpg" alt="Rahul Pawar" className="h-7 w-7 rounded-full object-cover border border-black/10 dark:border-white/10" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <span className="font-semibold tracking-tight">Rahul Pawar</span>
          </div>
          <nav className="order-3 flex w-full items-center gap-4 overflow-x-auto whitespace-nowrap pb-1 text-xs opacity-80 sm:order-none sm:w-auto sm:gap-6 sm:overflow-visible sm:pb-0 sm:text-sm">
            <a href="#resume" className="hover:opacity-100">Resume</a>
            <a href="#writing" className="hover:opacity-100">Writing</a>
            <a href="#experience" className="hover:opacity-100">Experience</a>
            <a href="#projects" className="hover:opacity-100">Projects</a>
            <a href="#education" className="hover:opacity-100">Education</a>
            <a href="#certifications" className="hover:opacity-100">Certifications</a>
            <a href="#skills" className="hover:opacity-100">Skills</a>
            <a href="#contact" className="hover:opacity-100">Contact</a>
          </nav>
          <button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            className="theme-toggle"
            onClick={() => setIsDark((v) => !v)}
            type="button"
          >
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-thumb">
                {isDark ? <MaterialMoonIcon /> : <MaterialSunIcon />}
              </span>
              <span className="theme-toggle-icon theme-toggle-icon-light"><MaterialSunIcon /></span>
              <span className="theme-toggle-icon theme-toggle-icon-dark"><MaterialMoonIcon /></span>
            </span>
          </button>
        </div>
      </GlassSurface>

      {/* HERO */}
      <section id="cover" className="relative">
        <div className="absolute inset-x-0 top-0 h-24 bg-white/35 blur-3xl dark:bg-teal-400/10" />
        {/* LinkedIn‑style cover image */}
        <div className="relative z-0 mx-auto mt-4 h-56 w-[calc(100%-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-neutral-200 shadow-2xl shadow-slate-300/40 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/30 sm:h-72 md:h-80 lg:h-[22rem]">
          <img
            src="/images/cover.png"
            alt="Cover"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/5 to-transparent dark:from-neutral-950/80 dark:via-neutral-950/10" />
        </div>

        {/* Profile overlay */}
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <GlassSurface glass={{ scale: -84, chroma: 4, border: 0.08, mapBlur: 14, blur: 5, fallbackBlur: 24 }} className="-mt-12 flex flex-col gap-5 rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-xl shadow-slate-300/40 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70 dark:shadow-black/30 sm:flex-row sm:items-end sm:p-6">
            <img
              src="/images/rahul-profile.jpg"
              alt="Rahul Pawar"
              className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-lg dark:border-neutral-900 sm:h-32 sm:w-32"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="pb-1">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">Senior iOS Developer</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Rahul Pawar</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-700 dark:text-neutral-300 sm:text-base">SwiftUI-focused mobile engineer building production Apple platform experiences, AI-assisted developer tooling, and reliable release systems across iOS, macOS, and Android.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href={RESUME_URL} target="_blank" rel="noreferrer" className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-neutral-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-neutral-950">View Resume</a>
                <a href={RESUME_URL} download className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">Download PDF</a>
                <a href="https://www.linkedin.com/in/rahulpawar41/" target="_blank" rel="noreferrer" className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">LinkedIn</a>
                <a href="https://github.com/rahulpawar166" target="_blank" rel="noreferrer" className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">GitHub</a>
                <a href="mailto:rahulpawar166@gmail.com" className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">Email</a>
              </div>
            </div>
          </GlassSurface>
        </div>
      </section>

      {/* RESUME */}
      <section id="resume" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassSurface className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-300/30 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20 sm:p-8">
            <SectionHeader title="Resume" subtitle="Updated from the latest PDF" />
            <p className="text-sm leading-7 text-neutral-700 dark:text-neutral-300">Focused on senior iOS work, SwiftUI migration, AI-assisted engineering workflows, release ownership, cross-platform delivery, and production-quality mobile architecture.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={RESUME_URL} target="_blank" rel="noreferrer" className="rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 dark:bg-teal-300 dark:text-neutral-950">Open resume</a>
              <a href={RESUME_URL} download className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">Download</a>
            </div>
          </GlassSurface>
          <div className="grid gap-4 sm:grid-cols-2">
            {resumeHighlights.map((item, i) => (
              <GlassSurface key={item} className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-lg shadow-slate-300/20 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20">
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">0{i + 1}</p>
                <p className="mt-3 text-sm leading-6 text-neutral-800 dark:text-neutral-200">{item}</p>
              </GlassSurface>
            ))}
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
              <GlassSurface as="article" key={idx} className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/70 shadow-lg shadow-slate-300/25 backdrop-blur-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:shadow-black/20">
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
              </GlassSurface>
            );
          })}
        </div>
      </section>

      {/* 3) PROJECTS — NO IMAGES */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader title="Projects" subtitle="Native apps, developer tools, and experiments worth a peek" />
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <GlassSurface
              as="a"
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-300/25 backdrop-blur-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">{project.type}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{project.name}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-neutral-700 dark:border-white/10 dark:bg-white/10 dark:text-neutral-200">{tag}</span>
                ))}
              </div>
            </GlassSurface>
          ))}
        </div>
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

      {/* EDUCATION */}
<section id="education" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
  <SectionHeader title="Education" subtitle="Degrees, highlights, and coursework" />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {education.map((ed, i) => (
      <GlassSurface as="article" key={i} className="flex gap-4 rounded-[1.5rem] border border-white/80 bg-white/70 p-5 shadow-lg shadow-slate-300/20 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20">
        <div className="shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10">
          {ed.logo ? (
            <img
              src={ed.logo}
              alt={`${ed.school} logo`}
              className="h-full w-full object-contain p-1.5"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-teal-700 text-sm font-semibold text-white dark:bg-teal-300 dark:text-neutral-950">AI</div>
          )}
        </div>
        <div>
          <h3 className="font-medium">{ed.school}</h3>
          <p className="text-sm opacity-80">{ed.degree}</p>
          <p className="text-xs opacity-60 mt-0.5">{ed.period} · {ed.location}</p>
          {ed.details?.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm opacity-90 list-disc pl-5">
              {ed.details.map((d, idx) => <li key={idx}>{d}</li>)}
            </ul>
          )}
        </div>
      </GlassSurface>
    ))}
  </div>
</section>

{/* CERTIFICATIONS */}
<section id="certifications" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
  <SectionHeader title="Certifications" subtitle="Official creds you can view & download" />
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {certifications.map((c, i) => (
      <CertificateCard key={i} cert={c} />
    ))}
  </div>
</section>

      {/* SKILLS */}
      <section id="skills" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader title="Skills" subtitle="A toolbox tuned for Apple platforms" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((s, i) => (
            <GlassSurface key={i} className="rounded-[1.5rem] border border-white/80 bg-white/70 p-5 shadow-lg shadow-slate-300/20 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20">
              <h4 className="font-medium mb-3">{s.group}</h4>
              <div className="flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span key={it} className="text-xs px-2 py-1 rounded-full border border-black/10 dark:border-white/10 opacity-90">{it}</span>
                ))}
              </div>
            </GlassSurface>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <GlassSurface className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-xl shadow-slate-300/30 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Send me an Email</h3>
          <p className="mt-3 opacity-80 text-center">Or call/text: <a href="tel:+15516897590" className="underline text-base sm:text-lg font-medium"><span role="img" aria-label="USA flag" className="mr-1 text-lg sm:text-xl align-[-2px]">🇺🇸</span>+1 (551) 689‑7590</a></p>

          <ContactForm />
        </GlassSurface>
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
    const [sending, setSending] = React.useState(false);
    const [ok, setOk] = React.useState("");

    const onSubmit = (e) => {
      e.preventDefault();
      setErr("");
      setOk("");

      if (!first.trim() || !last.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        setErr("Please fill out all fields.");
        return;
      }

      // Send directly from the site using EmailJS
      // 1) Install: npm i @emailjs/browser
      // 2) Create a service + template at https://dashboard.emailjs.com/
      // 3) Add these to .env (Vite):
      //    VITE_EMAILJS_SERVICE_ID=your_service_id
      //    VITE_EMAILJS_TEMPLATE_ID=your_template_id
      //    VITE_EMAILJS_PUBLIC_KEY=your_public_key
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        setErr("Email service is not configured. Please add EmailJS keys to .env.");
        return;
      }

      setSending(true);
      emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_first: first,
          from_last: last,
          from_email: email,
          subject,
          message,
          to_name: 'Rahul Pawar',
          to_email: 'rahulpawar166@gmail.com',
        },
        { publicKey: PUBLIC_KEY }
      )
      .then(() => {
        setOk("Thanks! Your email was sent.");
        setFirst(""); setLast(""); setEmail(""); setSubject(""); setMessage("");
      })
      .catch((e) => {
        setErr("Failed to send. Please try again in a moment.");
        console.error("EmailJS error", e);
      })
      .finally(() => setSending(false));
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
          <label className="text-xs opacity-70">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20" placeholder="Write your message here..." />
        </div>
        {err && <div className="sm:col-span-2 text-sm text-red-500">{err}</div>}
        {ok && <div className="sm:col-span-2 text-sm text-green-600">{ok}</div>}
        <div className="sm:col-span-2 flex items-center justify-center mt-2">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-medium
                       bg-gradient-to-r from-neutral-900 via-black to-neutral-800 text-white
                       dark:from-white dark:via-neutral-200 dark:to-neutral-300 dark:text-black
                       shadow-lg shadow-black/20 dark:shadow-white/10 border border-black/10 dark:border-white/10
                       hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending…' : 'Send Email'}
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
    return <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 shadow-sm dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">{text}</div>;
  }

  function Carousel({ children,  size = 'md' }) {
    const scrollerRef = useRef(null);
    const scrollBy = (dir) => {
      const el = scrollerRef.current; if (!el) return;
      el.scrollBy({ left: dir * Math.min(el.clientWidth, 640), behavior: 'smooth' });
    };
    const gridClass = size === 'sm'
      ? 'grid auto-cols-[70%] sm:auto-cols-[46%] lg:auto-cols-[28%] grid-flow-col gap-4 items-stretch'
      : 'grid auto-cols-[85%] sm:auto-cols-[60%] lg:auto-cols-[33%] grid-flow-col gap-4 items-stretch';
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="opacity-0">.</div>
          <div className="flex gap-2">
            <GlassSurface as="button" glass={{ scale: -42, chroma: 2, border: 0.18, mapBlur: 12, blur: 6 }} aria-label="Prev" onClick={() => scrollBy(-1)} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">◀</GlassSurface>
            <GlassSurface as="button" glass={{ scale: -42, chroma: 2, border: 0.18, mapBlur: 12, blur: 6 }} aria-label="Next" onClick={() => scrollBy(1)} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">▶</GlassSurface>
          </div>
        </div>
        <div ref={scrollerRef} className="overflow-x-auto snap-x snap-mandatory no-scrollbar">
          <div className={gridClass}>
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
      <GlassSurface
        as="a"
        href={repo.html_url || repo.link}
        target="_blank"
        rel="noreferrer"
        className="group block h-full rounded-[1.5rem] border border-white/80 bg-white/70 p-5 shadow-lg shadow-slate-300/20 backdrop-blur-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
      >
        <div className="flex items-start justify-start gap-3">
          <div>
            <h3 className="font-medium group-hover:opacity-100 opacity-90">{repo.name}</h3>
            {repo.language && (
              <p className="text-xs opacity-60 mt-0.5">{repo.language}</p>
            )}
          </div>
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
                className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 text-[11px] opacity-80 dark:border-white/10 dark:bg-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {updated && (
          <p className="text-[11px] opacity-60 mt-4">Updated {updatedFmt}</p>
        )}
      </GlassSurface>
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
      <GlassSurface
        as="a"
        href={article.link}
        target="_blank"
        rel="noreferrer"
        className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 shadow-lg shadow-slate-300/20 backdrop-blur-xl transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
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
              <span key={c} className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 text-[11px] opacity-70 dark:border-white/10 dark:bg-white/10">{c}</span>
              ))}
            </div>
          )}

          {/* Excerpt from the article content */}
          {excerpt && <p className="mt-3 text-sm opacity-80 leading-relaxed">{excerpt}</p>}

          {/* Show more button */}
          <span
            className="mt-4 inline-flex self-start items-center rounded-full px-4 py-1.5 text-sm font-medium
                       border border-black/10 dark:border-white/10
                       bg-white/70 dark:bg-neutral-900/70 backdrop-blur
                       hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Show more →
          </span>
        </div>
      </GlassSurface>
    );
  }

  
function CertificateCard({ cert }) {
  const file = cert.file;
  const ext = (file.split('.').pop() || '').toLowerCase();
  const isImage = ['png', 'jpg', 'jpeg', 'webp'].includes(ext);
  const isPDF = ext === 'pdf';

  const label = isPDF ? 'PDF · Click to view' : 'Image · Click to view';

  return (
    <GlassSurface
      as="a"
      href={file}
      target="_blank"
      rel="noreferrer"
      className="group block h-full overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 shadow-lg shadow-slate-300/20 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/30 dark:border-white/10 dark:bg-white/10 dark:shadow-black/20 dark:hover:shadow-black/30"
    >
      <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800">
        {isImage ? (
          <img
            src={file}
            alt={`${cert.title} thumbnail`}
            className="max-h-full max-w-full object-contain p-4"
          />
        ) : (
          <img
            src="/images/pdf_placeholder.webp"
            alt="PDF placeholder"
            className="max-h-full max-w-full object-contain p-4 transition group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <h4 className="font-medium text-sm group-hover:opacity-100 opacity-90 line-clamp-2">
          {cert.title}
        </h4>
        <p className="text-[11px] opacity-70 mt-1">{label}</p>
      </div>
    </GlassSurface>
  );
}
}

function useLiquidGlass(ref, options) {
  const enabled = options !== undefined && options !== false;
  const optionsKey = JSON.stringify(options || {});

  useEffect(() => {
    if (!enabled) return undefined;
    if (!ref.current) return undefined;

    const glass = liquidGlass(ref.current, JSON.parse(optionsKey));
    return () => glass.destroy();
  }, [enabled, ref, optionsKey]);
}

function GlassSurface({ as = "div", className = "", glass, children, ...props }) {
  const ref = useRef(null);
  useLiquidGlass(ref, glass);

  return React.createElement(
    as,
    { ...props, ref, className: `liquid-glass ${className}` },
    children,
  );
}

function MaterialSunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M6.76 4.84 4.96 3.05 3.55 4.46l1.79 1.8 1.42-1.42ZM1 13h3v-2H1v2Zm10-12v3h2V1h-2Zm9.04 2.46-1.41-1.41-1.79 1.79 1.41 1.42 1.79-1.8ZM17.24 19.16l1.79 1.8 1.41-1.42-1.79-1.79-1.41 1.41ZM20 11v2h3v-2h-3Zm-8 7a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm-1 5h2v-3h-2v3Zm-7.45-3.46 1.41 1.42 1.8-1.8-1.42-1.41-1.79 1.79Z" />
    </svg>
  );
}

function MaterialMoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M12.1 22c-1.39 0-2.7-.26-3.92-.79a10.18 10.18 0 0 1-3.21-2.16 10.17 10.17 0 0 1-2.16-3.21A9.77 9.77 0 0 1 2 11.92c0-2.13.6-4.05 1.8-5.75A9.85 9.85 0 0 1 8.55 2.5c.38-.15.72-.11 1.02.11.3.23.42.54.36.94a9.36 9.36 0 0 0 .81 5.32 9.5 9.5 0 0 0 4.39 4.39 9.39 9.39 0 0 0 5.32.81c.4-.06.71.06.94.36.22.3.26.64.11 1.02a9.85 9.85 0 0 1-3.67 4.75A9.87 9.87 0 0 1 12.1 22Z" />
    </svg>
  );
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
