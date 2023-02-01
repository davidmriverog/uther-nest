import { ObjectType } from "@nestjs/graphql"
import { BaseEntity } from "typeorm"

@ObjectType({
  isAbstract: true,
})
export class BaseModel extends BaseEntity {}