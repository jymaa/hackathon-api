import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Couvert, prisma } from "@prisma/client";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { CouvertService } from "./couvert.service";
import { MelangeResultsInput } from "./couvert.dto";
import { MyLogger } from "../logger/logger.service";

const notationToNumber = {
  "--": 0,
  "-": 1,
  "+/-": 2,
  "+": 3,
  "++": 4,
};

const numberRules = {
  0: "Always win",
  1: "Always win",
  2: "Lose all",
  3: "Win 2",
  4: "Win 2,3",
};

const getWiningCulture = (
  couverts: [{ [a: string]: { note: string; comment?: string } }],
) => {};

@ApiTags("couverts")
@Controller("/couverts")
export class CouvertController {
  constructor(private couvertService: CouvertService) {}

  @Get("all")
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Couvert[]> {
    return this.couvertService.couverts({});
  }

  @Get("couverts")
  async couverts(): Promise<any[]> {
    const couverts = await this.couvertService.couverts({});
    return couverts.map((c) => ({ title: c.title, data: {} }));
  }

  @Post("getMelangeResults")
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: MelangeResultsInput })
  async getMelangeResults(
    @Body()
    melangeInput: {
      objectif: string;
      cropRotationIds: string[];
      nextCropId: string;
      date: string;
      semiMode: string;
      destructionMode: string;
    },
  ): Promise<any> {
    const cropRotationSlugs = melangeInput.cropRotationIds;
    // const cultures = await this.couvertService.findMany({
    //   where: {
    //     id: {
    //       in: melangeInput.cultureIds,
    //     },
    //   },
    //   include: {
    //     departments: {
    //       where: {
    //         code: melangeInput.departmentCode,
    //       },
    //     },
    //   },
    // });

    const couvertMelanges = await this.couvertService.findManyCouvertMelange({
      where: {},
    });

    const filteredCouvertMelanges = couvertMelanges.filter((cm) => {
      // console.log(Object.keys(cm.cultureAdaptation[0])[0]);
      const haveNextRotation = (cm.nextCultureAdaptation as any[]).some(
        (o) => Object.keys(o)[0] === melangeInput.nextCropId,
      );

      const haveRotation = melangeInput.cropRotationIds.every((id) => {
        return (cm.cultureAdaptation as any[]).some((o) => {
          // console.log(id, Object.keys(o)[0]);
          return Object.keys(o)[0] === id;
        });
      });

      return haveNextRotation && haveRotation;
    });

    const a = filteredCouvertMelanges.filter((cm) =>
      ["++"].some((n) => {
        const crop = (cm.nextCultureAdaptation as any[]).find(
          (o) => Object.keys(o)[0] === melangeInput.nextCropId,
        );

        return crop[melangeInput.nextCropId]?.note === n;
      }),
    );

    console.log(a.length);
    return a;

    [
      {
        "Bl?? assol?? et autres c??r??ales d???hiver": {
          note: "++",
          comment:
            "Effet potentiellement b??n??fique sur la c??r??ale suivante. Possibilit??s de destruction ou de r??gulation du couvert en agriculture conventionnelle.",
        },
      },
      {
        "Bl?? de bl??": {
          note: "++",
          comment:
            "Effet potentiellement des l??gumineuses (azote) et des crucif??res (r??duction possible du pi??tin ??chaudage bien que al??atoire en bl?? sur bl??).",
        },
      },
      {
        "Orge de printemps": {
          note: "+/-",
          comment:
            "Effet potentiellement b??n??fique d???une l??gumineuse p??renne sur la c??r??ale suivante si le couvert est d??truit avant (r??gulation difficile dans l???orge au printemps car comp??tition frontale des 2 esp??ces).",
        },
      },
      { Pois: { note: "--", comment: "" } },
      { Soja: { note: "--", comment: "" } },
      { "F??verole, lupin ou pois chiche": { note: "--", comment: "" } },
      { "L??gume d'industrie": { note: "--", comment: "" } },
      {
        Ma??s: {
          note: "+/-",
          comment:
            "Effet potentiellement b??n??fique de la l??gumineuse p??renne sur le ma??s suivant si le couvert est d??truit avant (r??gulation difficile dans le ma??s car comp??tition frontale des 2 esp??ces).",
        },
      },
      {
        Sorgho: {
          note: "+/-",
          comment:
            "Effet potentiellement b??n??fique de la l??gumineuse p??renne sur le sorgho suivant si le couvert est d??truit avant (r??gulation difficile dans le sorgho car comp??tition frontale des 2 esp??ces).",
        },
      },
      {
        Betterave: {
          note: "--",
          comment:
            "La betterave n???est pas suffisamment concurrentielle pour ??tre associ??e ?? couvert permanent. Une destruction pr??alable est n??cessaire. Elle peut ??tre tr??s difficile ?? g??rer pour un couvert p??renne en situation de travail du sol r??duit.",
        },
      },
      { "Pomme de terre": { note: "++", comment: "" } },
      { Tournesol: { note: "+/-", comment: "" } },
      { Lin: { note: "--", comment: "" } },
      { "Tabac (Virginie)": { note: "--", comment: "" } },
      { "Tabac (Burley)": { note: "--", comment: "" } },
      { Chanvre: { note: "+/-", comment: "" } },
      {
        "Colza associ?? au couvert": {
          note: "-",
          comment:
            "Int??r??t de la lentille associ??e au colza : fourniture d???azote au printemps, concurrence adventices. L???ajout d???un tr??fle blanc permettra de p??renniser le couvert entre le colza et le bl?? suivant.",
        },
      },
    ];

    const couvertMelange = await this.couvertService.findCouvertMelange({
      id: "73939d70-e39f-4ed1-9d46-085ce80091a7",
    });

    return {
      title: couvertMelange.title,
      properties: {
        density: [
          { crop: "Avoine rude", value: 16 },
          { crop: "Vesce du Bengale", value: 8 },
        ],
        price: [41, 55],
      },
    };
  }
}
