/**
 * Utility type for defining Express route parameter types.
 * @template T - string literal or union of string literals representing names of the parameters.
 * @example
 * async fnName(req: Request<ReqParams<'id1' | 'id2'>>, res: Response): Promise<void> {
 *     // id1 and id2 are promised to exist and to be of type string.
 *     const id1 = parseInt(req.params.id1, 10);
 *     const id2 = parseInt(req.params.id2, 10);
 * }
 * @remarks
 * This utility is a resolution to the redefinition of the `ParamsDictionary` from `@types/express-serve-static-core`.
 * Ensures the type and existence of parameters at compile time, eliminating the need for type assertions.
 */
export type ReqParams<T extends string> = {
    [K in T]: string
}