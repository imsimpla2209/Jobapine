/* eslint-disable class-methods-use-this */
class QueryGen {
  public numRanges(from?: number, to?: number) {
    let range = {}
    if (from >= 0) {
      range['$gte'] = from || 0
    }
    if (to >= 0) {
      range['$lte'] = to || 100000000000
    }
    return range
  }
}

const instance = new QueryGen()
export default instance
