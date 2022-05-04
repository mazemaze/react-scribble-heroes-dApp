var Hero = artifacts.require("./Hero.sol");
var HeroToken = artifacts.require("./HeroToken.sol");

module.exports = function (deployer) {
  deployer.deploy(HeroToken).then(() => {
    return deployer.deploy(Hero);
  })
};