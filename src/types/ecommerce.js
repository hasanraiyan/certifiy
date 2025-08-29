// New e-commerce data models for the transactional pivot

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {Object} price
 * @property {number} price.amount
 * @property {'USD'} price.currency
 * @property {string} description
 * @property {'Exam' | 'Quiz' | 'DomainQuiz'} type
 * @property {string[]} questionIds
 * @property {'Active' | 'Draft' | 'Archived'} status
 * @property {boolean} [isFeatured]
 * @property {Date | null} publishedAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Bundle
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {Object} price
 * @property {number} price.amount
 * @property {'USD'} price.currency
 * @property {string} description
 * @property {string[]} productIds
 * @property {'Active' | 'Draft' | 'Archived'} status
 * @property {number} [discountPercentage]
 * @property {boolean} [isFeatured]
 * @property {Date | null} publishedAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Purchase
 * @property {string} id
 * @property {string} userId
 * @property {string} [productId]
 * @property {string} [bundleId]
 * @property {Date} purchaseDate
 * @property {Object} amount
 * @property {number} amount.amount
 * @property {'USD'} amount.currency
 * @property {'Completed' | 'Pending' | 'Failed'} status
 */

export {};