import { isBlank, isEmpty } from 'granula-string';
import { PostCommonProps } from '../type/post';

const isInputNotEmptyOrBlank = (input: string) =>
    !(isBlank(input) || isEmpty(input));

const isAllTextValid = <T extends PostCommonProps>({
    content,
    description,
    title,
}: T) =>
    isInputNotEmptyOrBlank(content) &&
    isInputNotEmptyOrBlank(description) &&
    isInputNotEmptyOrBlank(title);

export { isInputNotEmptyOrBlank, isAllTextValid };
