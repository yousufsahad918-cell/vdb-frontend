export interface Location {
  name: string;
  slug: string;
  sublocations: string[];
  localNote: string;
}

export const locations: Location[] = [
  {
    name: "BTM Layout",
    slug: "btm-layout",
    sublocations: ["BTM 1st Stage", "BTM 2nd Stage", "BTM 3rd Stage", "Madiwala", "Tavarekere", "Udupi Garden"],
    localNote: "BTM Layout is one of Bangalore's most densely populated residential zones — we cover every stage and corner.",
  },
  {
    name: "HSR Layout",
    slug: "hsr-layout",
    sublocations: ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Sector 7", "Agara", "Kudlu Gate"],
    localNote: "HSR Layout's grid layout makes navigation easy — our riders know every sector.",
  },
  {
    name: "Koramangala",
    slug: "koramangala",
    sublocations: ["1st Block", "2nd Block", "3rd Block", "4th Block", "5th Block", "6th Block", "7th Block", "8th Block", "ST Bed", "Ejipura"],
    localNote: "Koramangala is Bangalore's startup hub — fast delivery for the city's busiest professionals.",
  },
  {
    name: "Indiranagar",
    slug: "indiranagar",
    sublocations: ["HAL 1st Stage", "HAL 2nd Stage", "Domlur", "Old Airport Road", "Kodihalli", "Defence Colony"],
    localNote: "Indiranagar's buzzing café and bar culture makes us a natural fit — discreet delivery to your doorstep.",
  },
  {
    name: "Whitefield",
    slug: "whitefield",
    sublocations: ["ITPL", "Brookefield", "AECS Layout", "Kundalahalli", "Hope Farm", "Kadugodi", "Varthur", "Marathahalli"],
    localNote: "Whitefield's tech parks and residential pockets are fully covered — office or apartment, we reach you.",
  },
  {
    name: "Electronic City",
    slug: "electronic-city",
    sublocations: ["Phase 1", "Phase 2", "Doddathogur", "Neeladri Nagar", "Huskur", "Bommasandra"],
    localNote: "Electronic City's massive IT corridor keeps us busy — rapid delivery across both phases.",
  },
  {
    name: "Marathahalli",
    slug: "marathahalli",
    sublocations: ["Bridge Area", "Kalamandir", "Munnekollal", "Tulasi Theatre Road"],
    localNote: "Marathahalli's prime location between IT hubs means we're never far from you.",
  },
  {
    name: "Bellandur",
    slug: "bellandur",
    sublocations: ["Yemalur", "Devarabisanahalli", "Kariyammana Agrahara"],
    localNote: "Bellandur's growing residential and tech community gets priority delivery from us.",
  },
  {
    name: "Sarjapur Road",
    slug: "sarjapur-road",
    sublocations: ["Kaikondrahalli", "Kasavanahalli", "Harlur", "Ambalipura", "Carmelaram"],
    localNote: "Sarjapur Road's rapid development means new neighbourhoods — all of them on our delivery map.",
  },
  {
    name: "Yelahanka",
    slug: "yelahanka",
    sublocations: ["New Town", "Old Town", "Attur", "Kogilu", "Vidyaranyapura"],
    localNote: "Yelahanka's calm residential feel paired with our fast service is the perfect combo.",
  },
  {
    name: "Hebbal",
    slug: "hebbal",
    sublocations: ["RT Nagar", "Nagawara", "Manyata Tech Park Area", "Kempapura"],
    localNote: "Hebbal is Bangalore's northern gateway — Manyata Tech Park to RT Nagar, we've got you.",
  },
  {
    name: "Jayanagar",
    slug: "jayanagar",
    sublocations: ["1st Block", "2nd Block", "3rd Block", "4th Block", "5th Block", "6th Block", "7th Block", "8th Block", "9th Block"],
    localNote: "Jayanagar's classic Bangalore charm meets modern convenience — quick vape delivery, every block.",
  },
  {
    name: "JP Nagar",
    slug: "jp-nagar",
    sublocations: ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6", "Phase 7", "Phase 8"],
    localNote: "JP Nagar's eight phases are all within our delivery radius — no phase left behind.",
  },
  {
    name: "Banashankari",
    slug: "banashankari",
    sublocations: ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Kathriguppe"],
    localNote: "Banashankari's well-planned layout makes our deliveries smooth and on-time, every time.",
  },
  {
    name: "Rajajinagar",
    slug: "rajajinagar",
    sublocations: ["1st Block", "2nd Block", "3rd Block", "4th Block", "5th Block", "6th Block"],
    localNote: "Rajajinagar is one of West Bangalore's most connected areas — our riders know every block.",
  },
  {
    name: "Malleshwaram",
    slug: "malleshwaram",
    sublocations: ["8th Cross", "Sampige Road", "Vyalikaval"],
    localNote: "Malleshwaram's heritage streets get modern convenience — discreet and fast delivery.",
  },
  {
    name: "MG Road",
    slug: "mg-road",
    sublocations: ["Brigade Road", "Church Street", "Residency Road", "Richmond Town", "Shanti Nagar"],
    localNote: "Central Bangalore's most premium corridor — we deliver to the heart of the city.",
  },
  {
    name: "KR Puram",
    slug: "kr-puram",
    sublocations: ["TC Palya", "Ramamurthy Nagar", "A Narayanapura"],
    localNote: "KR Puram's east Bangalore connectivity means fast routes and on-time delivery.",
  },
  {
    name: "Hoodi",
    slug: "hoodi",
    sublocations: ["Hoodi Circle", "Garudachar Palya"],
    localNote: "Hoodi's growing IT and residential mix is squarely in our delivery zone.",
  },
  {
    name: "Hennur",
    slug: "hennur",
    sublocations: ["Kalyan Nagar", "HRBR Layout", "Banaswadi"],
    localNote: "Hennur and its surrounding layouts are fully covered — Kalyan Nagar, HRBR, Banaswadi, all of it.",
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export const WHATSAPP_URL =
  "https://wa.me/916282878843?text=Hi%2C%20I%20want%20to%20order%20a%20vape";

export const SHOP_URL =
  "/#products";
