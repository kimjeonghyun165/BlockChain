const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    //테스트 코드 입력

    let tether, rwd, decentralBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }
    
    before(async () => {
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)
    
        // decentralbank 컨트렉에 모든 rwd 토큰 전송.
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        await tether.transfer(customer, tokens('100'), {from: owner})
    })



    describe('Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Tether')
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('DecentralBank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name, 'DecentralBank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yield Farming', async () => {
        it('rewards tokens for staking', async () => {
            let result

            // 투자자 잔액 확인
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'investor tether balance before staking')

            //100개 스테이킹
            await tether.approve(decentralBank.address, tokens('100'), {from: customer});
            await decentralBank.depositToken(tokens('100'), {from:customer});

            // 고객 잔액 재확인
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('0'), 'investor tether balance after staking 100 token')

            // decentralbank 잔액 업데이트
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'decentral bank tether balance after staking from customer')

            //isstaking 함수가 작동하는지..
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'true', 'customer is staking');

            //소유자가 토큰을 발행할 수 있는지..
            await decentralBank.issueTokens({from: owner})

            //소유자만이 토큰을 발행할 수 있는지...
            await decentralBank.issueTokens({from: customer}).should.be.rejected;

            // 토큰이 언스테이킹 됐는지 확인하는 테스트
            await decentralBank.unstakeTokens({from: customer})

            //언스테이킹하고 고객 잔액 채크하기
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'investor tether balance after unstaking 100 token');

            //언스테이킹하고 은행 잔액 채크하기
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('0'), 'decentral bank tether balance after unstaking from customer');

            //unstaking 함수가 작동하는지..
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'false', 'customer is unstaking');
    })
    }) 
})
