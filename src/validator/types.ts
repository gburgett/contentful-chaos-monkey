import { IEntry } from 'contentful-management'

export interface IValidator {
  buildExpectations(entry: IEntry<any>): Promise<IExpectation[]>
}

export interface IExpectation {
  /**
   * Executes the expectation
   */
  validate(): Promise<IValidationResult>
}

export interface IValidationResult {
  readonly ok: boolean
  readonly error?: Error
}

export interface IExpectationMap {
  [id: string]: IExpectation[]
}
