import { FilterCriteriaInfo } from "../../interfaces/tables/criteria.table"
import { SelectQueryBuilder } from "typeorm"
import * as  moment from "moment-timezone"

import { BetweenValue, FilterTypesEnum, FilterTypeValue, IFilterCriterion } from "../../interfaces/tables/filter.table"

export const prepareQueryBuilder = <T>(queryBuilder: SelectQueryBuilder<T>, criteria: FilterCriteriaInfo, aliasQuery = 'c', additionalFilters: IFilterCriterion[] = []) => {

  const filters = [...criteria.filters, ...additionalFilters]

  for (const filter of filters) {

    switch (filter.type) {
      case FilterTypesEnum.Equals:
        queryBuilder
          .andWhere(`${aliasQuery}.${filter.property} = :value`, {
            value: parserCriteriaValue(filter.value, filter.typeValue)
          })
        break
      case FilterTypesEnum.NotEquals:
        queryBuilder
          .andWhere(`${aliasQuery}.${filter.property} <> :value`, {
            value: parserCriteriaValue(filter.value, filter.typeValue)
          })
        break
      case FilterTypesEnum.GreatherThan:
        queryBuilder
          .andWhere(`${aliasQuery}.${filter.property} > :value`, {
            value: parserCriteriaValue(filter.value, filter.typeValue)
          })
        break
      case FilterTypesEnum.GreatherThanEquals:
        queryBuilder
          .andWhere(`${aliasQuery}.${filter.property} >= :value`, {
            value: parserCriteriaValue(filter.value, filter.typeValue)
          })
        break
      case FilterTypesEnum.LowerThan:
        queryBuilder
          .andWhere(`${aliasQuery}.${filter.property} < :value`, {
            value: parserCriteriaValue(filter.value, filter.typeValue)
          })
        break
      case FilterTypesEnum.LowerThanEquals:
        queryBuilder
          .andWhere(`${aliasQuery}.${filter.property} <= :value`, {
            value: parserCriteriaValue(filter.value, filter.typeValue)
          })
        break
      case FilterTypesEnum.Like:
        queryBuilder.andWhere(`${aliasQuery}.${filter.property}::text ilike :${filter.property}`, {
          [filter.property]: `%${parserCriteriaValue(filter.value, filter.typeValue)}%`,
        })
        break
      case FilterTypesEnum.Between:
        const between = filter.bvalue as BetweenValue

        queryBuilder.andWhere(`${aliasQuery}.${filter.property}::date BETWEEN :from and :to`, {
          from: parserCriteriaValue(between.from, filter.typeValue),
          to: parserCriteriaValue(between.to, filter.typeValue),
        })
        break
    }
  }

  return queryBuilder
}

export const parserCriteriaValue = (value: any, type: string) => {

  const parserData = <{[key: string]: any}>{
    [FilterTypeValue.NUMBER]: +value,
    [FilterTypeValue.DATE]: moment(new Date(value), "YYYY-MM-DD"),
    [FilterTypeValue.DATETIME]: moment(new Date(value)),
    [FilterTypeValue.STRING]: value.toString(),
  }

  return parserData[type]
}

export const getInValue = (filterValue: any): string => {

  let values: string

  const parsedValues = JSON.parse(filterValue as string)
  parsedValues.forEach((el, i) => {
    values = (i == 0) ? `${el}` : `${values},${el}`
  })

  return values
}

