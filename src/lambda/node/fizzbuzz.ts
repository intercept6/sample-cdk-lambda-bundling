import { range } from '../../utils/range'
import { Callback, Context } from 'aws-lambda'

type FizzBuzzEvent = {
  upperLimit: number
}

const fizzBuzz = (upperLimit: number): string[] =>
  range(1, upperLimit).map((value) => {
    if (value % 15 === 0) {
      return 'fizzbuzz'
    } else if (value % 5 === 0) {
      return 'buzz'
    } else if (value % 3 === 0) {
      return 'fizz'
    } else {
      return `${value}`
    }
  })

export const handler = (
  event: FizzBuzzEvent,
  _context: Context,
  callback: Callback
): void => {
  const answer = fizzBuzz(event.upperLimit)
  callback(null, JSON.stringify(answer))
}
