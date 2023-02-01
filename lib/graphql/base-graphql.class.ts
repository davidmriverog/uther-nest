import { Type } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"
import { GenericResult } from "../interfaces/others/generic-result.interface"
import { FilterCriteriaInfo } from "../interfaces/tables/criteria.table"
import { IFilterCriterion } from "../interfaces/tables/filter.table"

export function BaseResolver<T extends Type<unknown>>(classRef: T, dtoRef, pageListRef): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {

    constructor(private readonly baseService) {
      //
    }

    @Query(() => pageListRef, { name: `${classRef.name.toLocaleLowerCase()}ListPage` })
    async listPage(@Args("criteriaInfo", { type: () => FilterCriteriaInfo }) criteriaInfo: FilterCriteriaInfo) {
      return await this.baseService.listPage(criteriaInfo)
    }

    @Query(() => classRef, { name: `findOne${classRef.name}` })
    async findOne(@Args("id", { type: () => Int }) id: number) {
      return await this.baseService.findOne(id)
    }

    @Query(() => [classRef], { name: `findAll${classRef.name}` })
    async findAll(@Args("filters", { type: () => [IFilterCriterion] }) filters: IFilterCriterion[]): Promise<T[]> {
      return this.baseService.findAll({ filters: filters })
    }

    @Mutation(() => classRef, { name: `create${classRef.name}` })
    async create(@Args(`input${classRef.name}Dto`, { type: () => dtoRef }) inputDto): Promise<T> {
      return await this.baseService.create(inputDto)
    }

    @Mutation(() => classRef, { name: `update${classRef.name}` })
    async update(
      @Args("id", { type: () => Int }) id: number,
      @Args(`input${classRef.name}Dto`, { type: () => dtoRef }) inputDto
    ): Promise<T> {
      return await this.baseService.update(id, inputDto)
    }

    @Mutation(() => GenericResult, { name: `remove${classRef.name}` })
    async remove(
      @Args("id", { type: () => Int }) id: number
    ): Promise<GenericResult> {
      return await this.baseService.remove(id)
    }

    @Mutation(() => GenericResult, { name: `removes${classRef.name}` })
    async removes(
      @Args("ids", { type: () => [Int] }) ids: number
    ): Promise<GenericResult> {
      return await this.baseService.removes(ids)
    }
  }

  return BaseResolverHost;
}