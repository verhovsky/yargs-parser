/**
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */

import { parseAnsiCQuotedString } from './string-utils.js'

const ANSI_REGEX = /\$('.*')/s
export function escapeAnsiCQuotes (stringArr: string[]): string[] {
  return (stringArr || []).map(str => {
    const match = (str || '').match(ANSI_REGEX)
    if (match && match.length > 1) {
      const matchGroup = match[1]
      return str.replace(ANSI_REGEX, parseAnsiCQuotedString(matchGroup))
    }
    return str
  })
}

// take an un-split argv string and tokenize it.
export function tokenizeArgString (argString: string | any[]): string[] {
  if (Array.isArray(argString)) {
    return escapeAnsiCQuotes(argString.map(e => typeof e !== 'string' ? e + '' : e))
  }

  argString = argString.trim()

  let i = 0
  let prevC: string | null = null
  let c: string | null = null
  let opening: string | null = null
  const args: string[] = []

  for (let ii = 0; ii < argString.length; ii++) {
    prevC = c
    c = argString.charAt(ii)

    // split on spaces unless we're in quotes.
    if (c === ' ' && !opening) {
      if (!(prevC === ' ')) {
        i++
      }
      continue
    }

    // don't split the string if we're in matching
    // opening or closing single and double quotes.
    if (c === opening) {
      opening = null
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c
    }

    if (!args[i]) args[i] = ''
    args[i] += c
  }

  return escapeAnsiCQuotes(args)
}
