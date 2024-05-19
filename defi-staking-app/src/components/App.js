import React, {Component} from 'react'
import './navbar'
import Navbar from './navbar'
import Web3 from 'web3';
import Tether from '../truffle_abis/contracts/Tether.json'
import RWD from '../truffle_abis/contracts/RWD.json'
import DecentralBank from '../truffle_abis/contracts/DecentralBank.json'
import Main from './Main'
import Dao from './Dao'

class App extends Component {

    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        // 윈도우에서 이더리움이 감지되면 window.ethereum이 활성화될때까지 대기
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        // 윈도우에서 wev3가 감지되면 currentProvider로 새 weㅠ3 인스턴스를 생성
        else if (window.web3)
            {
                window.web3 = new Web3(window.web3.currentProvider)
            } 
        // 둘중 하나라도 충족x일시 경고창 출력    
        else {
            window.alert('Error: check your metamask')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})  // 연결된 지갑주소 가져오기.
        const networkId = await web3.eth.net.getId() //현재 연결된 네트웤 id 가져오기
        

        //네트워크 불러온 후 테터 컨트렉 불러오기.
        const tetherData = Tether.networks[networkId]
        if(tetherData) {
            const tether =new web3.eth.Contract(Tether.abi, tetherData.address)
            this.setState({tether})
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({tetherBalance: tetherBalance.toString()})
            console.log(tetherBalance, 'tether balance')
        } else {
            window.alert('Error! Tether contract not deployed -no detected network')
        }

        // RWD 컨트렉 불러오기
        const rwdData = RWD.networks[networkId]
        if(rwdData) {
            const rwd =new web3.eth.Contract(RWD.abi, rwdData.address) 
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance: rwdBalance.toString()})
            console.log(rwdBalance, 'RWD balance')
        } else {
            window.alert('Error! RWD contract not deployed -no detected network')
        }

        // decentralBankData 컨트렉 불러오기
        const decentralBankData = DecentralBank.networks[networkId]
        if(decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
            this.setState({decentralBank})
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalace: stakingBalance.toString()})
            console.log(stakingBalance, 'stakingbalance')
        } 
        else {
            window.alert('Error! decentralBankData contract not deployed -no detected network')
        }

        this.setState({loading: false})
 
    }


    stakeTokens = (amount) => {
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) =>{
        this.state.decentralBank.methods.depositToken(amount).send({from: this.state.account}).on('transactionHash', (hash) =>{
            this.setState({loading: false})
        })
    })
}

    unstakeTokens = () => {
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) =>{
            this.setState({loading: false})
        })
}
    


    constructor(props) {
        super(props)
        this.state = {
            account : 'Connect',
            tether : {},
            rwd : {},
            decentralBank : {},
            tetherBalance : '0',
            rwdBalance : '0',
            stakingBalace : '0',
            loading : true
        }
    }

    render() {
        let content
        {this.state.loading ?
        content = <p id='loader' className='text-center' style={{magin:'30px'}}>LOADING PLEASE...</p> 
        : content = 
        <Main 
        tetherBalance={this.state.tetherBalance}
        rwdBalance={this.state.rwdBalance}
        stakingBalace={this.state.stakingBalace}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        />}
        return (
            <div>
                <Navbar account={this.state.account} />
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px', minHeight: '100vm'}}>
                            <div>
                                 {content}
                            </div>
                        </main>
                    </div>
                </div>
                <Dao />
            </div>
        )
    }
}

export default App;