import type { GigPreview } from "@giggi/domain";

import styles from "./home-shell.module.css";

type GigRowProps = {
  gig: GigPreview;
  isSaved: boolean;
  onToggleSaved: () => void;
};

export function GigRow({ gig, isSaved, onToggleSaved }: GigRowProps) {
  const chips = [gig.category, gig.urgencyLabel, gig.freshnessChip, gig.promoChip].filter(Boolean);

  return (
    <article className={styles.gigRow}>
      <div className={styles.identityRow}>
        <div className={styles.avatarCircle} aria-hidden="true">
          {gig.creatorName.slice(0, 1)}
        </div>
        <div>
          <strong>{gig.creatorName}</strong>
          <p>
            {gig.creatorBadge} · {gig.ratingLabel}
          </p>
        </div>
      </div>

      <div className={styles.chipRow}>
        {chips.map((chip) => (
          <span className={styles.chip} key={chip}>
            {chip}
          </span>
        ))}
      </div>

      <h3>{gig.title}</h3>
      <p className={styles.metaLine}>
        {gig.locationLabel} · {gig.scheduleLabel} · {gig.compensationLabel}
      </p>

      {gig.paymentLabel ? <p className={styles.paymentLine}>{gig.paymentLabel}</p> : null}

      <p className={styles.description}>{gig.description}</p>

      {gig.hasImage ? (
        <div className={styles.imageBlock} role="img" aria-label={gig.imageLabel}>
          <span>{gig.imageLabel}</span>
        </div>
      ) : null}

      <div className={styles.footer}>
        <button className={styles.contactButton} type="button">
          Contact
        </button>
        <button
          aria-label={isSaved ? "Remove saved gig" : "Save gig"}
          aria-pressed={isSaved}
          className={styles.footerIcon}
          onClick={onToggleSaved}
          type="button"
        >
          {isSaved ? "Saved" : "Save"}
        </button>
        <button aria-label="More actions" className={styles.footerIcon} type="button">
          More
        </button>
      </div>

      <p className={styles.messageMeta}>{gig.messageCount} existing messages</p>
    </article>
  );
}

