import { Clone, type Static, Type } from '@sinclair/typebox';
import { CommentIdSchema } from './schemas_CommentId.ts';
import { CommentTxSchema } from './schemas_CommentTx.ts';
import { UserSchema } from './schemas_User.ts';

export const CommentSchema = Type.Object({
	commentId: Clone(CommentIdSchema),
	commentTx: Clone(CommentTxSchema),
	commenter: Clone(UserSchema),
});
export type Comment = Static<typeof CommentSchema>;
