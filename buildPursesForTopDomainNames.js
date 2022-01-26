function run(rawContent, tldContent) {
  const lines = rawContent.split(/\r?\n/);
  
  const NAMES_TO_PERFORM = 30000;
  const ADDRESS = '';
  const ALSO_RESERVE_GENERIC_CODES = true;
  
  const validDomains = {};
  const duplicates = {};
  const invalids = {};

  console.log(lines.length, 'domain names in top-1m.csv file');
  let j = 0;
  for (let i = 0; i < lines.length; i ++) {
    const domainName = lines[i].split(',')[1];

    if (j === NAMES_TO_PERFORM) {
      console.log(
        'reached ' + NAMES_TO_PERFORM + ' names at index ' + i + ' in csv file'
      );
      break;
    }

    const name = (domainName.split('.')[domainName.split('.').length - 2] || '').replace('-', '');
    if (!/^[A-Za-z0-9\-]+$/.test(name)) {
      invalids[name] = 'regexp';
    } else if (!name || name.length > 24 || name.length === 0) {
      invalids[name] = 'length';
    } else if (validDomains[name]) {
      if (!duplicates[name]) {
        duplicates[name] = [domainName];
      } else {
        duplicates[name].push(domainName);
      }
    } else {
      validDomains[name] = true;
      j += 1;
    }
  }
  
  const data = Buffer.from(
    JSON.stringify({
      address: ADDRESS,
      servers: [],
      badges: {},
    })
  ).toString('hex');
  
  if (ALSO_RESERVE_GENERIC_CODES) {
    const tlds2 = tldContent; 
    tlds2.split('\n').forEach((tld) => {
      const name = tld.toLowerCase();
      if (/^[A-Za-z0-9\-]+$/.test(name)) {
        const sanitizedName = name.replace('-', '')
        if (validDomains[sanitizedName]) {
          console.warn('generic tld ' + name + ' is duplicate');
          if (!duplicates[sanitizedName]) {
            duplicates[sanitizedName] = [name];
          } else {
            duplicates[sanitizedName].push(name);
          }
        } else {
          validDomains[sanitizedName] = true;
        }
      } else {
        console.warn('generic tld ' + name + ' is invalid');
        invalids[name] = 'regexp';
      }
    });
  }
  
  return {
    validDomains: Object.fromEntries(
      Object.keys(validDomains).map(id => 
        [id, {id, data, quantity: 1 }]
      )
    ),
    invalids,
    duplicates
  }
}

module.exports = {
  run
};