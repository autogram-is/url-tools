import { ParsedURL } from '../parsed_url'
import { TransformInterface, FilterInterface } from '../url_tool'

export class Conditional implements TransformInterface {
  name: string = 'Conditional Transform'
  description: string = 'Wraps a URL Transform in a URL filter; matching URLs are transformed.'
  filter: FilterInterface
  Transform: TransformInterface

  constructor(options: { [key: string]: any }) {
    if ('name' in options) this.name = options.name
    if ('description' in options) this.description = options.description
    this.filter = options.filter
    this.Transform = options.Transform
  }

  transform(u: ParsedURL) : ParsedURL {
    if (this.filter.match(u)) return this.Transform.transform(u)
    else return u
  }
}
