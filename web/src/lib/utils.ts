import { compact, join, uniq } from "lodash";

/**
 * Build a string to use in a <title> tag.
 *
 * @param {string} [subtitle] - caller defined part of the title
 * @returns {string} full string to use in <title>
 */
export function buildTitle(subtitle?: string): string {
  return subtitle ? `${subtitle} - Meals` : "Meals";
}

/**
 * Join className strings together
 *
 * @param {(string | undefined)[]} args - variadic list of classNames
 * @returns {string} classNames joined together
 */
export function joinClassNames(...args: (string | undefined)[]): string {
  return join(uniq(compact(args)), " ");
}
