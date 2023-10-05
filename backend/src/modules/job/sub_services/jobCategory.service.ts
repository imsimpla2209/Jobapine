/* eslint-disable class-methods-use-this */
import { ApiError } from 'common/errors'
import httpStatus from 'http-status'
import CrudService from 'providers/crud/crud.service'
import { IJobCategory } from '../job.interfaces'
import { JobCategory } from '../job.model'

class CategoryService extends CrudService<IJobCategory, { name: string }, { name: string }> {
  constructor() {
    super(JobCategory)
  }

  public async createCatogory(categoryBody: { name: string }) {
    if (await JobCategory.isNameTaken(categoryBody.name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This skill already exists')
    }
  }
}

const categoryService = new CategoryService()

export default categoryService
