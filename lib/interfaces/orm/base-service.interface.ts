import { QueryRunner, SelectQueryBuilder } from "typeorm"
import { GenericResult } from "../others/generic-result.interface"
import { FilterCriteriaInfo, ListPageInfoResponse } from "../tables/criteria.table"

/**
 * Class IBaseService
 *
 * @author David Rivero <davidmriverog@mail.com>
 */
export interface IBaseService {

  /**
   * List Data Paginate Entity<I>.
   *
   * @param criteria
   * @returns ListPageInfoResponse
   */
   listPage(criteria: FilterCriteriaInfo): Promise<ListPageInfoResponse>

  /**
   * Select Query Builder a Entity<I>.
   *
   * @param alias
   */
  selectQueryBuilder(alias?: string): SelectQueryBuilder<any>

  /**
   * Select Query Builder a Entity<I>.
   *
   * @param criteria
   */
  findAll(criteria: FilterCriteriaInfo): Promise<any[]>

  /**
   * Select Query Builder a Entity<I>.
   *
   * @param id
   */
  findOne(id: number): Promise<any>

  /**
   * Create a new Entity<I>
   *
   * @param attrs
   * @param connect
   */
  create(attrs: any, connect?: QueryRunner): Promise<any>

  /**
   * Update a Entity<I>
   *
   * @param id
   * @param attrs
   * @param connect
   */
  update(id: number, attrs: any, connect?: QueryRunner): Promise<any>

  /**
   * Remove a Entity<I>
   *
   * @param id
   * @param connect
   */
  remove(id: number, connect?: QueryRunner): Promise<GenericResult>

  /**
   * Remove a Entity<I>
   *
   * @param ids
   * @param connect
   */
  removes(ids: number[], connect?: QueryRunner): Promise<GenericResult>
}