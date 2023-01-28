import { test } from "@jest/globals";

import { parse } from "./parser";

test("parse addition", () => {
    console.log(parse("5 + 3"));
})

