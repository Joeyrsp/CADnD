import grammar from "./grammar";
import { Parser, Grammar } from "nearley";

export const parse = (data: string) => new Parser(Grammar.fromCompiled(grammar)).feed(data).results;
