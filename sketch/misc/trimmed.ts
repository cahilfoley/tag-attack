/**
 * Trims the whitespace from each line in a multiline string and from the string itself.
 *
 * @ignore
 */
function trimLines(string: string): string {
  return string
    .split(/\n|\r|\r\n/g)
    .map(line => line.trim())
    .join('\n')
    .trim()
}

/**
 * A tagged template literal function that trims the whitespace from each line in a multiline string
 * and from the string itself.
 *
 * ```ts
 * const foo = 'foo'
 *
 * const output = trimmed`
 * Hello ${foo}
 *   this text is aligned
 * `
 *
 * console.log(output)
 * // Expected output:
 * // Hello foo
 * // this text is aligned
 * ```
 */
function trimmed(stringParts: TemplateStringsArray, ...variables: any[]): string
/**
 * A function that trims the whitespace from each line in a multiline string and from the string itself.
 *
 * ```ts
 * const foo = 'foo'
 *
 * const output = trimmed(`
 *   Hello ${foo}
 *   this text is aligned
 * `)
 *
 * console.log(output)
 * // Expected output:
 * // Hello foo
 * // this text is aligned
 * ```
 */
function trimmed(string: string): string
function trimmed(
  stringParts: string | TemplateStringsArray,
  ...variables: any[]
): string {
  if (typeof stringParts === 'string') return trimLines(stringParts)

  // Insert the variables inbetween each string part
  const allParts: string[] = []
  for (const index in stringParts) {
    allParts.push(stringParts[index])
    allParts.push(variables[index])
  }

  return trimLines(allParts.join(''))
}
