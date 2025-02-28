import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbCommentId } from './schemasCommentId.js';

export const tbCommentIdParam = Type.Object({
	commentId: Clone({ ...tbCommentId, ...{ description: 'A unique identifier for a comment' } }),
});
export type TbCommentIdParam = Static<typeof tbCommentIdParam>;
