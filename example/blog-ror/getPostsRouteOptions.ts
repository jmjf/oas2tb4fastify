import { PaginationLimitSchema } from '../blog-tbr/parameters_PaginationLimit.ts';
import { PaginationPageSchema } from '../blog-tbr/parameters_PaginationPage.ts';
import { PostsResponseSchema } from '../blog-tbr/schemas_PostsResponse.ts';

export const getPostsRouteOptions = {
	url: '/posts',
	method: 'GET',
	operationId: 'getPosts',
	tags: ['Posts'],
	schema: {
		querystring: {
			type: 'object',
			properties: {
				page: PaginationPageSchema,
				limit: PaginationLimitSchema,
				tags: { type: 'array', items: { type: 'string' } },
			},
			required: ['page', 'tags'],
		},
		response: { '200': { content: { 'application/json': { schema: PostsResponseSchema } } }, '4xx': {} },
	},
};
