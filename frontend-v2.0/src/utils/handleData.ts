import MiniSearch from 'minisearch'
import { stopWords } from 'src/api/constants'
import PouchDB from 'pouchdb'


export const handleFilter = (sortType: any, key?: any) => {
  let temp = sortType

  switch (temp) {
    case 'new':
      return 'tab=new'
    case 'hot':
      return 'tab=hot'
    case 'best':
      return 'tab=best'
    case 'oldest':
      return 'tab=oldest'
    case 'worst':
      return 'tab=worst'
    case 'keyword':
      return `keyword=${key.replace(' ', '-')}`
    default:
      break
  }
}

const miniSearch = new MiniSearch({
  fields: ['title', 'description'],
  idField: '_id',
  storeFields: ['client', 'categories', 'title', 'description', 'locations', 'complexity', 'payment', 'budget', 'createdAt', 'nOProposals', 'nOEmployee', 'preferences'],
  processTerm: (term) =>
  stopWords.has(term) ? null : term.toLowerCase(),
  searchOptions: {
    boost: { title: 2 },
    fuzzy: 0.3,
    processTerm: (term) => term.toLowerCase()
  },
})

const db = new PouchDB('data');

const handleCacheData = (data: any) => {
  db.bulkDocs(data).then(function (response) {
    console.log('cache okay vcl')
  }).catch(function (err) {
    console.log('cache failed', err);
  });
}

const handleGetCacheData = async () => {
  return await db.allDocs({ include_docs: true })
}



export { miniSearch, handleCacheData, db, handleGetCacheData }