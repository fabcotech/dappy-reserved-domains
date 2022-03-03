const fs = require('fs');
const { run } = require('./buildPursesForTopDomainNames');

const csvContent = fs.readFileSync('./top-1m.csv', 'utf8');
const tldContent = fs.readFileSync('./tlds.txt', 'utf8');
const brandsContent = fs.readFileSync('./brands.csv', 'utf8');

const { duplicates, invalids, validDomains } = run(csvContent, tldContent, brandsContent);

fs.writeFileSync('./name-duplicates.json', JSON.stringify(duplicates, null, 2));

if (Object.keys(invalids).length) {
    fs.writeFileSync('./name-invalids.json', JSON.stringify(invalids, null, 2));
}

fs.writeFileSync('./name-purses.csv', Object.keys(validDomains).join(`;\n`), 'utf8');
fs.writeFileSync('./name-purses.json', JSON.stringify(validDomains, null, 2), 'utf8');
fs.writeFileSync('./reserved-domains.json', JSON.stringify(
    Object.fromEntries(
      Object.entries(validDomains).map(([id]) => [id, true])
    )
,null, 2), 'utf-8');

console.log(
  `\nPrepared a total of ${Object.keys(validDomains).length} purses in name-purses.json`
);
console.log(
  `${
    Object.keys(invalids).length
  } invalid names (regexp or length) see name-invalids.json`
);
console.log(
  `${Object.keys(duplicates).length} duplicates names see name-duplicates.json`
);