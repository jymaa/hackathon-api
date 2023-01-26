import { User } from "@prisma/client";
import {
  IsArray,
  isArray,
  IsEmail,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MelangeResultsInput {
  @IsString()
  @ApiProperty()
  objectif: string;

  @IsArray()
  @ApiProperty()
  cropRotationIds: string[];

  @IsString()
  @ApiProperty()
  nextCropId: string;

  @IsString()
  @ApiProperty()
  date: string;

  @IsString()
  @ApiProperty()
  semiMode: string;

  @IsString()
  @ApiProperty()
  destructionMode: string;
}
