import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbComment } from './schemasComment.js';
import { tbGenericTs } from './schemasGenericTs.js';
import { tbPostId } from './schemasPostId.js';
import { tbPostStatus } from './schemasPostStatus.js';
import { tbPostTx } from './schemasPostTx.js';
import { tbTitleTx } from './schemasTitleTx.js';
import { tbUser } from './schemasUser.js';

export const tbPost = Type.Object({
	postId: Clone(tbPostId),
	titleTx: Clone({ ...tbTitleTx, ...{ default: 'hello' } }),
	postTx: Clone(tbPostTx),
	author: Type.Optional(Clone(tbUser)),
	comments: Type.Optional(Type.Array(Clone(tbComment))),
	statusCd: Type.Optional(Clone({ ...tbPostStatus, ...{ default: 'draft' } })),
	statusTs: Type.Optional(Clone(tbGenericTs)),
});
export type TbPost = Static<typeof tbPost>;
