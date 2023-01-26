import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import { MyLogger } from "../logger/logger.service";

import { JSDOM } from "jsdom";
import axios from "axios";
import { flattenDeep, omit } from "lodash";

const departementsList = {
  Alsace: [
    {
      name: "Bas Rhin",
      code: "67",
    },
    {
      name: "Haut Rhin",
      code: "68",
    },
  ],
  Aquitaine: [
    {
      name: "Dordogne",
      code: "24",
    },
    {
      name: "Gironde",
      code: "33",
    },
    {
      name: "Landes",
      code: "40",
    },
    {
      name: "Lot et Garonne",
      code: "47",
    },
    {
      name: "Pyrénées Atlantiques",
      code: "64",
    },
  ],
  Auvergne: [
    {
      name: "Allier",
      code: "03",
    },
    {
      name: "Cantal",
      code: "15",
    },
    {
      name: "Haute Loire",
      code: "43",
    },
    {
      name: "Puy de Dôme",
      code: "63",
    },
  ],
  "Basse-Normandie": [
    {
      name: "Calvados",
      code: "14",
    },
    {
      name: "Manche",
      code: "50",
    },
    {
      name: "Orne",
      code: "61",
    },
  ],
  Bourgogne: [
    {
      name: "Côte d'Or",
      code: "21",
    },
    {
      name: "Nièvre",
      code: "58",
    },
    {
      name: "Saône et Loire",
      code: "71",
    },
    {
      name: "Yonne",
      code: "89",
    },
  ],
  Bretagne: [
    {
      name: "Côtes d'Armor",
      code: "22",
    },
    {
      name: "Finistère",
      code: "29",
    },
    {
      name: "Ille et Vilaine",
      code: "35",
    },
    {
      name: "Morbihan",
      code: "56",
    },
  ],
  Centre: [
    {
      name: "Cher",
      code: "18",
    },
    {
      name: "Eure et Loir",
      code: "28",
    },
    {
      name: "Indre",
      code: "36",
    },
    {
      name: "Indre et Loire",
      code: "37",
    },
    {
      name: "Loir et Cher",
      code: "41",
    },
    {
      name: "Loiret",
      code: "45",
    },
  ],
  "Champagne-Ardenne": [
    {
      name: "Ardennes",
      code: "08",
    },
    {
      name: "Aube",
      code: "10",
    },
    {
      name: "Marne",
      code: "51",
    },
    {
      name: "Haute Marne",
      code: "52",
    },
  ],
  Corse: [
    {
      name: "Corse du Sud",
      code: "2A",
    },
    {
      name: "Haute Corse",
      code: "2B",
    },
  ],
  "Franche-Comté": [
    {
      name: "Doubs",
      code: "25",
    },
    {
      name: "Jura",
      code: "39",
    },
    {
      name: "Haute Saône",
      code: "70",
    },
    {
      name: "Territoire de Belfort",
      code: "90",
    },
  ],
  "Haute-Normandie": [
    {
      name: "Eure",
      code: "27",
    },
    {
      name: "Seine Maritime",
      code: "76",
    },
  ],
  "Ile-de-France": [
    {
      name: "Paris",
      code: "75",
    },
    {
      name: "Seine et Marne",
      code: "77",
    },
    {
      name: "Yvelines",
      code: "78",
    },
    {
      name: "Essonne",
      code: "91",
    },
    {
      name: "Hauts de Seine",
      code: "92",
    },
    {
      name: "Seine St Denis",
      code: "93",
    },
    {
      name: "Val de Marne",
      code: "94",
    },
    {
      name: "Val d'Oise",
      code: "95",
    },
  ],
  "Languedoc-Roussillon": [
    {
      name: "Aude",
      code: "11",
    },
    {
      name: "Gard",
      code: "30",
    },
    {
      name: "Hérault",
      code: "34",
    },
    {
      name: "Lozère",
      code: "48",
    },
    {
      name: "Pyrénées Orientales",
      code: "66",
    },
  ],
  Limousin: [
    {
      name: "Corrèze",
      code: "19",
    },
    {
      name: "Creuse",
      code: "23",
    },
    {
      name: "Haute Vienne",
      code: "87",
    },
  ],
  Lorraine: [
    {
      name: "Meurthe et Moselle",
      code: "54",
    },
    {
      name: "Meuse",
      code: "55",
    },
    {
      name: "Moselle",
      code: "57",
    },
    {
      name: "Vosges",
      code: "88",
    },
  ],
  "Midi-Pyrénées": [
    {
      name: "Ariège",
      code: "09",
    },
    {
      name: "Aveyron",
      code: "12",
    },
    {
      name: "Haute Garonne",
      code: "31",
    },
    {
      name: "Gers",
      code: "32",
    },
    {
      name: "Lot",
      code: "46",
    },
    {
      name: "Hautes Pyrénées",
      code: "65",
    },
    {
      name: "Tarn",
      code: "81",
    },
    {
      name: "Tarn et Garonne",
      code: "82",
    },
  ],
  "Nord-Pas-de-Calais": [
    {
      name: "Nord",
      code: "59",
    },
    {
      name: "Pas de Calais",
      code: "62",
    },
  ],
  "Pays de la Loire": [
    {
      name: "Loire Atlantique",
      code: "44",
    },
    {
      name: "Maine et Loire",
      code: "49",
    },
    {
      name: "Mayenne",
      code: "53",
    },
    {
      name: "Sarthe",
      code: "72",
    },
    {
      name: "Vendée",
      code: "85",
    },
  ],
  Picardie: [
    {
      name: "Aisne",
      code: "02",
    },
    {
      name: "Oise",
      code: "60",
    },
    {
      name: "Somme",
      code: "80",
    },
  ],
  "Poitou-Charentes": [
    {
      name: "Charente",
      code: "16",
    },
    {
      name: "Charente Maritime",
      code: "17",
    },
    {
      name: "Deux Sèvres",
      code: "79",
    },
    {
      name: "Vienne",
      code: "86",
    },
  ],
  "Provence-Alpes-Côte-d'Azur": [
    {
      name: "Alpes de Haute Provence",
      code: "04",
    },
    {
      name: "Hautes Alpes",
      code: "05",
    },
    {
      name: "Alpes Maritimes",
      code: "06",
    },
    {
      name: "Bouches du Rhône",
      code: "13",
    },
    {
      name: "Var",
      code: "83",
    },
    {
      name: "Vaucluse",
      code: "84",
    },
  ],
  "Rhône-Alpes": [
    {
      name: "Ain",
      code: "01",
    },
    {
      name: "Ardèche",
      code: "07",
    },
    {
      name: "Drôme",
      code: "26",
    },
    {
      name: "Isère",
      code: "38",
    },
    {
      name: "Loire",
      code: "42",
    },
    {
      name: "Rhône-Alpes",
      code: "69",
    },
    {
      name: "Savoie",
      code: "73",
    },
    {
      name: "Haute Savoie",
      code: "74",
    },
  ],
};

@Injectable()
export class CronService {
  constructor(private prisma: PrismaService, private logger: MyLogger) {}

  @Cron("35 18 * * *", { timeZone: "Europe/Paris" })
  async handleCron() {
    const couverts = await this.prisma.couvert.count();

    if (couverts) {
      return this.logger.log("Already done");
    }

    this.logger.log("Starting populating db");

    const getData = async () => {
      const { data } = await axios.get(
        "http://www.fiches.arvalis-infos.fr/liste_fiches.php?fiche=ci&type=pures",
      );

      const document = new JSDOM(data).window.document;

      const melangeLinks = Array.from(
        document.querySelectorAll("div.resultats table tbody tr td a"),
      ).map((a) => a.getAttribute("href"));

      const culturesData: any[] = [];

      for await (const link of melangeLinks) {
        if (!link) continue;
        this.logger.log(link);
        const { data: melangeData } = await axios.get(link);

        const document = new JSDOM(melangeData).window.document;

        const getDepartements = async () => {
          const codeList = flattenDeep(
            Object.values(departementsList).map((region) =>
              region.map(({ code }) => code),
            ),
          );

          const departementsData: any[] = [];

          for await (const code of codeList) {
            this.logger.log(code);
            const { data } = await axios.get(`${link}&dept=${code}`);

            const document = new JSDOM(data).window.document;

            departementsData.push({
              code: code.toString(),
              data: Array.from(
                Array.from(
                  document.querySelectorAll("tbody#BodyStades"),
                )[2]?.querySelectorAll("tr") ?? [],
              ).map((propertie) => {
                const tdEl = Array.from(propertie.querySelectorAll("td"));
                return {
                  [tdEl?.[0].textContent?.split(":")[0].trim() as string]: {
                    "Potentiel de production de biomasse":
                      tdEl?.[1].textContent?.trim(),
                    "Piège à nitrate": tdEl?.[2].textContent?.trim(),
                    "Economie d'azote pour la culture suivante":
                      tdEl?.[3].textContent?.trim(),
                    "Coût relatif du couvert": tdEl?.[4].textContent?.trim(),
                    "Maîtrise des adventices": tdEl?.[5].textContent?.trim(),
                    "Potentiel de stockage du carbone":
                      tdEl?.[6].textContent?.trim(),
                  },
                };
              }),
            });
          }
          return departementsData;
        };

        const departments = await getDepartements();

        culturesData.push({
          title: document.querySelector("div.firme h1")?.textContent,
          link,
          properties: Array.from(
            document
              .querySelector("table#tab_cache")
              ?.querySelectorAll("tbody tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[0].textContent?.split(":")[0].trim() as string]:
                tdEl?.[1].textContent?.trim(),
            };
          }),
          cultureAdaptation: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[0]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[0].textContent?.split(":")[0].trim() as string]: {
                note: tdEl?.[1].textContent?.trim(),
                comment: tdEl?.[2].textContent?.trim(),
              },
            };
          }),
          nextCultureAdaptation: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[1]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[0].textContent?.split(":")[0].trim() as string]: {
                note: tdEl?.[1].textContent?.trim(),
                comment: tdEl?.[2].textContent?.trim(),
              },
            };
          }),
          semiMode: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[3]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[0].textContent?.split(":")[0].trim() as string]: {
                note: tdEl?.[1].textContent?.trim(),
              },
            };
          }),
          departments,
          destructionMode: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[4]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[0].textContent?.split(":")[0].trim() as string]: {
                note: tdEl?.[1].textContent?.trim(),
              },
            };
          }),
          benefices: Array.from(
            Array.from(document.querySelectorAll("tbody"))[
              document.querySelectorAll("tbody").length - 1
            ]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[1].textContent?.split(":")[0].trim() as string]: {
                note: tdEl?.[2].textContent?.trim(),
              },
            };
          }),
          comment: Array.from(
            document.querySelectorAll('div[class="box-ligne"]'),
          )[
            document.querySelectorAll('div[class="box-ligne"]').length - 1
          ].textContent.trim(),
        });
      }

      const transactions = culturesData.map((couvert) =>
        this.prisma.couvert.create({
          data: {
            ...(omit(couvert, ["departments"]) as any),
            departments: {
              createMany: {
                data: couvert.departments.map((dep) => ({
                  semiTypes: dep.data,
                  code: dep.code,
                })),
              },
            },
          },
        }),
      );

      await this.prisma.$transaction(transactions);
    };

    await getData();
  }

  @Cron("16 1 * * *", { timeZone: "Europe/Paris" })
  async handleCron2() {
    const couverts = await this.prisma.couvertMelange.count();

    // if (couverts) {
    //   return this.logger.log("Already done");
    // }

    this.logger.log("Starting populating db");

    const getData = async () => {
      const { data } = await axios.get(
        "http://www.fiches.arvalis-infos.fr/liste_fiches.php?fiche=ci&type=melanges",
      );

      const document = new JSDOM(data).window.document;

      const melangeLinks = Array.from(
        document.querySelectorAll("div.resultats table tbody tr td a"),
      ).map((a) => a.getAttribute("href"));

      for await (const link of melangeLinks) {
        if (!link) continue;
        this.logger.log(link);
        const { data: melangeData } = await axios.get(link);

        const document = new JSDOM(melangeData).window.document;

        const getDepartements = async () => {
          const codeList = flattenDeep(
            Object.values(departementsList).map((region) =>
              region.map(({ code }) => code),
            ),
          );

          const departementsData: any[] = [];

          for await (const code of codeList) {
            this.logger.log(code);
            const { data } = await axios.get(`${link}&dept=${code}`);

            const document = new JSDOM(data).window.document;

            departementsData.push({
              code: code.toString(),
              data: Array.from(
                Array.from(
                  document.querySelectorAll("tbody#BodyStades"),
                )[3]?.querySelectorAll("tr") ?? [],
              ).map((propertie) => {
                const tdEl = Array.from(propertie.querySelectorAll("td"));
                return {
                  [tdEl?.[0]?.textContent?.split(":")[0]?.trim() as string]: {
                    "Potentiel de production de biomasse":
                      tdEl?.[1]?.textContent?.trim(),
                    "Piège à nitrate": tdEl?.[2]?.textContent?.trim(),
                    "Economie d'azote pour la culture suivante":
                      tdEl?.[3]?.textContent?.trim(),
                    "Coût relatif du couvert": tdEl?.[4]?.textContent?.trim(),
                    "Maîtrise des adventices": tdEl?.[5]?.textContent?.trim(),
                    "Potentiel de stockage du carbone":
                      tdEl?.[6]?.textContent?.trim(),
                  },
                };
              }),
            });
          }
          return departementsData;
        };

        const departments = await getDepartements();

        const data = {
          title: document.querySelector("div#firme h1")?.textContent,
          link,
          properties: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[0]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              "Composition du mélange": tdEl?.[0].textContent?.trim(),
              "Densité (kg/ha)": tdEl?.[1].textContent?.trim(),
              "PMG (g)": tdEl?.[2].textContent?.trim(),
              "Densité (grains/m²)": tdEl?.[3].textContent?.trim(),
              "Coût (Euros/ha)": tdEl?.[4].textContent?.trim(),
            };
          }),
          cultureAdaptation: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[1]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[0].textContent?.split(":")[0]?.trim() as string]: {
                note: tdEl?.[1].textContent?.trim(),
                comment: tdEl?.[2].textContent?.trim(),
              },
            };
          }),
          nextCultureAdaptation: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[2]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            console.log(tdEl);
            return {
              [tdEl?.[0].textContent?.split(":")[0]?.trim() as string]: {
                note: tdEl?.[1].textContent?.trim(),
                comment: tdEl?.[2].textContent?.trim(),
              },
            };
          }),
          semiMode: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[4]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[0].textContent?.split(":")[0]?.trim() as string]: {
                note: tdEl?.[1].textContent?.trim(),
              },
            };
          }),
          departments,
          destructionMode: Array.from(
            Array.from(
              document.querySelectorAll("tbody#BodyStades"),
            )[5]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[0].textContent?.split(":")[0]?.trim() as string]: {
                note: tdEl?.[1].textContent?.trim(),
              },
            };
          }),
          benefices: Array.from(
            Array.from(document.querySelectorAll("tbody"))[
              document.querySelectorAll("tbody").length - 1
            ]?.querySelectorAll("tr") ?? [],
          ).map((propertie) => {
            const tdEl = Array.from(propertie.querySelectorAll("td"));
            return {
              [tdEl?.[1].textContent?.split(":")[0]?.trim() as string]: {
                note: tdEl?.[2].textContent?.trim(),
              },
            };
          }),
          comment: Array.from(
            document.querySelectorAll('div[class="box-ligne"]'),
          )[
            document.querySelectorAll('div[class="box-ligne"]').length - 1
          ].textContent?.trim(),
        };

        try {
          await this.prisma.$transaction([
            this.prisma.couvertMelange.create({
              data: {
                ...(omit(data, ["departments"]) as any),
                departments: {
                  createMany: {
                    data: data.departments.map((dep) => ({
                      semiTypes: dep.data,
                      code: dep.code,
                    })),
                  },
                },
              },
            }),
          ]);
        } catch (error) {
          console.log(error);
        }
      }

      //   const transactions = culturesData.map((couvert) =>
      //     this.prisma.couvertMelange.create({
      //       data: {
      //         ...(omit(couvert, ["departments"]) as any),
      //         departments: {
      //           createMany: {
      //             data: couvert.departments.map((dep) => ({
      //               semiTypes: dep.data,
      //               code: dep.code,
      //             })),
      //           },
      //         },
      //       },
      //     }),
      //   );
      // };
    };

    await getData();
  }
}
