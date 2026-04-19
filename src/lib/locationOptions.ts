export interface LocationOption {
  label: string;
  sublocation: string;
  mainLocation: string;
}

export const locationOptions: LocationOption[] = [
  // BTM Layout
  { label: "BTM 1st Stage", sublocation: "BTM 1st Stage", mainLocation: "BTM Layout" },
  { label: "BTM 2nd Stage", sublocation: "BTM 2nd Stage", mainLocation: "BTM Layout" },
  { label: "BTM 3rd Stage", sublocation: "BTM 3rd Stage", mainLocation: "BTM Layout" },
  { label: "Madiwala", sublocation: "Madiwala", mainLocation: "BTM Layout" },
  { label: "Tavarekere", sublocation: "Tavarekere", mainLocation: "BTM Layout" },
  { label: "Udupi Garden", sublocation: "Udupi Garden", mainLocation: "BTM Layout" },
  // HSR Layout
  { label: "HSR Sector 1", sublocation: "Sector 1", mainLocation: "HSR Layout" },
  { label: "HSR Sector 2", sublocation: "Sector 2", mainLocation: "HSR Layout" },
  { label: "HSR Sector 3", sublocation: "Sector 3", mainLocation: "HSR Layout" },
  { label: "HSR Sector 4", sublocation: "Sector 4", mainLocation: "HSR Layout" },
  { label: "HSR Sector 5", sublocation: "Sector 5", mainLocation: "HSR Layout" },
  { label: "HSR Sector 6", sublocation: "Sector 6", mainLocation: "HSR Layout" },
  { label: "HSR Sector 7", sublocation: "Sector 7", mainLocation: "HSR Layout" },
  { label: "Agara", sublocation: "Agara", mainLocation: "HSR Layout" },
  { label: "Kudlu Gate", sublocation: "Kudlu Gate", mainLocation: "HSR Layout" },
  // Koramangala
  { label: "Koramangala 1st Block", sublocation: "1st Block", mainLocation: "Koramangala" },
  { label: "Koramangala 2nd Block", sublocation: "2nd Block", mainLocation: "Koramangala" },
  { label: "Koramangala 3rd Block", sublocation: "3rd Block", mainLocation: "Koramangala" },
  { label: "Koramangala 4th Block", sublocation: "4th Block", mainLocation: "Koramangala" },
  { label: "Koramangala 5th Block", sublocation: "5th Block", mainLocation: "Koramangala" },
  { label: "Koramangala 6th Block", sublocation: "6th Block", mainLocation: "Koramangala" },
  { label: "Koramangala 7th Block", sublocation: "7th Block", mainLocation: "Koramangala" },
  { label: "Koramangala 8th Block", sublocation: "8th Block", mainLocation: "Koramangala" },
  { label: "ST Bed", sublocation: "ST Bed", mainLocation: "Koramangala" },
  { label: "Ejipura", sublocation: "Ejipura", mainLocation: "Koramangala" },
  // Indiranagar
  { label: "HAL 1st Stage", sublocation: "HAL 1st Stage", mainLocation: "Indiranagar" },
  { label: "HAL 2nd Stage", sublocation: "HAL 2nd Stage", mainLocation: "Indiranagar" },
  { label: "Domlur", sublocation: "Domlur", mainLocation: "Indiranagar" },
  { label: "Old Airport Road", sublocation: "Old Airport Road", mainLocation: "Indiranagar" },
  { label: "Kodihalli", sublocation: "Kodihalli", mainLocation: "Indiranagar" },
  { label: "Defence Colony", sublocation: "Defence Colony", mainLocation: "Indiranagar" },
  // Whitefield
  { label: "ITPL", sublocation: "ITPL", mainLocation: "Whitefield" },
  { label: "Brookefield", sublocation: "Brookefield", mainLocation: "Whitefield" },
  { label: "AECS Layout", sublocation: "AECS Layout", mainLocation: "Whitefield" },
  { label: "Kundalahalli", sublocation: "Kundalahalli", mainLocation: "Whitefield" },
  { label: "Hope Farm", sublocation: "Hope Farm", mainLocation: "Whitefield" },
  { label: "Kadugodi", sublocation: "Kadugodi", mainLocation: "Whitefield" },
  { label: "Varthur", sublocation: "Varthur", mainLocation: "Whitefield" },
  { label: "Marathahalli", sublocation: "Marathahalli", mainLocation: "Whitefield" },
  // Electronic City
  { label: "Electronic City Phase 1", sublocation: "Phase 1", mainLocation: "Electronic City" },
  { label: "Electronic City Phase 2", sublocation: "Phase 2", mainLocation: "Electronic City" },
  { label: "Doddathogur", sublocation: "Doddathogur", mainLocation: "Electronic City" },
  { label: "Neeladri Nagar", sublocation: "Neeladri Nagar", mainLocation: "Electronic City" },
  { label: "Huskur", sublocation: "Huskur", mainLocation: "Electronic City" },
  { label: "Bommasandra", sublocation: "Bommasandra", mainLocation: "Electronic City" },
  // Marathahalli
  { label: "Marathahalli Bridge", sublocation: "Bridge Area", mainLocation: "Marathahalli" },
  { label: "Kalamandir", sublocation: "Kalamandir", mainLocation: "Marathahalli" },
  { label: "Munnekollal", sublocation: "Munnekollal", mainLocation: "Marathahalli" },
  { label: "Tulasi Theatre Road", sublocation: "Tulasi Theatre Road", mainLocation: "Marathahalli" },
  // Bellandur
  { label: "Yemalur", sublocation: "Yemalur", mainLocation: "Bellandur" },
  { label: "Devarabisanahalli", sublocation: "Devarabisanahalli", mainLocation: "Bellandur" },
  { label: "Kariyammana Agrahara", sublocation: "Kariyammana Agrahara", mainLocation: "Bellandur" },
  // Sarjapur Road
  { label: "Kaikondrahalli", sublocation: "Kaikondrahalli", mainLocation: "Sarjapur Road" },
  { label: "Kasavanahalli", sublocation: "Kasavanahalli", mainLocation: "Sarjapur Road" },
  { label: "Harlur", sublocation: "Harlur", mainLocation: "Sarjapur Road" },
  { label: "Ambalipura", sublocation: "Ambalipura", mainLocation: "Sarjapur Road" },
  { label: "Carmelaram", sublocation: "Carmelaram", mainLocation: "Sarjapur Road" },
  // Yelahanka
  { label: "Yelahanka New Town", sublocation: "New Town", mainLocation: "Yelahanka" },
  { label: "Yelahanka Old Town", sublocation: "Old Town", mainLocation: "Yelahanka" },
  { label: "Attur", sublocation: "Attur", mainLocation: "Yelahanka" },
  { label: "Kogilu", sublocation: "Kogilu", mainLocation: "Yelahanka" },
  { label: "Vidyaranyapura", sublocation: "Vidyaranyapura", mainLocation: "Yelahanka" },
  // Hebbal
  { label: "RT Nagar", sublocation: "RT Nagar", mainLocation: "Hebbal" },
  { label: "Nagawara", sublocation: "Nagawara", mainLocation: "Hebbal" },
  { label: "Manyata Tech Park", sublocation: "Manyata Tech Park Area", mainLocation: "Hebbal" },
  { label: "Kempapura", sublocation: "Kempapura", mainLocation: "Hebbal" },
  // Jayanagar
  { label: "Jayanagar 1st Block", sublocation: "1st Block", mainLocation: "Jayanagar" },
  { label: "Jayanagar 2nd Block", sublocation: "2nd Block", mainLocation: "Jayanagar" },
  { label: "Jayanagar 3rd Block", sublocation: "3rd Block", mainLocation: "Jayanagar" },
  { label: "Jayanagar 4th Block", sublocation: "4th Block", mainLocation: "Jayanagar" },
  { label: "Jayanagar 5th Block", sublocation: "5th Block", mainLocation: "Jayanagar" },
  { label: "Jayanagar 6th Block", sublocation: "6th Block", mainLocation: "Jayanagar" },
  { label: "Jayanagar 7th Block", sublocation: "7th Block", mainLocation: "Jayanagar" },
  { label: "Jayanagar 8th Block", sublocation: "8th Block", mainLocation: "Jayanagar" },
  { label: "Jayanagar 9th Block", sublocation: "9th Block", mainLocation: "Jayanagar" },
  // JP Nagar
  { label: "JP Nagar Phase 1", sublocation: "Phase 1", mainLocation: "JP Nagar" },
  { label: "JP Nagar Phase 2", sublocation: "Phase 2", mainLocation: "JP Nagar" },
  { label: "JP Nagar Phase 3", sublocation: "Phase 3", mainLocation: "JP Nagar" },
  { label: "JP Nagar Phase 4", sublocation: "Phase 4", mainLocation: "JP Nagar" },
  { label: "JP Nagar Phase 5", sublocation: "Phase 5", mainLocation: "JP Nagar" },
  { label: "JP Nagar Phase 6", sublocation: "Phase 6", mainLocation: "JP Nagar" },
  { label: "JP Nagar Phase 7", sublocation: "Phase 7", mainLocation: "JP Nagar" },
  { label: "JP Nagar Phase 8", sublocation: "Phase 8", mainLocation: "JP Nagar" },
  // Banashankari
  { label: "Banashankari Stage 1", sublocation: "Stage 1", mainLocation: "Banashankari" },
  { label: "Banashankari Stage 2", sublocation: "Stage 2", mainLocation: "Banashankari" },
  { label: "Banashankari Stage 3", sublocation: "Stage 3", mainLocation: "Banashankari" },
  { label: "Banashankari Stage 4", sublocation: "Stage 4", mainLocation: "Banashankari" },
  { label: "Kathriguppe", sublocation: "Kathriguppe", mainLocation: "Banashankari" },
  // Rajajinagar
  { label: "Rajajinagar 1st Block", sublocation: "1st Block", mainLocation: "Rajajinagar" },
  { label: "Rajajinagar 2nd Block", sublocation: "2nd Block", mainLocation: "Rajajinagar" },
  { label: "Rajajinagar 3rd Block", sublocation: "3rd Block", mainLocation: "Rajajinagar" },
  { label: "Rajajinagar 4th Block", sublocation: "4th Block", mainLocation: "Rajajinagar" },
  { label: "Rajajinagar 5th Block", sublocation: "5th Block", mainLocation: "Rajajinagar" },
  { label: "Rajajinagar 6th Block", sublocation: "6th Block", mainLocation: "Rajajinagar" },
  // Malleshwaram
  { label: "8th Cross Malleshwaram", sublocation: "8th Cross", mainLocation: "Malleshwaram" },
  { label: "Sampige Road", sublocation: "Sampige Road", mainLocation: "Malleshwaram" },
  { label: "Vyalikaval", sublocation: "Vyalikaval", mainLocation: "Malleshwaram" },
  // MG Road
  { label: "Brigade Road", sublocation: "Brigade Road", mainLocation: "MG Road" },
  { label: "Church Street", sublocation: "Church Street", mainLocation: "MG Road" },
  { label: "Residency Road", sublocation: "Residency Road", mainLocation: "MG Road" },
  { label: "Richmond Town", sublocation: "Richmond Town", mainLocation: "MG Road" },
  { label: "Shanti Nagar", sublocation: "Shanti Nagar", mainLocation: "MG Road" },
  // KR Puram
  { label: "TC Palya", sublocation: "TC Palya", mainLocation: "KR Puram" },
  { label: "Ramamurthy Nagar", sublocation: "Ramamurthy Nagar", mainLocation: "KR Puram" },
  { label: "A Narayanapura", sublocation: "A Narayanapura", mainLocation: "KR Puram" },
  // Hoodi
  { label: "Hoodi Circle", sublocation: "Hoodi Circle", mainLocation: "Hoodi" },
  { label: "Garudachar Palya", sublocation: "Garudachar Palya", mainLocation: "Hoodi" },
  // Hennur
  { label: "Kalyan Nagar", sublocation: "Kalyan Nagar", mainLocation: "Hennur" },
  { label: "HRBR Layout", sublocation: "HRBR Layout", mainLocation: "Hennur" },
  { label: "Banaswadi", sublocation: "Banaswadi", mainLocation: "Hennur" },
];
