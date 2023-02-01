import { Field, ObjectType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"

@ObjectType()
export class GenericResult {

  @Field(() => Boolean)
  @ApiProperty({
    title: "ok",
    type: "boolean",
    description: "Response CODE Successful is true"
  })
  ok: boolean


  @Field(() => String, { nullable: true })
  error: string

  @Field(() => String, { nullable: true })
  id?: number
}
