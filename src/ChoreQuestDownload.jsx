import { choreQuestAppStoreURL } from "./choreQuestApp";

export default function ChoreQuestDownload() {
  return (
    <figure className="cq-download-qr">
      <a href={choreQuestAppStoreURL} aria-label="Download ChoreQuest: Family Adventures on the App Store">
        <img src="/images/chorequest/app-store-qr.png" alt="QR code linking to ChoreQuest on the App Store" width="400" height="400" loading="lazy" />
      </a>
      <figcaption>Scan to download on iPhone or iPad.<br />Or tap the QR code to open the App Store.</figcaption>
    </figure>
  );
}
