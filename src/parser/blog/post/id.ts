import { parseAsString } from 'parse-dont-validate';

const parseAsId = (id: unknown) => parseAsString(id).orElseThrowDefault('id');

export default parseAsId;
