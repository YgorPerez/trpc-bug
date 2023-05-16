import { uneval } from "devalue";
import superjson from "superjson";

const transformer = {
  input: superjson,
  output: {
    serialize: (object: any) => uneval(object), // eslint-disable-line
    // This `eval` only ever happens on the **client**
    deserialize: (object: any) => eval(`(${object})`), // eslint-disable-line
  },
};

export default transformer;
