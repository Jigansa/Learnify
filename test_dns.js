const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.mongodatabasereview.b1g5w.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV resolve failed:', err);
  } else {
    console.log('SRV resolve success:', addresses);
  }
});
