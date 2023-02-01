import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { IBaseService } from "../../interfaces/orm/base-service.interface"
import { GenericResult } from "../../interfaces/others/generic-result.interface"
import { FilterCriteriaInfo, ListPageInfoResponse } from "../../interfaces/tables/criteria.table"
import { SelectQueryBuilder, QueryRunner, Repository, DataSource, FindOptionsWhere } from "typeorm"
import { paginateQueryBuilder } from "../builder/paginate-query-builder"
import { prepareQueryBuilder } from "../builder/query-builder"

import { Type } from "@nestjs/common"

export function BaseService<T extends Type<unknown>>(classRef: T): any {

  @Injectable()
  abstract class BaseServiceHost implements IBaseService {

    private readonly logger = new Logger(classRef.name)

    _dataSource: DataSource
    _engineRepo: Repository<T>

    constructor(
      dataSource: DataSource,
      engineRepo: Repository<T>
    ) {
      this._dataSource = dataSource
      this._engineRepo = engineRepo
    }


    selectQueryBuilder(alias?: string): SelectQueryBuilder<T> {
      return this._engineRepo.createQueryBuilder(alias)
    }

    async listPage(criteria: FilterCriteriaInfo): Promise<ListPageInfoResponse> {

      const selectQueryBuilder = this.selectQueryBuilder(`c`)

      const queryResultPaginate = await paginateQueryBuilder(selectQueryBuilder, criteria.page, criteria.limit)

      return <ListPageInfoResponse>{
        page: criteria.page,
        limit: criteria.limit,
        totalRecords: queryResultPaginate.totalRecords,
        totalPages: queryResultPaginate.totalPages,
        data: queryResultPaginate.items as T[]
      }
    }

    async findAll(criteria: FilterCriteriaInfo): Promise<T[]> {
      const queryBuilder = this.selectQueryBuilder(`c`)

      const processQueryBuilder = prepareQueryBuilder<T>(queryBuilder, criteria)

      return await processQueryBuilder
        .getMany()
    }

    async findOne(id: number): Promise<T> {
      return await this._engineRepo.findOneBy(<FindOptionsWhere<T>><unknown>{
        id: id
      })
    }

    async create(attrs, connect?: QueryRunner): Promise<T> {

      this.logger.log(`Staring Process Create ${classRef.name} at ${new Date()}`)

      const queryRunner = !connect ? this._dataSource.createQueryRunner() : connect

      if (!connect) {
        await queryRunner.connect()
        await queryRunner.startTransaction()
      }

      try {

        const payloadEntity = Object.assign(new classRef(), attrs) as T

        const result = await queryRunner.manager.save(payloadEntity)

        if (!connect) {
          await queryRunner.commitTransaction()
        }

        return result as T
      } catch (err) {
        this.logger.log(`Error Msg: ${err.message} at Create ${classRef.name} in ${new Date()}`)

        if (!connect) {
          await queryRunner.rollbackTransaction()
        }

      } finally {
        this.logger.log(`Finished Process Create ${classRef.name} at ${new Date()}`)

        if (!connect) {
          await queryRunner.release()
        }
      }
    }

    async update(id: number, attrs, connect?: QueryRunner): Promise<T> {
      const queryRunner = !connect ? this._dataSource.createQueryRunner() : connect

      this.logger.log(`Staring Process Update ${classRef.name} at ${new Date()}`)

      if (!connect) {
        await queryRunner.connect()
        await queryRunner.startTransaction()
      }

      try {

        const existingEntity = await this._engineRepo.preload(<T><unknown>{
          id: id
        }) as T

        if (!existingEntity) {
          throw new NotFoundException(`Entity #${id} not found`);
        }

        const payloadEntity: T = Object.assign({}, existingEntity, attrs)

        const result = await queryRunner.manager.save(payloadEntity)

        if (!connect) {
          await queryRunner.commitTransaction()
        }

        return result as T
      } catch (err) {
        this.logger.log(`Error Msg: ${err.message} at Update ${classRef.name} in ${new Date()}`)

        if (!connect) {
          await queryRunner.rollbackTransaction()
        }
      } finally {

        this.logger.log(`Finished Process Update ${classRef.name} at ${new Date()}`)

        if (!connect) {
          await queryRunner.release()
        }
      }
    }

    async remove(id: number, connect?: QueryRunner): Promise<GenericResult> {
      const queryRunner = !connect ? this._dataSource.createQueryRunner() : connect

      try {

        if (!connect) {
          await queryRunner.connect()
          await queryRunner.startTransaction()
        }

        const entity = await this.findOne(id)

        const payload = Object.assign(new classRef(), entity)

        await queryRunner.manager.softRemove(payload)

        if (!connect) {
          await queryRunner.commitTransaction()
        }

        return <GenericResult>{
          ok: true
        }
      } catch (error) {
        this.logger.log(`Error Msg: ${error.message} at Remove ${classRef.name} in ${new Date()}`)

        if (!connect) {
          await queryRunner.rollbackTransaction()
        }

        throw error
      } finally {

        this.logger.log(`Finished Process Remove ${classRef.name} at ${new Date()}`)

        if (!connect) {
          await queryRunner.release()
        }
      }
    }

    async removes(ids: number[], connect?: QueryRunner): Promise<GenericResult> {
      const queryRunner = !connect ? this._dataSource.createQueryRunner() : connect

      try {

        if (connect == null) {
          await queryRunner.connect()
          await queryRunner.startTransaction()
        }

        await this.selectQueryBuilder("c")
          .softDelete()
          .where("c.id in (:...ids)", { ids: ids })
          .execute()

        if (connect == null) {
          await queryRunner.commitTransaction()
        }

        return <GenericResult>{
          ok: true
        }
      } catch (error) {
        this.logger.log(`Error Msg: ${error.message} at Remove ${classRef.name} in ${new Date()}`)

        if (connect == null) {
          await queryRunner.rollbackTransaction()
        }

        throw error
      } finally {

        this.logger.log(`Finished Process Removes ${classRef.name} at ${new Date()}`)

        if (connect == null) {
          await queryRunner.release()
        }
      }
    }

  }

  return BaseServiceHost
}
