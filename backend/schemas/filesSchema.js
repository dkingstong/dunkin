import Joi from 'joi'

const ValueSchema = Joi.object({
  '_text': Joi.string()
})

const EmployeeSchema = Joi.object({
  DunkinId: ValueSchema,
  DunkinBranch: ValueSchema,
  FirstName: ValueSchema,
  LastName: ValueSchema,
  DOB: ValueSchema,
  PhoneNumber: ValueSchema,
})

const AddressSchema = Joi.object({
  Line1: ValueSchema,
  Line2: ValueSchema.optional(),
  City: ValueSchema,
  State: ValueSchema,
  Zip: ValueSchema
})

const PayorSchema = Joi.object({
  DunkinId: ValueSchema,
  ABARouting: ValueSchema,
  AccountNumber: ValueSchema,
  Name: ValueSchema,
  DBA: ValueSchema,
  EIN: ValueSchema,
  Address: AddressSchema
})

const PayeeSchema = Joi.object({
  PlaidId: ValueSchema,
  LoanAccountNumber: ValueSchema
})

const RowSchema = Joi.object({
  Employee: EmployeeSchema,
  Payor: PayorSchema,
  Payee: PayeeSchema,
  Amount: ValueSchema
})

export const PostFileSchema = Joi.object({
  '_declaration': Joi.object(),
  rows: Joi.object({
    row: Joi.array().items(RowSchema)
  })
})
