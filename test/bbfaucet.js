var BBFaucet = artifacts.require('./BBOFaucet.sol')
var BBOTest = artifacts.require('./BBOTest.sol')

var bboInstance;
var faucetInstance;
contract('BBFaucet', function (accounts) {
  it('set BBO address should pass', function () {
    return BBOTest.new().then(function(instance){
      bboInstance = instance;
      return BBFaucet.deployed().then(function (instance) {
        faucetInstance = instance;
        return instance.setBBO(bboInstance.address)
      }).then(function (rs) {
        return faucetInstance.bbo().then(function(rs){
          assert.equal(rs, bboInstance.address);
        })
      })
    })
    
  })

  it('set Max Faucet', function () {
    return faucetInstance.setMaxFaucet(20000e18).then(function(rs){
      return faucetInstance.maxFaucetAmount().then(function(amount){
        assert.equal(amount,20000e18 );
      })
    })
  })

  it('set Faucet Amount', function () {
    return faucetInstance.setFaucetAmount(2000e18).then(function(rs){
      return faucetInstance.faucetAmount().then(function(amount){
        assert.equal(amount,2000e18 );
      })
    })
  })

  it('call faucet', function () {
    return bboInstance.transfer(faucetInstance.address,500000e18).then(function(r){
      return faucetInstance.faucet({from:accounts[2]}).then(function(rs){
        return bboInstance.balanceOf(accounts[2]).then(function(balance){
          assert.equal(balance, 2000e18);
        })
      })
    })
    
  })

})
