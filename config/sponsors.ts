import generatedSponsors from "@/config/sponsors.generated.json";
import type {
  Sponsor,
  SponsorPageConfig,
  SponsorTier,
  SponsorsSectionConfig,
} from "@/config/types";

/**
 * One tier, one price. Five dollars, paid once, seat stays up for good.
 *
 * Deliberately cheap because the traffic is small: about 120 unique visitors
 * a day, of which only a few dozen genuinely engage per week. Impulse
 * donations live in the $3-10 band, and flat payment fees eat a flat ~30c,
 * which makes $2 nearly pointless. A $5 seat that sells beats a $20 seat
 * that nobody buys.
 */
export const sponsorTiers: SponsorTier[] = [
  {
    id: "seat",
    name: "Orbit seat",
    price: 5,
    duration: "one-time, permanent",
    description:
      "Five dollars, once. Your name or logo takes a seat on the orbit and stays there.",
    perks: [
      "Logo or initials on one of the six seats",
      "Link to your site, repo, or profile",
      "Permanent, never rotated out",
    ],
    order: 1,
    enabled: true,
  },
];

/**
 * The sponsor orbit. Each enabled sponsor takes one seat around Bit; open
 * seats stay dashed with a plus. Paid seats are committed automatically:
 * the Dodo webhook writes to `sponsors.generated.json` via the GitHub API
 * and the deploy picks it up. Hand-edited sponsors stay in `sponsorsConfig`
 * below and are merged ahead of the generated ones.
 */
export const sponsorsSectionConfig: SponsorsSectionConfig = {
  label: "Sponsor",
  heading: "join the orbit.",
  description: "Built out of pocket. A seat is $5, once, and stays up for good.",
  seats: 6,
  tiers: sponsorTiers,
};

/**
 * Copy for the dedicated /sponsor page. The home section stays a teaser;
 * this is the full pitch: why seats exist, what one includes, and how
 * claiming works. Prices still come from `sponsorTiers` at render time, so
 * the page never drifts from checkout.
 */
export const sponsorPageConfig: SponsorPageConfig = {
  title: "Sponsor the work.",
  tagline: "Take a seat beside Bit, for good.",
  description:
    "Everything on this site is built and paid for out of pocket: the components, the case studies, the small experiments. A seat keeps it independent and ad free. Five dollars, once, and your name stays on the orbit.",
  mascotCaption: "Your host",
  whyHeading: "What a seat does",
  why: [
    {
      label: "Keeps it free",
      description:
        "The registry, the writeups, the demos. Seats keep all of it open and ad free.",
    },
    {
      label: "Pays the bills",
      description:
        "Domain, hosting, and the tools behind the site. Boring costs, covered on time.",
    },
    {
      label: "Funds the weird stuff",
      description:
        "Small experiments like this orbit exist because someone backed them early.",
    },
  ],
  tierHeading: "One tier, one price",
  stepsHeading: "How it works",
  steps: [
    {
      label: "Take a seat",
      description: "Checkout takes about a minute. $5 once, nothing recurring.",
    },
    {
      label: "Make it yours",
      description:
        "Right after payment, add your name, link, and logo on the claim page.",
    },
    {
      label: "Live on the orbit",
      description:
        "One deploy later, your seat sits beside Bit on the home page, permanently.",
    },
  ],
  ctaHeading: "Ready when you are.",
  ctaDescription:
    "One payment, no subscription. The seat stays up as long as the site does.",
};

/** Dodo product id for the $5 orbit seat, used to create checkout sessions. */
export const orbitSeatProductId = process.env.DODO_ORBIT_SEAT_PRODUCT_ID ?? "";

export const sponsorsConfig: Sponsor[] = [
  // Hand-edited sponsors. `logo` is an optional square image src; paid
  // sponsors that have not claimed yet fall back to an Avvvatars shape.
];

/** Every sponsor in authored order: hand-edited first, then webhook-paid. */
export function getAllSponsors(): Sponsor[] {
  const generated = generatedSponsors as Sponsor[];
  return [...sponsorsConfig, ...generated].sort((a, b) => a.order - b.order);
}

/** Only the claimed ones, clamped to the orbit so a stray index cannot escape it. */
export function getEnabledSponsors(seats: number): Sponsor[] {
  return getAllSponsors().filter(
    (sponsor) => sponsor.enabled !== false && sponsor.seat < seats,
  );
}
