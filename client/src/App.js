import React, { Component } from "react";
import SimpleStorageContract from "./contracts/Hero.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import HeroCell from "./components/HeroCell/HeroCell";
import Header from "./components/Header/Header";
import web3 from "web3";
import mitingBG from "./minting.png"
import BattleHeroCell from "./components/BattleHeroCell/BattleHeroCell";

class App extends Component {
  state = {
    heroes: [],
    web3: null,
    accounts: null,
    conFunc: null,
    contract: null,
    buyFunc: null,
    sellFunc: null,
    ownedHero: null,
    batFunc: null,
    mint: null,
    dicFunc: null,
    showMintDialog: false,
    showBattleDialog: false,
    toggleBattleDialog: () => this.setState({ showBattleDialog: !this.state.showBattleDialog }),
    toggleMintDialog: () => this.setState({ showMintDialog: !this.state.showMintDialog }),
    showOwned: false,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {

      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    const buyFunction =
      async (id) => {
        const owner = await contract.methods.ownerOf(id).call();
        await contract.methods.buyHero(owner, accounts[0], id, 0).send({
          from: accounts[0],
          values: 10,
        });
        initHeroes();
      }

    const mintFuc = async () => {
      await contract.methods.mintFromParents().send({ from: accounts[0] });
      await initHeroes();
      this.setState({ showMintDialog: false })
    }

    const disconnect = () => {
      this.setState({ web3: null, accounts: null })
    }

    const battleFunc = async (myId, eneyId) => {
      await contract.methods.battleResult(myId, eneyId).send({ from: accounts[0] });
    }

    const connect = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      this.setState({ web3, accounts })
    }

    const sellToMarket = async (id) => {
      await contract.methods.sellHero(id).send({
        from: accounts[0]
      });
      await initHeroes();
    }


    const initHeroes = async () => {
      let heroesParams = [];
      let _ownedHero = [];
      const heroes = await contract.methods.getHeroes().call();
      for (var i = 0; i < heroes.length; i++) {
        const hero = heroes[i];
        const owner = await contract.methods.ownerOf(hero.id).call();
        if (await contract.methods.ownerOf(hero.id).call() !== accounts[0] || hero.isOnSale) {
          console.log(hero);
          const url = await contract.methods.tokenURI(hero.id).call();
          try {
            const result = await fetch(url);
            const json = await result.json();
            heroesParams.push(
              [hero, json, owner]
            );
          } catch (e) {
            console.log(e);
          }
        } else {
          const url = await contract.methods.tokenURI(hero.id).call();
          try {
            const result = await fetch(url);
            const json = await result.json();
            _ownedHero.push([hero, json]);
          } catch (e) {
            console.log(e);
          }
        }
      }
      this.setState({
        heroes: heroesParams,
        ownedHero: _ownedHero
      });
    };

    initHeroes();

    this.setState({
      batFunc: battleFunc,
      buyFunc: buyFunction,
      dicFunc: disconnect,
      conFunc: connect,
      sellFunc: sellToMarket,
      mint: mintFuc,
    });
  }

  render() {
    return (
      <div className="App">
        <Header
          web3={this.state.web3}
          disconnect={this.state.dicFunc}
          connect={this.state.conFunc}
          mintDialog={this.state.toggleMintDialog}
          battleDialog={this.state.toggleBattleDialog}
        />
        <div class="toggle-button">
          <button style={!this.state.showOwned ? { backgroundColor: 'rgb(4, 160, 228)', color: '#fff' } : null}
            onClick={() => this.setState({ showOwned: false })}>Marketplace</button>
          <button style={this.state.showOwned ? { backgroundColor: 'rgb(4, 160, 228)', color: '#fff' } : null}
            onClick={() => this.setState({ showOwned: true })}>My Heroes</button>
        </div>
        <div class="heroes-list">
          {(this.state.showOwned ? this.state.ownedHero : this.state.heroes).map(((e) => {
            return <HeroCell
              isOwned={!this.state.showOwned}
              hero={e[0]}
              imgUrl={e[1].imgUrl}
              owner={e[2]}
              account={this.state.accounts[0]}
              handleBuyFunction={this.state.buyFunc}
              handleSellFunction={this.state.sellFunc} />
          }
          ))}
        </div>
        {this.state.showMintDialog ? <div id="overlay">
          <div id="content">
            <img src={mitingBG} />
            <button class="mint-button" onClick={this.state.mint} id="">Mint</button>
            <button id="dialog-button" onClick={this.state.toggleMintDialog}>Close</button>
          </div>
        </div> : null}
        {this.state.showBattleDialog ? <div id="overlay">
          <div id="hero-content">
            <div class="opponent-list">
              {this.state.heroes.map((e) => {
                return <BattleHeroCell
                  isOwned={!this.state.heroes}
                  hero={e[0]}
                  imgUrl={e[1].imgUrl}
                  owner={e[2]}
                  account={this.state.accounts[0]}
                  handleBuyFunction={this.state.buyFunc}
                  handleSellFunction={this.state.sellFunc} />
              })}
            </div>
            <div class="ownhero-list">
              {this.state.ownedHero.map((e) => {
                return <BattleHeroCell
                  isOwned={!this.state.showOwned}
                  hero={e[0]}
                  imgUrl={e[1].imgUrl}
                  owner={e[2]}
                  account={this.state.accounts[0]}
                  handleBuyFunction={this.state.buyFunc}
                  handleSellFunction={this.state.sellFunc} />
              })}
            </div>
            <button class="mint-button" onClick={this.state.batFunc(0, 1)} id="">Battle</button>
            <button id="dialog-button" onClick={this.state.toggleBattleDialog}>Close</button>
          </div>
        </div> : null}
      </div>
    );
  }
}

export default App;
