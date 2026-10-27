import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion, useReducedMotion } from "framer-motion";
import { choreQuestFeatures } from "./ChoreQuestFeatures";
import "./ChoreQuestFeature.css";
import "./ChoreQuestPage.css";
import IPhoneMockup from "./IPhoneMockup";

const problems = [
  ["01", "The reminder loop", "A chore is easy to forget when the next step is unclear. Parents end up keeping the list in their heads and asking again."],
  ["02", "Effort that's hard to see", "Making a bed or setting the table can feel small. Children need a way to see that their contribution counts."],
  ["03", "A goal that feels far away", "Responsibility is abstract. A clear goal and visible progress give everyday effort something tangible to work toward."],
];
const steps = [
  ["Create a quest", "A parent chooses a chore, adds clear instructions, assigns a hero, and sets its XP value."],
  ["Take on the adventure", "A child sees what to do, works through the steps, and sends the finished chore for review."],
  ["Recognize the effort", "A parent checks the work, shares encouragement, and approves the XP or gives helpful feedback."],
  ["Celebrate together", "Children save for personal rewards or contribute toward an adventure the whole family can share."],
];
const appViews = [
  { file: "parent", eyebrow: "For the people guiding the adventure", title: "A little structure for a busy family.", description: "The parent dashboard brings the next decisions into focus: the chores to plan, the work to review, and the rewards to follow through on.", points: ["Give each chore clear instructions and an owner.", "Review completed work and respond with praise or a helpful next step.", "Keep family quests, heroes, and shared progress together."] },
  { file: "hero", eyebrow: "For the little heroes doing their part", title: "A clear next step. A win to feel proud of.", description: "A child's adventure board turns the daily list into something they can explore. Their own profile, visible XP, and ready-to-go quests put their progress within reach.", points: ["Find assigned chores and optional bonus quests.", "Break the work into manageable checklist steps.", "See finished chores, earned XP, and what is ready next."] },
  { file: "rewards", eyebrow: "For the moments worth working toward", title: "Make the reward mean something.", description: "Movie night. A favourite treat. An afternoon at the park. Families choose the rewards that matter to them, and children can see their progress toward those moments.", points: ["Save spendable XP toward a personal reward.", "Request a reward and track it through parent delivery.", "Contribute to a family goal and celebrate a shared achievement."] },
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return <Motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay }}>{children}</Motion.div>;
}

export default function ChoreQuestPage() {
  const reduced = useReducedMotion();
  const [category, setCategory] = useState("all");
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("rahul-theme");
    return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("rahul-theme", isDark ? "dark" : "light");
  }, [isDark]);
  const visibleGroups = choreQuestFeatures.filter(group => category === "all" || group.id === category);
  const featureCount = choreQuestFeatures.reduce((total, group) => total + group.features.length, 0);

  return (
    <div className="cq-story">
      <a className="cq-skip-link" href="#cq-main">Skip to content</a>
      <header className="cq-story-nav">
        <a className="cq-story-brand" href="/chorequest/" aria-label="ChoreQuest home"><img src="/images/chorequest/app-icon.png" width="36" height="36" alt="" /><span>ChoreQuest</span></a>
        <nav aria-label="ChoreQuest page"><a href="#mission">Mission</a><a href="#how-it-works">How it works</a><a href="#features">Features</a><a href="/#chorequest">Portfolio</a></nav>
        <button className="cq-story-theme" onClick={() => setIsDark(value => !value)} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={isDark} type="button">{isDark ? "☀" : "☾"}</button>
      </header>

      <main id="cq-main">
        <section className="cq-story-hero cq-story-container" aria-labelledby="cq-story-title">
          <Reveal className="cq-story-hero-copy">
            <p className="cq-story-eyebrow">ChoreQuest: Family Adventure <span>Coming soon on iOS</span></p>
            <h1 id="cq-story-title">Little chores.<br />Big adventures.<br /><em>Stronger together.</em></h1>
            <p className="cq-story-lead">A little helping hand can mean a lot. ChoreQuest turns everyday responsibilities into quests, gives effort a moment of recognition, and brings the family along for the adventure.</p>
            <div className="cq-story-actions"><a className="cq-story-button" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a><a className="cq-story-text-link" href="#features">Explore all {featureCount} features</a></div>
            <p className="cq-story-byline">Designed and built by Rahul Pawar · Native iOS · SwiftUI</p>
          </Reveal>
          <Reveal className="cq-story-hero-art" delay={0.15}>
            <div className="cq-story-halo" aria-hidden="true" />
            <svg className="cq-story-trail" viewBox="0 0 500 700" fill="none" aria-hidden="true"><Motion.path d="M45 570C-40 390 440 480 440 210S110 30 70 140" stroke="currentColor" strokeWidth="2" strokeDasharray="5 9" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "easeInOut" }} /></svg>
            <div className="cq-story-hero-phone"><IPhoneMockup src="/images/chorequest/hero.webp" alt="Maya's ChoreQuest adventure board with earned XP and ready-to-go chores" loading="eager" fetchPriority="high" /></div>
            <span className="cq-story-float cq-story-float-one" aria-hidden="true"><span>✦</span> Every little win counts.</span>
            <span className="cq-story-float cq-story-float-two" aria-hidden="true"><span>♡</span> One family. One team.</span>
          </Reveal>
        </section>

        <section id="mission" className="cq-story-container cq-story-section" aria-labelledby="mission-title">
          <Reveal className="cq-story-mission"><div><p className="cq-story-eyebrow">The mission</p><h2 id="mission-title">Make helping at home<br /><em>feel meaningful.</em></h2></div><div><p>Everyday contributions deserve to be seen. ChoreQuest is built around a simple idea: children should be able to understand their responsibilities, see their effort matter, and feel part of the family team.</p><p>The goal is to give families a shared rhythm: clear expectations, encouraging feedback, and small moments of pride that make doing your part feel worthwhile.</p></div></Reveal>
        </section>

        <section className="cq-story-container cq-story-section" aria-labelledby="problem-title">
          <Reveal className="cq-story-section-heading"><p className="cq-story-eyebrow">The everyday problem</p><h2 id="problem-title">“Have you done your chores?”<br /><em>There has to be a better rhythm.</em></h2><p>Between busy schedules, unfinished tasks, and another round of reminders, it can be hard for a family to find a routine everyone understands.</p></Reveal>
          <div className="cq-story-problems">{problems.map(([number, title, description], index) => <Reveal className="cq-story-problem" key={number} delay={index * 0.08}><span className="cq-story-number">{number}</span><h3>{title}</h3><p>{description}</p></Reveal>)}</div>
        </section>

        <section id="how-it-works" className="cq-story-container cq-story-section" aria-labelledby="how-title">
          <Reveal className="cq-story-section-heading"><p className="cq-story-eyebrow">How ChoreQuest helps</p><h2 id="how-title">From a daily task<br /><em>to a little triumph.</em></h2><p>A clear, repeatable journey connects responsibility, effort, recognition, and a reward worth working toward.</p></Reveal>
          <div className="cq-story-steps">{steps.map(([title, description], index) => <Reveal className="cq-story-step" key={title} delay={index * 0.1}><span className="cq-story-step-marker">{index + 1}</span><h3>{title}</h3><p>{description}</p></Reveal>)}</div>
        </section>

        <section id="inside-the-app" className="cq-story-container cq-story-section" aria-label="Inside ChoreQuest">
          {appViews.map((view, index) => <Reveal className={`cq-story-app-view cq-story-app-view-${index}`} key={view.file}>
            <div className={`cq-story-app-stage cq-story-app-stage-${view.file}`}><span className="cq-story-stage-spark" aria-hidden="true">{index === 2 ? "◇" : "✦"}</span><IPhoneMockup className="cq-story-detail-device" src={`/images/chorequest/${view.file}.webp`} alt={`${view.title} ChoreQuest ${view.file === "hero" ? "child adventure" : view.file} screenshot with fictional family data`} /></div>
            <div className="cq-story-app-copy"><p className="cq-story-eyebrow">{view.eyebrow}</p><h2>{view.title}</h2><p>{view.description}</p><ul>{view.points.map(point => <li key={point}><span aria-hidden="true">✦</span>{point}</li>)}</ul></div>
          </Reveal>)}
          <p className="cq-story-preview-note">Screenshots show the native app with a fictional family and sample activity.</p>
        </section>

        <section id="features" className="cq-story-container cq-story-section" aria-labelledby="features-title">
          <Reveal className="cq-story-section-heading"><p className="cq-story-eyebrow">The complete feature collection</p><h2 id="features-title">A family adventure.<br /><em>Thought through, little by little.</em></h2><p>Explore {featureCount} features across family setup, everyday chores, rewards, progress, and the details that keep everything running smoothly. Premium features are marked below.</p></Reveal>
          <div className="cq-story-feature-filters" role="group" aria-label="Filter features by category"><button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>All features</button>{choreQuestFeatures.map(group => <button type="button" key={group.id} aria-pressed={category === group.id} onClick={() => setCategory(group.id)}>{({family:"Family",quests:"Quests",encouragement:"Encouragement",rewards:"Rewards",everyday:"Everyday life",insights:"Premium",privacy:"Privacy & access",personalize:"Personal touches"})[group.id]}</button>)}</div>
          <p className="cq-story-feature-status" role="status">{visibleGroups.reduce((count, group) => count + group.features.length, 0)} features · {category === "all" ? "All categories" : visibleGroups[0].title}</p>
          <Motion.div layout={!reduced} className="cq-story-feature-grid"><AnimatePresence mode="popLayout" initial={false}>{visibleGroups.map(group => <Motion.article layout={!reduced} key={group.id} className="cq-story-feature-group" initial={reduced ? false : { opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} exit={{ opacity:0, y:reduced ? 0 : -8 }} viewport={{ once:true, amount:0.05 }} transition={{ duration:reduced ? 0 : 0.3 }}><div className="cq-story-feature-group-heading"><span className="cq-story-feature-symbol" aria-hidden="true">{group.symbol}</span>{group.premium && <span className="cq-story-premium">Premium</span>}</div><h3>{group.title}</h3><ul>{group.features.map(([title, description]) => <li key={title}><h4>{title}</h4><p>{description}</p></li>)}</ul></Motion.article>)}</AnimatePresence></Motion.div>
        </section>

        <section className="cq-story-container cq-story-section" aria-labelledby="principles-title"><Reveal className="cq-story-principles"><p className="cq-story-eyebrow">The heart of the experience</p><h2 id="principles-title">Room to learn.<br /><em>Reasons to celebrate.</em></h2><div><article><h3>Clarity before reminders</h3><p>A child should be able to see what needs doing, what finished looks like, and what happens next.</p></article><article><h3>Encouragement at every step</h3><p>Helpful feedback and recognition make space for learning, asking for help, and trying again.</p></article><article><h3>Rewards with meaning</h3><p>Families choose the moments they want to work toward, from a small personal treat to a shared adventure.</p></article></div></Reveal></section>

        <section className="cq-story-container cq-story-section cq-story-closing" aria-labelledby="closing-title"><Reveal><img src="/images/chorequest/app-icon.png" width="80" height="80" alt="ChoreQuest app icon" loading="lazy" /><p className="cq-story-eyebrow">The next adventure is almost here</p><h2 id="closing-title">A little helping hand.<br /><em>A whole lot of possibility.</em></h2><p>ChoreQuest: Family Adventure is coming soon to iOS.</p><a className="cq-story-button" href="/#chorequest">Back to Rahul's portfolio <span aria-hidden="true">←</span></a></Reveal></section>
      </main>
      <footer className="cq-story-page-footer cq-story-container"><span>ChoreQuest: Family Adventure</span><a href="/#chorequest">Designed and built by Rahul Pawar</a><span>Made for little wins.</span></footer>
    </div>
  );
}
