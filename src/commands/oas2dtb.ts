import { writeFileSync } from 'node:fs';
import type { JSONSchema7 } from 'json-schema';
import type { CombinedOptions } from '../cli.ts';
import { genTypeBoxForRefs, genDerefImportStatements, genTypeBoxForSchema } from '../lib/codeGenerators.ts';
import { getRefPathNms, preprocOptions, type StdOptions } from '../lib/optionHelpers.ts';

export async function oas2dtb(opts: CombinedOptions) {
	const stdOpts = preprocOptions(opts);
	const refPathNms = await getRefPathNms(stdOpts.fileNms);
	genTypeBoxForRefs(refPathNms, 'dereference', genToDTB, stdOpts);
}

function genToDTB(
	schema: JSONSchema7,
	objNm: string,
	componentFieldNm: string,
	{ minKeysFl, outPathTx, prefixTx }: StdOptions,
) {
	const tb = genTypeBoxForSchema(objNm, schema, { minKeysFl, prefixTx, extTx: 'NotUsed' });
	writeFileSync(`${outPathTx}/${componentFieldNm}${objNm}.ts`, `${genDerefImportStatements()}\n\n${tb}`);
}
