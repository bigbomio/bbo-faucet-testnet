var BBFaucet = artifacts.require('./BBOFaucet.sol')

module.exports = function (deployer) {
  deployer.deploy(BBFaucet);
}
