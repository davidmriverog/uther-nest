import { SelectQueryBuilder } from "typeorm"
import { IPaginateMetaResponse } from "../../interfaces/orm/paginate-response.interface"

export async function paginateQueryBuilder(queryBuilder: SelectQueryBuilder<unknown>, pag: number, limit: number) {

  const take = limit || 10
  const page = pag || 1
  const skip = (page - 1) * take

  const countQueryClone = queryBuilder.clone()

  const countResults = await countQueryClone.select("count(*) as total")
    .getRawOne()

  const results = await queryBuilder
    .take(take)
    .skip(skip)
    .getMany()

  return <IPaginateMetaResponse>{
    totalRecords: +countResults.total,
    totalPages: Math.ceil(+countResults.total / limit),
    items: results
  }
}

export async function paginateRawQueryBuilder(queryBuilder: SelectQueryBuilder<unknown>, pag: number, limit: number) {

  const take = limit || 10
  const page = pag || 1
  const skip = (page - 1) * take

  const countQueryClone = queryBuilder.clone()

  const countResults = await countQueryClone.select("count(*) as total")
    .getRawOne()

  const results = await queryBuilder
    .take(take)
    .skip(skip)
    .getRawMany()

  return <IPaginateMetaResponse>{
    totalRecords: Number(countResults.total),
    totalPages: Math.ceil(Number(countResults.total) / limit),
    items: results
  }
}