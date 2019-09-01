const {
  checkServerStatus,
  fetchBannerContent,
  fetchAllOwners,
  fetchCatPics,
  fetchCatsByOwner,
  fetchAllCats,
  fetchOwnersWithCats,
  kickLegacyServerUntilItWorks,
  buySingleOutfit
} = require('../challenges/1-cat-server');
const { expect } = require('chai');

describe('checkServerStatus', () => {
  it('invokes the callback with no error', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    checkServerStatus(testCB);
  });
  it('invokes the callback with the correct server status', done => {
    const testCB = (err, status) => {
      expect(status).to.equal('200 - the server is good');
      done();
    };
    checkServerStatus(testCB);
  });
});

describe('fetchBannerContent', () => {
  it('invokes the callback with no error', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    fetchBannerContent(testCB);
  });
  it('invokes the callback with a banner content object', done => {
    const testCB = (err, content) => {
      expect(content).to.have.all.keys(['title', 'bannerImg', 'copyrightYear']);
      done();
    };
    fetchBannerContent(testCB);
  });
  it('invokes the callback with the updated banner content object', done => {
    const testCB = (err, content) => {
      expect(content).to.eql({
        title: 'Kitty Litter',
        bannerImg:
          'https://riotfest.org/wp-content/uploads/2017/10/AcT9YIL.jpg',
        copyrightYear: 2019
      });
      done();
    };
    fetchBannerContent(testCB);
  });
});

describe('fetchAllOwners', () => {
  it('invokes the callback with no error', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    fetchAllOwners(testCB);
  });
  it('invokes the callback with an array of the correct length', done => {
    const testCB = (err, owners) => {
      expect(owners).to.be.an('array');
      expect(owners.length).to.equal(5);
      done();
    };
    fetchAllOwners(testCB);
  });
  it('invokes the callback with an array of lowercase owner names', done => {
    const testCB = (err, owners) => {
      expect(owners).to.eql([
        'pavlov',
        'schrodinger',
        'foucault',
        'vel',
        'calvin'
      ]);
      done();
    };
    fetchAllOwners(testCB);
  });
});

describe('fetchCatsByOwner', () => {
  it('invokes the callback with no error when given a valid owner', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    fetchCatsByOwner('calvin', testCB);
  });
  it('invokes the callback with the 404 error when given an invalid owner', done => {
    const owner = 'mitch';
    const testCB = err => {
      expect(err).to.equal(`404 - ${owner} not found`);
      done();
    };
    fetchCatsByOwner(owner, testCB);
  });
  it('invokes the callback with the cats for the specified owner', done => {
    fetchCatsByOwner('vel', (err, cats) => {
      expect(cats).to.eql(['Opal']);
      fetchCatsByOwner('pavlov', (err, cats) => {
        expect(cats).to.eql(['Belle', 'Dribbles', 'Nibbles']);
        done();
      });
    });
  });
});

describe('fetchCatPics', () => {
  it('invokes the callback function with no error', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    fetchCatPics([], testCB);
  });
  it('invokes the callback function with a single response', done => {
    const testCB = (err, responses) => {
      expect(responses).to.eql(['cute-cat.jpg']);
      done();
    };
    fetchCatPics(['cute-cat'], testCB);
  });
  it('invokes the callback function with multiple unordered responses', done => {
    const testCB = (err, responses) => {
      expect(responses).to.include('cute-cat.jpg');
      expect(responses).to.include('chonky-cat.jpg');
      expect(responses).to.include('scratchy-cat.jpg');
      expect(responses).to.include('pathetic-cat.jpg');
      done();
    };
    fetchCatPics(
      ['cute-cat', 'chonky-cat', 'scratchy-cat', 'pathetic-cat'],
      testCB
    );
  });
  it('handles error responses with a placeholder', done => {
    const testCB = (err, responses) => {
      expect(responses).to.include('cute-cat.jpg');
      expect(responses).to.include('chonky-cat.jpg');
      expect(responses).to.include('scratchy-cat.jpg');
      expect(responses).to.include('pathetic-cat.jpg');
      expect(responses).to.not.include('ERROR: out-of-place-dog not found!');
      expect(responses).to.include('placeholder.jpg');
      done();
    };
    fetchCatPics(
      [
        'cute-cat',
        'chonky-cat',
        'scratchy-cat',
        'pathetic-cat',
        'out-of-place-dog'
      ],
      testCB
    );
  });
});

describe('fetchAllCats', () => {
  it('invokes the callback with no error', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    fetchAllCats(testCB);
  });
  it('invokes the callback with an array of all the cats, sorted in alphabetical order', done => {
    const testCB = (err, cats) => {
      expect(cats).to.eql([
        'Belle',
        'Dribbles',
        'Hobbes',
        'Leben',
        'M. Fang',
        'Nibbles',
        'Opal',
        'Tot'
      ]);
      done();
    };
    fetchAllCats(testCB);
  });
});

describe('fetchOwnersWithCats', () => {
  it('invokes the callback function with no error', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    fetchOwnersWithCats(testCB);
  });
  it('invokes the callback function with an array of cat/owner objects', done => {
    const testCB = (err, owners) => {
      expect(owners).to.deep.include({ owner: 'vel', cats: ['Opal'] });
      done();
    };
    fetchOwnersWithCats(testCB);
  });
  it('invokes the callback function with the array of cat/owner objects in the origin order', done => {
    const testCB = (err, owners) => {
      expect(owners).to.deep.eql([
        { owner: 'pavlov', cats: ['Belle', 'Dribbles', 'Nibbles'] },
        { owner: 'schrodinger', cats: ['Leben', 'Tot'] },
        { owner: 'foucault', cats: ['M. Fang'] },
        { owner: 'vel', cats: ['Opal'] },
        { owner: 'calvin', cats: ['Hobbes'] }
      ]);
      done();
    };
    fetchOwnersWithCats(testCB);
  });
  it('orders the owners without using a sort function', () => {
    expect(fetchOwnersWithCats.toString()).to.not.include('.sort(');
  });
});

describe('kickLegacyServerUntilItWorks', () => {
  it('(eventually!) invokes the callback with no error', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    kickLegacyServerUntilItWorks(testCB);
  });
  it('(eventually!) invokes callback with the correct string', done => {
    const testCB = (err, status) => {
      expect(status).to.equal('200 - the legacy server is up');
      done();
    };
    kickLegacyServerUntilItWorks(testCB);
  });
});

describe('buySingleOutfit', () => {
  // As done can only be called once, these tests implicitly check that our callback isn't being invoked multiple times
  it('invokes the callback with no error when given a valid outfit', done => {
    const testCB = err => {
      expect(err).to.be.null;
      done();
    };
    buySingleOutfit('taco', testCB);
  });
  it('invokes the callback with an error when given an invalid outfit', done => {
    const outfit = 'dannyDevito';
    const testCB = err => {
      expect(err).to.equal(`404 - ${outfit} not found`);
      done();
    };
    buySingleOutfit(outfit, testCB);
  });
  it('invokes the callback with a checkout object', done => {
    const testCB = (err, checkout) => {
      expect(checkout).to.eql({
        quantity: 1,
        outfit: 'gremlin',
        totalCost: 73.1
      });
      done();
    };
    buySingleOutfit('gremlin', testCB);
  });
});
