export type EventItem = {
  slug: string;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
  status: "active" | "soldout" | "hidden";
};

export const EVENTS: EventItem[] = [
  {
    slug: "zeta-tron",
    title: "Zeta Tron – Welcome to the Grid",
    date: "24 de enero 2026 · 7:00 PM",
    location: "Arecibo Country Club",
    price: 15,
    image: "/zeta-tron.jpg",
    status: "active",
  },
];
