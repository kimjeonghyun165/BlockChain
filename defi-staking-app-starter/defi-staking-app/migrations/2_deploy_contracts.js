const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts) {
    // 테더 컨트렉 배포
    await deployer.deploy(Tether); 
    const tether = await Tether.deployed()

    await deployer.deploy(RWD);
    const rwd = await RWD.deployed()

    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed()

    // decentralbank 컨트렉에 모든 rwd 토큰 전송.
    await rwd.transfer(decentralBank.address, '1000000000000000000000000')

    // 투자자들에게 테더 100개씩 분배
    await tether.transfer(accounts[1], '100000000000000000000')
};
