import { Field, InputType } from "@nestjs/graphql"
import { IsOptional } from "class-validator"

@InputType()
export class RangeDatePayload {
  @Field(() => String, { nullable: true })
  @IsOptional()
  from: Date

  @Field(() => String, { nullable: true })
  @IsOptional()
  to: Date
}