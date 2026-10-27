import { useEffect, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import emailjs from "@emailjs/browser";
import ChoreQuestFeature from "./ChoreQuestFeature";
import { experience, skills, education, certifications } from "./portfolioData";
import mediumArticles from "./mediumArticles.json";
import "./Portfolio.css";
import OpticalGlass from "./OpticalGlass";

const RESUME = "/resume/Rahul_Pawar_Resume.pdf";
const GITHUB = "https://github.com/rahulpawar166";
const MEDIUM = "https://medium.com/@rahulpawar166";
const LINKEDIN = "https://www.linkedin.com/in/rahulpawar41/";
const aiTools = [
  { name: "Claude", icon: "claude" },
  { name: "OpenAI", icon: "openai", monochrome: true },
  { name: "GitHub Copilot", icon: "github-copilot", monochrome: true },
  { name: "Gemini", icon: "gemini" },
];
function Reveal({ children, className = "", delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return <Motion.div {...props} className={className} initial={reduced ? false : {opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.08}} transition={{duration:reduced ? 0 : 0.5,delay:reduced ? 0 : delay}}>{children}</Motion.div>;
}

function Arrow({ direction = "up" }) {
  return <svg className={`rp-arrow rp-arrow-${direction}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ThemeIcon({ dark }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{dark ? <><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></> : <path d="M20.5 13.1A8.6 8.6 0 0 1 10.9 3.5a8.7 8.7 0 1 0 9.6 9.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>}</svg>;
}

function SectionHeading({ eyebrow, title, description, action }) {
  return <Reveal className="rp-section-heading"><div><p className="rp-eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p className="rp-section-description">{description}</p>}</div>{action}</Reveal>;
}

export default function Portfolio() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("rahul-theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark",dark);
    localStorage.setItem("rahul-theme",dark ? "dark" : "light");
  },[dark]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${"https://api.github.com/users/rahulpawar166/repos"}?per_page=100`,{signal:controller.signal})
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const hidden = new Set(["ChoreQuest","RestSync","CompanionKit","Eulerity","Swift-XCTest-Demo-Project","Swift XCTest Demo Project","rahul-portfolio","Rahul-Portfolio"]);
        setRepos(data.filter(repo => !repo.fork && !hidden.has(repo.name)).sort((a,b)=>new Date(b.pushed_at)-new Date(a.pushed_at)).slice(0,6));
      }).catch(() => {});
    return () => controller.abort();
  },[]);
  const writing = mediumArticles;

  return <div className="rp-portfolio">
    <a className="rp-skip" href="#main">Skip to content</a>
    <header className="rp-nav-wrap">
      <div className="rp-nav rp-glass optical-nav" onKeyDown={event=>{if(event.key==="Escape")setMenuOpen(false);}}>
        <OpticalGlass sourceSelector=".rp-portfolio main"/>
        <a href="#cover" className="rp-brand" aria-label="Rahul Pawar home">rahul<span>.</span></a>
        <nav id="portfolio-navigation" className={menuOpen ? "rp-navigation rp-navigation-open" : "rp-navigation"} aria-label="Main navigation">
          {[["#work","Work"],["#writing","Writing"],["#experience","Experience"],["#about","About"],["#contact","Contact"]].map(([href,label])=><a key={href} href={href} onClick={()=>setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="rp-nav-actions"><a className="rp-nav-resume" href={RESUME} target="_blank" rel="noreferrer">Resume <Arrow /></a><button className="rp-theme" type="button" onClick={()=>setDark(value=>!value)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark}><ThemeIcon dark={dark}/></button><button className="rp-menu" type="button" aria-expanded={menuOpen} aria-controls="portfolio-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={()=>setMenuOpen(value=>!value)}><span/><span/></button></div>
      </div>
    </header>

    <main id="main">
      <section id="cover" className="rp-hero rp-container" aria-labelledby="rp-title">
        <Reveal className="rp-hero-content">
          <div className="rp-identity"><span className="rp-identity-photo"><img src="/images/rahul-profile.jpg" width="48" height="48" alt="Rahul Pawar" fetchPriority="high"/></span><div><p>Hi, I’m Rahul Pawar.</p><span>AI-native developer · Senior iOS Developer</span></div></div>
          <h1 id="rp-title">AI-native thinking.<br/><span>Thoughtful apps.</span></h1>
          <p className="rp-hero-description">I build native apps with AI in my everyday workflow.<br className="rp-desktop-break"/> Leading teams, shaping ideas, and caring about the details.</p>
          <div className="rp-ai-toolkit" role="group" aria-labelledby="ai-toolkit-label"><p id="ai-toolkit-label">Daily AI toolkit</p><ul role="list">{aiTools.map(tool=><li key={tool.icon}><img className={tool.monochrome ? "rp-ai-icon-mono" : undefined} src={`/images/ai/${tool.icon}.svg`} width="22" height="22" alt="" aria-hidden="true"/><span>{tool.name}</span></li>)}</ul></div>
          <div className="rp-hero-actions"><a className="rp-button rp-button-primary" href="#work">Explore my work <Arrow direction="down"/></a><a className="rp-button rp-button-glass rp-glass" href="#contact">Let’s talk <Arrow/></a></div>
          <div className="rp-hero-footnote"><span>Currently at Eulerity</span><i aria-hidden="true"/><span>SwiftUI. AI. Product engineering.</span></div>
        </Reveal>
        <div className="rp-hero-glow" aria-hidden="true"/>
      </section>

      <section id="work" className="rp-work rp-container rp-section" aria-labelledby="work-title">
        <SectionHeading eyebrow="Selected work" title={<span id="work-title">Ideas, made tangible.</span>} description="Native apps and useful tools. Built from the first idea to the finishing touches."/>
        <ChoreQuestFeature/>
        <div id="projects" className="rp-project-grid">
          <Reveal className="rp-project rp-project-rest"><div className="rp-project-top"><span className="rp-app-symbol rp-rest-symbol" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M8 22a12 12 0 0 1 24 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M20 13v10l6 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M7 29h26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg></span><span className="rp-project-platform">macOS app</span></div><h3>RestSync</h3><p>A little reminder to step away. A SwiftUI menu-bar app that makes regular screen breaks part of the day.</p><div className="rp-project-bottom"><span>SwiftUI · macOS · Accessibility</span><a href={`${GITHUB}/RestSync`} target="_blank" rel="noreferrer" aria-label="View RestSync on GitHub"><Arrow/></a></div></Reveal>
          <Reveal className="rp-project rp-project-companion" delay={0.08}><div className="rp-project-top"><span className="rp-app-symbol rp-companion-symbol" aria-hidden="true">⌘</span><span className="rp-project-platform">Developer tool</span></div><h3>CompanionKit</h3><p>A helpful companion inside Xcode. Refactor code, find bugs, and understand an implementation without breaking your flow.</p><div className="rp-project-bottom"><span>Swift · XcodeKit · OpenAI</span><a href={`${GITHUB}/CompanionKit`} target="_blank" rel="noreferrer" aria-label="View CompanionKit on GitHub"><Arrow/></a></div></Reveal>
        </div>
        <details className="rp-more-projects"><summary>More experiments on GitHub <span aria-hidden="true">+</span></summary><div className="rp-repo-grid">{repos.map(repo=><a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"><span>{repo.name}</span><small>{repo.language || "Project"}</small><Arrow/></a>)}</div><a className="rp-text-link" href={GITHUB} target="_blank" rel="noreferrer">Explore all repositories <Arrow/></a></details>
      </section>

      <section id="writing" className="rp-writing rp-section" aria-labelledby="writing-title"><div className="rp-container">
        <SectionHeading eyebrow="Notes & ideas" title={<span id="writing-title">Always building.<br/>Always learning.</span>} description="Thoughts on native development, better tools, and the craft of making software." action={<a className="rp-text-link" href={MEDIUM} target="_blank" rel="noreferrer">On Medium <Arrow/></a>}/>
        <div className="rp-writing-grid">{writing.map((article,index)=><Reveal key={article.link} delay={index*.07}>
          <a className={`rp-writing-card rp-writing-card-${index}`} href={article.link} target="_blank" rel="noreferrer">
            <div className="rp-writing-art"><img src={article.cover} alt={`Cover of ${article.title}`} loading="lazy" decoding="async" width="1024" height="576"/></div>
            <div className="rp-writing-copy"><time className="rp-eyebrow" dateTime={new Date(article.pubDate).toISOString()}>{new Date(article.pubDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"})}</time><h3>{article.title}</h3><span className="rp-writing-link">Read the story <Arrow/></span></div>
          </a>
        </Reveal>)}</div>
      </div></section>

      <section id="experience" className="rp-container rp-section" aria-labelledby="experience-title">
        <SectionHeading eyebrow="Experience" title={<span id="experience-title">Built on real-world work.</span>} description="Shipping software, growing teams, and taking responsibility for the whole experience."/>
        <Reveal className="rp-current-role"><div className="rp-role-header"><div className="rp-company-identity"><div className="rp-company-logo"><img src={experience[0].cover} alt="Eulerity" loading="lazy"/></div><div><p className="rp-eyebrow">Current chapter</p><h3>{experience[0].role}</h3><p>{experience[0].company}</p></div></div><span className="rp-period">{experience[0].period}</span></div>
          <div className="rp-impact-grid"><div><strong>Team</strong><span>leadership</span><p>Technical direction, mentoring, and delivery ownership.</p></div><div><strong>~70<span>%</span></strong><span>of the app in SwiftUI</span><p>Leading a migration that opens iOS to more contributors.</p></div><div><strong>&lt;1 <span>day</span></strong><span>for AI-assisted PR review</span><p>A workflow that brought review time down from about a week.</p></div></div>
          <p className="rp-role-summary">From SwiftUI architecture to App Store releases, I work across product and engineering to bring thoughtful features into production—on iOS, Android, web, and backend.</p><details className="rp-role-details"><summary>A closer look at the role <span aria-hidden="true">+</span></summary><ul>{experience[0].sentences.map(sentence=><li key={sentence}>{sentence}</li>)}</ul></details>
        </Reveal>
        <div className="rp-timeline">{experience.slice(1).map(role=><Reveal className="rp-timeline-row" key={role.company+role.period}><div className="rp-timeline-date">{role.period}</div><div><h3>{role.role}</h3><p className="rp-timeline-company">{role.company}</p><ul>{role.sentences.map(sentence=><li key={sentence}>{sentence}</li>)}</ul></div></Reveal>)}</div>
      </section>

      <section id="about" className="rp-about rp-section"><div className="rp-container">
        <div className="rp-about-grid"><Reveal><p className="rp-eyebrow">A little about me</p><h2>Curious by nature.<br/><span>Thoughtful by design.</span></h2><p>I’m an AI-native developer who enjoys making complicated things feel simple. My work brings together native app development, technical leadership, and thoughtful use of AI.</p><p>Claude, OpenAI, GitHub Copilot, and Gemini are part of my day-to-day development. Alongside leading iOS delivery at Eulerity, I build my own apps and developer tools, and I’m pursuing a master’s in Artificial Intelligence.</p><a className="rp-text-link" href={LINKEDIN} target="_blank" rel="noreferrer">More about my journey <Arrow/></a></Reveal><Reveal id="skills" className="rp-skills"><h3>The tools behind the craft.</h3>{skills.map(group=><div className="rp-skill-group" key={group.group}><h4>{group.group}</h4><p>{group.items.join(" · ")}</p></div>)}</Reveal></div>
        <div id="education" className="rp-education">{education.map(item=><Reveal className="rp-education-item" key={item.school}><img src={item.logo} width="48" height="48" alt="" loading="lazy"/><div><p className="rp-eyebrow">{item.period}</p><h3>{item.degree}</h3><p>{item.school} · {item.location}</p></div></Reveal>)}</div>
        <section id="certifications" className="rp-certifications" aria-labelledby="certifications-title"><h3 id="certifications-title">Certifications</h3><ul className="rp-certification-list" role="list">{certifications.map(cert=><li key={cert.file}><a href={cert.file} target="_blank" rel="noreferrer" aria-label={`View ${cert.title.trim()} certificate (opens in a new tab)`}><span>{cert.title.trim()}</span><Arrow/></a></li>)}</ul></section>
        <Reveal className="rp-resume-panel"><div id="resume"><p className="rp-eyebrow">The fuller picture</p><h3>Experience, in a little more detail.</h3></div><div><a className="rp-text-link" href={RESUME} target="_blank" rel="noreferrer">View resume <Arrow/></a><a className="rp-text-link" href={RESUME} download>Download PDF <Arrow direction="down"/></a></div></Reveal>
      </div></section>

      <section id="contact" className="rp-container rp-section"><Reveal className="rp-contact"><p className="rp-eyebrow">Let’s make something good</p><h2>Have something<br/><span>in mind?</span></h2><p>An idea, an opportunity, or a conversation.<br/>I’d love to hear what you’re thinking.</p><div className="rp-contact-actions"><a className="rp-button rp-button-primary" href="mailto:rahulpawar166@gmail.com">Say hello <Arrow/></a><a className="rp-text-link" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <Arrow/></a><a className="rp-text-link" href={GITHUB} target="_blank" rel="noreferrer">GitHub <Arrow/></a></div><div className="rp-contact-direct"><a href="mailto:rahulpawar166@gmail.com">rahulpawar166@gmail.com</a><span aria-hidden="true">·</span><a href="tel:+15516897590">+1 (551) 689-7590</a></div><details className="rp-contact-form-details"><summary>Or leave me a note here <span aria-hidden="true">+</span></summary><ContactForm/></details></Reveal></section>
    </main>
    <footer className="rp-footer rp-container"><a className="rp-brand" href="#cover">rahul<span>.</span></a><p>© {new Date().getFullYear()} Rahul Pawar</p><a className="rp-text-link" href="#cover">Back to top <Arrow/></a></footer>
  </div>;
}

function ContactForm() {
  const [fields,setFields]=useState({first:"",last:"",email:"",subject:"",message:""});
  const [status,setStatus]=useState("");
  const [sending,setSending]=useState(false);
  async function submit(event) {
    event.preventDefault();
    const service=import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const template=import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const key=import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if(!service || !template || !key) { setStatus("Please email me directly at rahulpawar166@gmail.com while this form is unavailable."); return; }
    setSending(true); setStatus("");
    try {
      await emailjs.send(service,template,{from_first:fields.first,from_last:fields.last,from_email:fields.email,subject:fields.subject,message:fields.message,to_name:"Rahul Pawar",to_email:"rahulpawar166@gmail.com"},{publicKey:key});
      setFields({first:"",last:"",email:"",subject:"",message:""}); setStatus("Thanks for reaching out. Your message has been sent.");
    } catch { setStatus("Your message couldn’t be sent. Please try again or email me directly."); }
    finally { setSending(false); }
  }
  return <form className="rp-form" onSubmit={submit}>{[["first","First name"],["last","Last name"],["email","Email"],["subject","Subject"]].map(([name,label])=><div key={name} className={name==="email"||name==="subject" ? "rp-form-wide" : ""}><label htmlFor={`contact-${name}`}>{label}</label><input id={`contact-${name}`} name={name} type={name==="email"?"email":"text"} autoComplete={name==="email"?"email":name==="first"?"given-name":name==="last"?"family-name":"off"} required value={fields[name]} onChange={event=>setFields({...fields,[name]:event.target.value})}/></div>)}<div className="rp-form-wide"><label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" rows="5" required value={fields.message} onChange={event=>setFields({...fields,message:event.target.value})}/></div><p className="rp-form-status rp-form-wide" role="status">{status}</p><button className="rp-button rp-button-primary rp-form-wide" type="submit" disabled={sending}>{sending?"Sending…":"Send message"}<Arrow/></button></form>;
}
