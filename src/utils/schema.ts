import Joi from 'joi'

export const collectionSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Collection name is required',
  }),
})
