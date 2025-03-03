import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import { dedupeArray, toUpperFirstChar, type StdOptions } from './optionHelpers.ts';
import {
	isAllOfSchema,
	isAnyOfSchema,
	isArraySchema,
	isBoolean,
	isConstSchema,
	isEnumSchema,
	isNotSchema,
	isObjectSchema,
	isOneOfSchema,
	isOASDocument,
	isSchemaWithMultipleTypes,
	isUnknownSchema,
	type OASDocument,
	type OASHeaderObject,
	type OASParameterObject,
	type OASRequestBodyObject,
	type OASResponseObject,
	type OASSchemaObject,
} from './typesAndGuards.ts';
import {
	parseAllOf,
	parseAnyOf,
	parseArray,
	parseConst,
	parseEnum,
	parseNot,
	parseObject,
	parseOneOf,
	parseRefName,
	parseTypeName,
	parseUnknown,
	parseWithMultipleTypes,
} from './codeParsers.ts';

export type CodeGenOpts = StdOptions & { refImports?: string[] };

/*
 * SCHEMA GETTERS FOR COMMANDS
 */

function getSchemaFromContent(obj: OASRequestBodyObject | OASResponseObject) {
	return obj.content
		? (obj.content['application/json']?.schema ??
				obj.content['application/x-www-form-urlencoded']?.schema ??
				obj.content['application/xml']?.schema)
		: undefined;
}

const schemaGetters = {
	headers: (header: OASHeaderObject) => header.schema,
	parameters: (parameter: OASParameterObject) => parameter.schema,
	requestBodies: (requestBody: OASRequestBodyObject) => getSchemaFromContent(requestBody),
	responses: (response: OASResponseObject) => getSchemaFromContent(response),
	schemas: (schema: OASSchemaObject) => schema,
};

/*
 * MAIN GENERATORS
 */

/**
 * Type of a function that handles specifics of calling `schemaToTypeBox` to generate TypeBox code and writing output
 * @typedef {Function} GenToTypeBoxFn
 * @param {JSONSchema7} schema - schema being processed
 * @param {string} objNm - name of the object (subschema) being processed
 * @param {string} componentFieldNm - name of the component field being processed (schemas, responses, etc.)
 * @param {StdOptions} - destructured as { outPathTx, prefixTx, extTx }
 */
type GenTypeBoxFn = (schema: JSONSchema7, objNm: string, componentFieldNm: string, opts: StdOptions) => void;

/**
 * Generate TypeBox code for a list of ref paths
 * @param {string[]} pathNms - list of referenced paths for which to generate TypeBox
 * @param {'dereference' | 'parse'} refParserFnNm - name of the $RefParser function to use to read each refPath
 * @param {GenTypeBoxFn} genToTypeBox - a function that handles specifics of calling `schemaToTypeBox` and writing output
 * @param {StdOptions} stdOpts - standard options object
 * @async
 *
 */
export async function genTypeBoxForPaths(
	pathNms: string[],
	refParserFnNm: 'dereference' | 'parse',
	genToTypeBox: GenTypeBoxFn,
	stdOpts: StdOptions,
) {
	for (const refPathNm of pathNms) {
		const rpSchema = (await $RefParser[refParserFnNm](refPathNm, {
			dereference: { preservedProperties: stdOpts.preserveKeywords },
		})) as OASDocument;
		if (!isOASDocument(rpSchema)) continue;

		const componentsEntries = Object.entries(rpSchema.components ?? {});
		for (const [componentFieldNm, componentContents] of componentsEntries) {
			// Do we not know how to get the schema? (skip it)
			if (schemaGetters[componentFieldNm] === undefined) continue;

			const fieldEntries = Object.entries(componentContents);
			for (const [objNm, objValue] of fieldEntries) {
				const schema = schemaGetters[componentFieldNm](objValue);
				// Is there no schema? (skip it)
				if (schema === undefined) continue;

				genToTypeBox(schema, objNm, componentFieldNm, stdOpts);
			}
		}
	}
}

/**
 * Generate TypeBox code for a single schema, recursing through any sub-schemas
 * @param {string} schemaNm - name of the schema being processed
 * @param {JSONSchema7} schema - schema to process
 * @param {StdOptions} opts - options used in code generation
 */
export function genTypeBoxForSchema(schemaNm: string, schema: JSONSchema7, opts: CodeGenOpts) {
	const exportedNm = genExportedNm(opts, schemaNm);

	// Including id doesn't play nice with fastify for ref-maintaining
	// Ensuring that generated typebox code will contain an '$id' field.
	// see: https://github.com/xddq/schema2typebox/issues/32
	// if (typeof parsedSchema !== "boolean" && parsedSchema.$id === undefined) {
	// 	parsedSchema.$id = exportedName;
	// }
	const typeBoxTypeTx = recurseSchema(opts, schema);
	const exportedTypeTx = genExportedTypeForName(exportedNm);

	return `${typeBoxTypeTx.includes('OneOf([') ? genOneOfTypeboxSupportCode() : ''}\n\nexport const ${exportedNm} = ${typeBoxTypeTx}\n${exportedTypeTx}\n`;
}

export function genExportedTypeForName(exportedNm: string): string {
	if (exportedNm.length === 0) {
		throw new Error("Can't create exported type for a name with length 0.");
	}
	const typeNm = toUpperFirstChar(exportedNm);
	return `export type ${typeNm} = Static<typeof ${exportedNm}>`;
}

/*
 * IMPORTS
 */

const typeboxImports = [
	'import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry} from "@sinclair/typebox"',
	'import { Value } from "@sinclair/typebox/value";',
];
export function genDerefImportStatements(): string {
	return typeboxImports.join('\n');
}

// one schema/type per file means no multi-imports from a single file, so we can use strings
export function genRefImportStatements(refImports: string[]): string {
	return [...typeboxImports, ...dedupeArray<string>(refImports)].join('\n');
} /**
 * Takes the root schema and recursively collects the corresponding types
 * for it. Returns the matching typebox code representing the schema.
 * @param {StdOptions} opts
 * @param {JSONSchema7Definition} schema
 *
 * @returns {string} - generated code
 *
 * @throws Error if an unexpected schema (one with no matching parser) was given
 */
export function recurseSchema(opts: StdOptions, schema: JSONSchema7Definition): string {
	// TODO: boolean schema support..?
	if (isBoolean(schema)) {
		return JSON.stringify(schema);
	}
	if (isObjectSchema(schema)) {
		return parseObject(opts, schema);
	}
	if (isEnumSchema(schema)) {
		return parseEnum(opts, schema);
	}
	if (isAnyOfSchema(schema)) {
		return parseAnyOf(opts, schema);
	}
	if (isAllOfSchema(schema)) {
		return parseAllOf(opts, schema);
	}
	if (isOneOfSchema(schema)) {
		return parseOneOf(opts, schema);
	}
	if (isNotSchema(schema)) {
		return parseNot(opts, schema);
	}
	if (isArraySchema(schema)) {
		return parseArray(opts, schema);
	}
	if (isSchemaWithMultipleTypes(schema)) {
		return parseWithMultipleTypes(opts, schema);
	}
	if (isConstSchema(schema)) {
		return parseConst(opts, schema);
	}
	// unknown is an object schema with no keys
	if (isUnknownSchema(schema)) {
		return parseUnknown(schema);
	}
	if (schema.$ref !== undefined) {
		return parseRefName(opts, schema);
	}
	if (schema.type !== undefined && !Array.isArray(schema.type)) {
		return parseTypeName(opts, schema.type, schema);
	}
	throw new Error(`Unsupported schema. Did not match any type of the parsers. Schema was: ${JSON.stringify(schema)}`);
}

/*
 * UTILITIES
 */

export function genExportedNm({ prefixTx }: StdOptions, schemaNm: string): string {
	return `${prefixTx}${toUpperFirstChar(sanitizeName(schemaNm))}`;
}

/**
 * Creates custom typebox code to support the JSON schema keyword 'oneOf'. Based
 * on the suggestion here: https://github.com/xddq/schema2typebox/issues/16#issuecomment-1603731886
 */
export function genOneOfTypeboxSupportCode(): string {
	return [
		"TypeRegistry.Set('ExtendedOneOf', (schema: any, value) => 1 === schema.oneOf.reduce((acc: number, schema: any) => acc + (Value.Check(schema, value) ? 1 : 0), 0))",
		"const OneOf = <T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) => Type.Unsafe<Static<TUnion<T>>>({ ...options, [Kind]: 'ExtendedOneOf', oneOf })",
	].reduce((acc, curr) => {
		return `${acc + curr}\n\n`;
	}, '');
}

const invalidCharsRegExp = /[^\p{L}\p{Nd}\p{Nl}_$]/giu;
const invalidFirstCharRegExp = /^[^\p{L}_$]/iu;
function sanitizeName(s: string): string {
	if (typeof s !== 'string') throw new Error(`sanitizeIdentifierNames ERROR: received non-string; ${s}`);

	return s.replace(invalidCharsRegExp, '_').replace(invalidFirstCharRegExp, '_');
}
