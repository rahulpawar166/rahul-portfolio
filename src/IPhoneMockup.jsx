import "./IPhoneMockup.css";

// Front-facing iPhone 18 Pro Max presentation frame. The original app capture
// stays intact; hardware cutouts and the enclosure are separate visual layers.
export default function IPhoneMockup({ src, alt, className = "", loading = "lazy", fetchPriority }) {
  return (
    <span className={`cq-device ${className}`} data-device="iPhone 18 Pro Max">
      <span className="cq-device-body">
        <span className="cq-device-screen">
          <img src={src} alt={alt} width="900" height="1957" loading={loading} fetchPriority={fetchPriority} />
          <span className="cq-device-island" aria-hidden="true"><span className="cq-device-camera" /></span>
          <span className="cq-device-home-indicator" aria-hidden="true" />
        </span>
      </span>
      <span className="cq-device-key cq-device-action" aria-hidden="true" />
      <span className="cq-device-key cq-device-volume-up" aria-hidden="true" />
      <span className="cq-device-key cq-device-volume-down" aria-hidden="true" />
      <span className="cq-device-key cq-device-power" aria-hidden="true" />
      <span className="cq-device-key cq-device-camera-control" aria-hidden="true" />
    </span>
  );
}
