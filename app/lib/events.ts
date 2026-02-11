export type EventItem = {
  slug: string;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
  status: "active" | "soldout" | "hidden";
  priceNewbies?: number;
  pricePreSale?: number;
  priceRegular?: number;
};

export const EVENTS: EventItem[] = [
  {
    slug: "zeta-grid-2",
    title: "Zeta'sGrid 2.0 & TrowBack WelcomeNewbi Show",
    date: "Viernes 6 de marzo 2026 · 7:00 PM",
    location: "Bambalinas Música & Teatro, Aguada PR",
    price: 15,
    priceNewbies: 15,
    pricePreSale: 20,
    priceRegular: 25,
    image: "/zeta-tron.jpg",
    status: "active",
  },
];
