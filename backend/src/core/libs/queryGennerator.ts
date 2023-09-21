/* eslint-disable class-methods-use-this */
class QueryGen {
  public numRanges(from?: number, to?: number) {
    return { $gte: from || 0, $lte: to || 100000000000 }
  }
}

const instance = new QueryGen()
export default instance
