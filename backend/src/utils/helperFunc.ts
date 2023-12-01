import { union } from 'lodash'
import keywordExtractor from 'keyword-extractor'

/* eslint-disable import/prefer-default-export */
export function createFuzzyRegex(searchString: string | string[]) {
  let words
  if (typeof searchString === 'string') {
    words = searchString.split(',').map(word => word.trim().toLowerCase())
  } else {
    words = searchString.map(word => word.trim().toLowerCase())
  }

  const regexParts = words.map(word => {
    const wordChars = word
      .split('')
      .map(char => `${char}.*`)
      .join('')
    return `(${wordChars})`
  })

  const regex = new RegExp(regexParts.join('\\b|\\b'), 'gi')
  return regex
}

export function extractKeywords(keyword: string) {
  const vnKeyWords = keywordExtractor.extract(`${keyword}`, {
    language: 'vi',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  })

  const keyWords = keywordExtractor.extract(`${keyword}`, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  })
  const words = union(vnKeyWords, keyWords)
  return words
}
