import { ParsedURL } from '../parsed_url'
import { TransformInterface } from '../url_tool'
export type AggregateTransformOperator = 'all' | 'first'

export class Aggregate implements TransformInterface {
  name: string = 'Aggregate Transform'
  description: string = 'Wraps multiple URL Transforms in a sequence; order matters'
  operator: AggregateTransformOperator = 'all'
  transforms: TransformInterface[] = []

  constructor(options: { [key: string]: any }) {
    if ('name' in options) this.name = options.name
    if ('description' in options) this.description = options.description
    if ('transforms' in options) this.transforms = options.transforms
    if ('operator' in options) this.operator = options.operator
  }

  transform(u: ParsedURL) : ParsedURL {
    let original = u.href
    this.transforms.forEach((p) => {
      u = p.transform(u)
      if (this.operator == 'first' && u.href != original) return u
    })
    return u
  }
}
