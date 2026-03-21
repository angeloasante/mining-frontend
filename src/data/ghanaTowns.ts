export interface GhanaTown {
  name: string;
  region: string;
  lat: number;
  lon: number;
}

export const GHANA_TOWNS: GhanaTown[] = [
  // Greater Accra Region
  { name: "Accra", region: "Greater Accra", lat: 5.6037, lon: -0.1870 },
  { name: "Tema", region: "Greater Accra", lat: 5.6698, lon: -0.0166 },
  { name: "Madina", region: "Greater Accra", lat: 5.6800, lon: -0.1660 },
  { name: "Ashaiman", region: "Greater Accra", lat: 5.6940, lon: -0.0390 },
  { name: "Teshie", region: "Greater Accra", lat: 5.5830, lon: -0.1060 },
  { name: "Nungua", region: "Greater Accra", lat: 5.5920, lon: -0.0740 },
  { name: "Kasoa", region: "Greater Accra", lat: 5.5340, lon: -0.4190 },
  { name: "Dodowa", region: "Greater Accra", lat: 5.8800, lon: -0.0980 },
  { name: "Prampram", region: "Greater Accra", lat: 5.7230, lon: 0.1130 },
  { name: "Ada Foah", region: "Greater Accra", lat: 5.7860, lon: 0.6380 },

  // Ashanti Region
  { name: "Kumasi", region: "Ashanti", lat: 6.6884, lon: -1.6244 },
  { name: "Obuasi", region: "Ashanti", lat: 6.2024, lon: -1.6658 },
  { name: "Konongo", region: "Ashanti", lat: 6.6170, lon: -1.2140 },
  { name: "Mampong", region: "Ashanti", lat: 7.0630, lon: -1.4000 },
  { name: "Bekwai", region: "Ashanti", lat: 6.4560, lon: -1.5720 },
  { name: "Ejisu", region: "Ashanti", lat: 6.6930, lon: -1.4680 },
  { name: "Agogo", region: "Ashanti", lat: 6.8010, lon: -1.0830 },
  { name: "Manso Nkwanta", region: "Ashanti", lat: 6.3150, lon: -1.9230 },
  { name: "Nyinahin", region: "Ashanti", lat: 6.5660, lon: -2.0890 },
  { name: "Tepa", region: "Ashanti", lat: 7.0210, lon: -2.0060 },
  { name: "Juaso", region: "Ashanti", lat: 6.5280, lon: -1.0930 },
  { name: "Nkawie", region: "Ashanti", lat: 6.7080, lon: -1.8040 },
  { name: "Offinso", region: "Ashanti", lat: 7.0360, lon: -1.6570 },
  { name: "Kuntenase", region: "Ashanti", lat: 6.5350, lon: -1.5830 },
  { name: "New Edubiase", region: "Ashanti", lat: 6.2740, lon: -1.4690 },

  // Western Region
  { name: "Takoradi", region: "Western", lat: 4.8980, lon: -1.7600 },
  { name: "Sekondi", region: "Western", lat: 4.9430, lon: -1.7140 },
  { name: "Tarkwa", region: "Western", lat: 5.3044, lon: -1.9928 },
  { name: "Prestea", region: "Western", lat: 5.4330, lon: -2.1440 },
  { name: "Bogoso", region: "Western", lat: 5.5370, lon: -2.0060 },
  { name: "Axim", region: "Western", lat: 4.8660, lon: -2.2380 },
  { name: "Elubo", region: "Western", lat: 5.3270, lon: -2.7770 },
  { name: "Half Assini", region: "Western", lat: 5.0220, lon: -2.3920 },
  { name: "Shama", region: "Western", lat: 5.0080, lon: -1.6310 },
  { name: "Nkroful", region: "Western", lat: 4.9530, lon: -2.1480 },
  { name: "Wassa Akropong", region: "Western", lat: 5.4200, lon: -1.8960 },
  { name: "Aboso", region: "Western", lat: 5.3540, lon: -1.9370 },
  { name: "Nsuta", region: "Western", lat: 5.2830, lon: -1.9690 },

  // Western North Region
  { name: "Sefwi Wiawso", region: "Western North", lat: 6.2150, lon: -2.4860 },
  { name: "Bibiani", region: "Western North", lat: 6.4630, lon: -2.3190 },
  { name: "Enchi", region: "Western North", lat: 5.8250, lon: -2.8220 },
  { name: "Juaboso", region: "Western North", lat: 6.3280, lon: -2.8150 },
  { name: "Akontombra", region: "Western North", lat: 6.0530, lon: -2.3810 },
  { name: "Asawinso", region: "Western North", lat: 6.1960, lon: -2.5270 },

  // Central Region
  { name: "Cape Coast", region: "Central", lat: 5.1036, lon: -1.2466 },
  { name: "Winneba", region: "Central", lat: 5.3530, lon: -0.6250 },
  { name: "Dunkwa-on-Offin", region: "Central", lat: 5.9650, lon: -1.7810 },
  { name: "Agona Swedru", region: "Central", lat: 5.5340, lon: -0.6990 },
  { name: "Saltpond", region: "Central", lat: 5.2080, lon: -1.0610 },
  { name: "Mankessim", region: "Central", lat: 5.2770, lon: -1.0260 },
  { name: "Assin Fosu", region: "Central", lat: 5.7490, lon: -1.2370 },
  { name: "Twifo Praso", region: "Central", lat: 5.7350, lon: -1.5380 },
  { name: "Elmina", region: "Central", lat: 5.0844, lon: -1.3508 },
  { name: "Anomabu", region: "Central", lat: 5.1730, lon: -1.1120 },
  { name: "Abura Dunkwa", region: "Central", lat: 5.1520, lon: -1.2530 },

  // Eastern Region
  { name: "Koforidua", region: "Eastern", lat: 6.0940, lon: -0.2570 },
  { name: "Nkawkaw", region: "Eastern", lat: 6.5520, lon: -0.7770 },
  { name: "Kibi", region: "Eastern", lat: 6.1640, lon: -0.5490 },
  { name: "Akim Oda", region: "Eastern", lat: 5.9270, lon: -0.9880 },
  { name: "Suhum", region: "Eastern", lat: 6.0390, lon: -0.4510 },
  { name: "Akwatia", region: "Eastern", lat: 6.0410, lon: -0.8060 },
  { name: "Kade", region: "Eastern", lat: 6.0870, lon: -0.8430 },
  { name: "Asamankese", region: "Eastern", lat: 5.8690, lon: -0.6620 },
  { name: "Mpraeso", region: "Eastern", lat: 6.5880, lon: -0.7350 },
  { name: "Begoro", region: "Eastern", lat: 6.3850, lon: -0.3770 },
  { name: "Kyebi", region: "Eastern", lat: 6.1640, lon: -0.5490 },
  { name: "Donkorkrom", region: "Eastern", lat: 6.6340, lon: -0.3420 },
  { name: "New Tafo", region: "Eastern", lat: 6.2280, lon: -0.3610 },

  // Volta Region
  { name: "Ho", region: "Volta", lat: 6.6000, lon: 0.4710 },
  { name: "Keta", region: "Volta", lat: 5.9170, lon: 0.9930 },
  { name: "Anloga", region: "Volta", lat: 5.7940, lon: 0.8970 },
  { name: "Aflao", region: "Volta", lat: 6.1190, lon: 1.1940 },
  { name: "Sogakope", region: "Volta", lat: 6.0060, lon: 0.5930 },
  { name: "Akatsi", region: "Volta", lat: 6.1320, lon: 0.8050 },
  { name: "Kpando", region: "Volta", lat: 6.9930, lon: 0.2960 },
  { name: "Hohoe", region: "Volta", lat: 7.1510, lon: 0.4740 },
  { name: "Peki", region: "Volta", lat: 6.7490, lon: 0.2340 },
  { name: "Denu", region: "Volta", lat: 6.0890, lon: 1.1380 },

  // Oti Region
  { name: "Dambai", region: "Oti", lat: 7.9670, lon: 0.1680 },
  { name: "Nkwanta", region: "Oti", lat: 7.5060, lon: 0.4990 },
  { name: "Kadjebi", region: "Oti", lat: 7.3730, lon: 0.4400 },
  { name: "Jasikan", region: "Oti", lat: 7.3960, lon: 0.4500 },
  { name: "Kete Krachi", region: "Oti", lat: 7.8080, lon: -0.0280 },

  // Bono Region
  { name: "Sunyani", region: "Bono", lat: 7.3389, lon: -2.3266 },
  { name: "Berekum", region: "Bono", lat: 7.4520, lon: -2.5860 },
  { name: "Dormaa Ahenkro", region: "Bono", lat: 7.3560, lon: -2.9630 },
  { name: "Techiman", region: "Bono", lat: 7.5840, lon: -1.9380 },
  { name: "Wenchi", region: "Bono", lat: 7.7410, lon: -2.1000 },
  { name: "Nkoranza", region: "Bono", lat: 7.5560, lon: -1.7090 },
  { name: "Atebubu", region: "Bono", lat: 7.7510, lon: -0.9860 },

  // Bono East Region
  { name: "Techiman", region: "Bono East", lat: 7.5840, lon: -1.9380 },
  { name: "Kintampo", region: "Bono East", lat: 8.0570, lon: -1.7300 },
  { name: "Nkoranza", region: "Bono East", lat: 7.5560, lon: -1.7090 },
  { name: "Yeji", region: "Bono East", lat: 8.2230, lon: -0.6670 },
  { name: "Atebubu", region: "Bono East", lat: 7.7510, lon: -0.9860 },
  { name: "Prang", region: "Bono East", lat: 7.9640, lon: -0.8870 },

  // Ahafo Region
  { name: "Goaso", region: "Ahafo", lat: 6.8030, lon: -2.5170 },
  { name: "Duayaw-Nkwanta", region: "Ahafo", lat: 6.9830, lon: -2.1040 },
  { name: "Bechem", region: "Ahafo", lat: 7.0880, lon: -2.0270 },
  { name: "Hwidiem", region: "Ahafo", lat: 6.8390, lon: -2.0070 },
  { name: "Kenyasi", region: "Ahafo", lat: 6.9460, lon: -2.3720 },

  // Northern Region
  { name: "Tamale", region: "Northern", lat: 9.4008, lon: -0.8393 },
  { name: "Yendi", region: "Northern", lat: 9.4440, lon: -0.0090 },
  { name: "Salaga", region: "Northern", lat: 8.5530, lon: -0.5210 },
  { name: "Damongo", region: "Northern", lat: 9.0800, lon: -1.8210 },
  { name: "Bimbilla", region: "Northern", lat: 8.8510, lon: -0.0490 },
  { name: "Tolon", region: "Northern", lat: 9.4140, lon: -1.0580 },
  { name: "Savelugu", region: "Northern", lat: 9.6240, lon: -0.8250 },
  { name: "Karaga", region: "Northern", lat: 9.9240, lon: -0.4430 },

  // Savannah Region
  { name: "Damongo", region: "Savannah", lat: 9.0800, lon: -1.8210 },
  { name: "Bole", region: "Savannah", lat: 9.0320, lon: -2.4840 },
  { name: "Sawla", region: "Savannah", lat: 9.2870, lon: -2.4200 },
  { name: "Salaga", region: "Savannah", lat: 8.5530, lon: -0.5210 },
  { name: "Buipe", region: "Savannah", lat: 8.8030, lon: -1.3570 },

  // North East Region
  { name: "Nalerigu", region: "North East", lat: 10.5240, lon: -0.3680 },
  { name: "Gambaga", region: "North East", lat: 10.5300, lon: -0.4410 },
  { name: "Walewale", region: "North East", lat: 10.3540, lon: -0.7960 },
  { name: "Chereponi", region: "North East", lat: 10.0710, lon: 0.2530 },

  // Upper East Region
  { name: "Bolgatanga", region: "Upper East", lat: 10.7856, lon: -0.8514 },
  { name: "Navrongo", region: "Upper East", lat: 10.8940, lon: -1.0910 },
  { name: "Bawku", region: "Upper East", lat: 11.0590, lon: -0.2420 },
  { name: "Zebilla", region: "Upper East", lat: 10.8860, lon: -0.4700 },
  { name: "Paga", region: "Upper East", lat: 10.9900, lon: -1.1050 },
  { name: "Tongo", region: "Upper East", lat: 10.6950, lon: -0.7790 },
  { name: "Zuarungu", region: "Upper East", lat: 10.7830, lon: -0.7670 },

  // Upper West Region
  { name: "Wa", region: "Upper West", lat: 10.0601, lon: -2.5099 },
  { name: "Tumu", region: "Upper West", lat: 10.8870, lon: -1.9800 },
  { name: "Jirapa", region: "Upper West", lat: 10.5960, lon: -2.5570 },
  { name: "Lawra", region: "Upper West", lat: 10.6290, lon: -2.9060 },
  { name: "Nandom", region: "Upper West", lat: 10.8500, lon: -2.7620 },
  { name: "Nadowli", region: "Upper West", lat: 10.3920, lon: -2.6590 },
  { name: "Lambussie", region: "Upper West", lat: 10.7550, lon: -2.6830 },
];
