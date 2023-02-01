import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional } from "class-validator"

export enum FilterTypesEnum {
  GreatherThan = "gt",
  GreatherThanEquals = "gte",
  LowerThan = "lt",
  LowerThanEquals = "lte",
  Like = "like",
  Equals = "eq",
  NotEquals = "neq",
  Between = "between",
  In = "in",
  NotIn = "notIn",
  IsNull = "is_null",
  IsNotNull = "is_not_null",
}

export enum FilterTypeValue {
  NUMBER = "number",
  STRING = "string",
  BOOLEAN = "bool",
  DATE = "date",
  DATETIME = "timestamp"
}

@InputType()
export class BetweenValue {
  @Field(() => String || Number || Date, { nullable: true })
  from?: string | number | Date
  @Field(() => String || Number || Date, { nullable: true })
  to?: string | number | Date
}

@InputType()
export class IFilterCriterion {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  type?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  property?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  typeValue?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  value?: string | number | boolean

  @Field(() => BetweenValue, { nullable: true })
  @IsOptional()
  bvalue?: BetweenValue
}

@InputType()
export class ISortCriteria {
  @Field()
  column: string
  @Field()
  order: string
}

@InputType()
export class IGlobalSearchCriteria {

  @Field(() => [String], { nullable: true })
  @IsNotEmpty()
  globalFilterFields: string[]

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  value?: string
}
