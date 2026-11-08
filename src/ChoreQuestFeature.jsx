import { useRef, useState } from "react";
import "./ChoreQuestFeature.css";
import { choreQuestAppStoreURL } from "./choreQuestApp";
import IPhoneMockup from "./IPhoneMockup";

const screens = [
  { file: "parent", label: "A little structure. A lot of adventure.", title: "Built for parents", alt: "ChoreQuest parent dashboard with family quests, heroes, and shared progress" },
  { file: "hero", label: "Small wins make mighty heroes.", title: "Made for little heroes", alt: "Maya's ChoreQuest adventure dashboard with daily quests and earned XP" },
  { file: "rewards", label: "Something wonderful to work toward.", title: "Rewards that mean more", alt: "ChoreQuest rewards screen with movie night, ice cream, and a trip to the park" },
];

export default function ChoreQuestFeature() {
  const dialog = useRef(null);
  const [activeScreen, setActiveScreen] = useState(screens[1]);

  function openScreenshot(screen) {
    setActiveScreen(screen);
    dialog.current.showModal();
  }

  return (
    <section id="chorequest" aria-labelledby="chorequest-title" className="cq-section mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="cq-showcase">
        <div className="cq-orbit cq-orbit-one" aria-hidden="true" />
        <div className="cq-orbit cq-orbit-two" aria-hidden="true" />
        <div className="cq-intro">
          <div className="cq-topline">
            <span className="cq-eyebrow">Featured app / Now on the App Store</span>
            <span className="cq-platform">iPhone & iPad</span>
          </div>
          <div className="cq-heading-row">
            <div>
              <h2 id="chorequest-title">ChoreQuest<span><span className="sr-only">: </span>Family Adventures</span></h2>
              <p className="cq-tagline">Everyday chores.<br /><em>Extraordinary little heroes.</em></p>
            </div>
            <img className="cq-app-icon" src="/images/chorequest/app-icon.png" alt="ChoreQuest app icon" width="112" height="112" loading="lazy" />
          </div>
          <p className="cq-description">A family adventure built around helping out. Parents turn routines into quests. Kids earn XP, work toward rewards, and discover how much they can accomplish together.</p>
          <div className="cq-launch-actions"><a className="cq-explore-button" href={choreQuestAppStoreURL}>Download on the App Store <span aria-hidden="true">↗</span></a><a className="cq-launch-details" href="/chorequest/">Explore ChoreQuest <span aria-hidden="true">→</span></a></div>
          <p className="cq-launch-note">Free to download · Optional Premium subscription · iOS / iPadOS 27.0 or later</p>
          <div className="cq-details">
            <p><span aria-hidden="true">✦</span> Quests with purpose</p>
            <p><span aria-hidden="true">✧</span> Rewards worth earning</p>
            <p><span aria-hidden="true">↗</span> Progress as a family</p>
          </div>
        </div>

        <div className="cq-gallery" aria-label="ChoreQuest app screenshots">
          {screens.map((screen, index) => (
            <figure key={screen.file} className={`cq-shot cq-shot-${index}`}>
              <button type="button" className="cq-phone" onClick={() => openScreenshot(screen)} aria-label={`Enlarge screenshot: ${screen.title}`} aria-haspopup="dialog">
                <IPhoneMockup src={`/images/chorequest/${screen.file}.webp`} alt={screen.alt} />
              </button>
              <figcaption><span>{screen.title}</span><p>{screen.label}</p></figcaption>
            </figure>
          ))}
        </div>

        <div className="cq-footer">
          <p><span className="cq-status-dot" aria-hidden="true" /> The family adventure starts here. Available now.</p>
          <p className="cq-stack">Built by Rahul <span aria-hidden="true">·</span> SwiftUI <span aria-hidden="true">·</span> Firebase</p>
        </div>
      </div>

      <dialog ref={dialog} className="cq-dialog" aria-labelledby="cq-dialog-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current.close(); }}>
        <div className="cq-dialog-bar">
          <h3 id="cq-dialog-title">{activeScreen.title}</h3>
          <button type="button" onClick={() => dialog.current.close()} aria-label="Close screenshot" autoFocus>✕</button>
        </div>
        <IPhoneMockup className="cq-dialog-device" src={`/images/chorequest/${activeScreen.file}.webp`} alt={activeScreen.alt} loading="eager" />
        <p className="cq-demo-note">App preview with fictional family data.</p>
      </dialog>
    </section>
  );
}
