import { Field, Float, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional } from "class-validator"

@InputType()
export class AddressPayload {
  @Field(() => String, { nullable: true })
  @IsOptional()
  street: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  country: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  postalCode: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  state: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  city: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  fullAddress: string

  @Field(() => Float, { nullable: true })
  @IsNotEmpty()
  latitude: number

  @Field(() => Float, { nullable: true })
  @IsNotEmpty()
  longitude: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  code: string
}