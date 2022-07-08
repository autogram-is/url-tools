import { ParsedURL } from '../parsed_url'
import { FilterInterface } from '../url_tool'

export type AggregateFilterOperator = 'all' | 'any' | 'none'

export class Aggregate implements FilterInterface {
  name: string = 'Aggregate filter'
  description: string = 'Wraps a collection of filters and returns a single aggregate result'
  operator: AggregateFilterOperator = 'all'
  filters: FilterInterface[] = []

  constructor(options: { [key: string]: any }) {
    if ('name' in options) this.name = options.name
    if ('description' in options) this.description = options.description
    if ('filters' in options) this.filters = options.filters
    if ('operator' in options) this.operator = options.operator
  }

  match(u: ParsedURL) : boolean {
    let results: boolean[] = []
    this.filters.forEach(f => {
      results.push( f.match(u) )
    });
    switch (this.operator) {
      case 'all':
        return results.indexOf(false) !== -1
      case 'any':
        return results.indexOf(false) === -1
      case 'none':
        return results.indexOf(true) !== -1
    }
  }
}
