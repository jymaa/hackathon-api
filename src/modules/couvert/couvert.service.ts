import { Couvert, CouvertMelange, Prisma, User } from "@prisma/client";
import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CouvertService {
  constructor(private prisma: PrismaService) {}

  async findCouvert(
    couvertWhereUniqueInput: Prisma.CouvertWhereUniqueInput,
  ): Promise<Couvert | null> {
    return this.prisma.couvert.findUnique({
      where: couvertWhereUniqueInput,
    });
  }

  async findCouvertMelange(
    couvertWhereUniqueInput: Prisma.CouvertMelangeWhereUniqueInput,
  ): Promise<CouvertMelange | null> {
    return this.prisma.couvertMelange.findUnique({
      where: couvertWhereUniqueInput,
    });
  }

  async findManyCouvert(
    couvertFindManyInput: Prisma.CouvertFindManyArgs,
  ): Promise<Couvert[] | null> {
    return this.prisma.couvert.findMany(couvertFindManyInput);
  }

  async findManyCouvertMelange(
    couvertFindManyInput: Prisma.CouvertMelangeFindManyArgs,
  ): Promise<CouvertMelange[] | null> {
    return this.prisma.couvertMelange.findMany(couvertFindManyInput);
  }

  async couverts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CouvertWhereUniqueInput;
    where?: Prisma.CouvertWhereInput;
    orderBy?: Prisma.CouvertOrderByWithRelationInput;
  }): Promise<Couvert[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.couvert.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
