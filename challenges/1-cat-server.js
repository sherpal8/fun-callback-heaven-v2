const request = require('../utils/server');

const checkServerStatus = callback => {
  request('/status', (err, status) => {
    if (err) callback(err);
    else callback(null, status);
  });
};

const fetchBannerContent = callback => {
  request('/banner', (err, bannerObject) => {
    if (err) callback(err);
    else {
      bannerObject.copyrightYear = 2019;
      callback(null, bannerObject);
    }
  });
};

const fetchAllOwners = callback => {
  request('/owners', (err, ownersArr) => {
    if (err) callback(err);
    else {
      let newOwnersArr = ownersArr.map(owner => owner.toLowerCase());
      callback(err, newOwnersArr);
    }
  });
};

const fetchCatsByOwner = (ownerName, callback) => {
  request(`/owners/${ownerName}/cats`, (err, catsArr) => {
    if (err) callback(err);
    else callback(null, catsArr);
  });
};

const fetchCatPics = (namesArr, callback) => {
  const catPicArr = [];
  if (namesArr.length === 0) callback(null);
  namesArr.forEach(name => {
    request(`/pics/${name}`, (err, picName) => {
      if (err) {
        catPicArr.push('placeholder.jpg');
      } else {
        catPicArr.push(picName);
      }
      if (catPicArr.length === namesArr.length) {
        callback(null, catPicArr);
      }
    });
  });
};

const fetchAllCats = callback => {
  fetchAllOwners((err, ownersArr) => {
    if (err) console.log(err);
    else {
      let counter = 0;
      let catArr = [];
      ownersArr.forEach(ownerName => {
        fetchCatsByOwner(ownerName, (err, catsByOwner) => {
          counter++;
          catArr = catArr.concat(catsByOwner);
          if (counter === ownersArr.length) {
            if (err) callback(err);
            else callback(null, catArr.sort());
          }
        });
      });
    }
  });
};

const fetchOwnersWithCats = callback => {
  fetchAllOwners((err, ownersArr) => {
    if (err) console.log(err);
    else {
      let counter = 0;
      let finalArr = [];
      finalArr.length = ownersArr.length;
      ownersArr.forEach((ownerName, i) => {
        fetchCatsByOwner(ownerName, (err, catsByOwner) => {
          let catOwnerObject = { owner: ownerName, cats: catsByOwner };
          counter++;
          finalArr.splice(i, 1, catOwnerObject);
          if (counter === ownersArr.length) {
            if (err) callback(err);
            else {
              let filteredFinalArr = finalArr.filter(element => element);
              callback(null, filteredFinalArr);
            }
          }
        });
      });
    }
  });
};

const kickLegacyServerUntilItWorks = callback => {
  request(`/legacy-status`, (err, outcome) => {
    if (err) kickLegacyServerUntilItWorks(callback);
    else callback(null, outcome);
  });
};

const buySingleOutfit = (outfitName, callback) => {
  let counter = 0;
  request(`/outfits/${outfitName}`, (err, outfit) => {
    if (err) callback(err);
    else {
      counter++;
      if (counter === 1) {
        callback(null, outfit);
      }
    }
  });
};

module.exports = {
  buySingleOutfit,
  checkServerStatus,
  kickLegacyServerUntilItWorks,
  fetchAllCats,
  fetchCatPics,
  fetchAllOwners,
  fetchBannerContent,
  fetchOwnersWithCats,
  fetchCatsByOwner
};
