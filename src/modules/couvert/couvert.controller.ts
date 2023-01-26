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
        "Blé assolé et autres céréales d’hiver": {
          note: "++",
          comment:
            "Effet potentiellement bénéfique sur la céréale suivante. Possibilités de destruction ou de régulation du couvert en agriculture conventionnelle.",
        },
      },
      {
        "Blé de blé": {
          note: "++",
          comment:
            "Effet potentiellement des légumineuses (azote) et des crucifères (réduction possible du piétin échaudage bien que aléatoire en blé sur blé).",
        },
      },
      {
        "Orge de printemps": {
          note: "+/-",
          comment:
            "Effet potentiellement bénéfique d’une légumineuse pérenne sur la céréale suivante si le couvert est détruit avant (régulation difficile dans l’orge au printemps car compétition frontale des 2 espèces).",
        },
      },
      { Pois: { note: "--", comment: "" } },
      { Soja: { note: "--", comment: "" } },
      { "Féverole, lupin ou pois chiche": { note: "--", comment: "" } },
      { "Légume d'industrie": { note: "--", comment: "" } },
      {
        Maïs: {
          note: "+/-",
          comment:
            "Effet potentiellement bénéfique de la légumineuse pérenne sur le maïs suivant si le couvert est détruit avant (régulation difficile dans le maïs car compétition frontale des 2 espèces).",
        },
      },
      {
        Sorgho: {
          note: "+/-",
          comment:
            "Effet potentiellement bénéfique de la légumineuse pérenne sur le sorgho suivant si le couvert est détruit avant (régulation difficile dans le sorgho car compétition frontale des 2 espèces).",
        },
      },
      {
        Betterave: {
          note: "--",
          comment:
            "La betterave n’est pas suffisamment concurrentielle pour être associée à couvert permanent. Une destruction préalable est nécessaire. Elle peut être très difficile à gérer pour un couvert pérenne en situation de travail du sol réduit.",
        },
      },
      { "Pomme de terre": { note: "++", comment: "" } },
      { Tournesol: { note: "+/-", comment: "" } },
      { Lin: { note: "--", comment: "" } },
      { "Tabac (Virginie)": { note: "--", comment: "" } },
      { "Tabac (Burley)": { note: "--", comment: "" } },
      { Chanvre: { note: "+/-", comment: "" } },
      {
        "Colza associé au couvert": {
          note: "-",
          comment:
            "Intérêt de la lentille associée au colza : fourniture d’azote au printemps, concurrence adventices. L’ajout d’un trèfle blanc permettra de pérenniser le couvert entre le colza et le blé suivant.",
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
