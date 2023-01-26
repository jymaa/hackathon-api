import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

import { CouvertService } from "./couvert.service";
import { CouvertController } from "./couvert.controller";

@Module({
  imports: [PrismaModule],
  controllers: [CouvertController],
  providers: [CouvertService, PrismaService],
  exports: [CourvertModule],
})
export class CourvertModule {}
