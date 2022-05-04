// const { assert } = require("console")
// const Hero = artifacts.require("./Hero.sol");
// const HeroToken = artifacts.require("./HeroToken")

// contract("Hero", accounts => {
//   let hero = null;
//   let heroToken = null;
//   let account1 = null;
//   let account2 = null;
//   before(async () => {
//     hero = await Hero.deployed();
//     heroToken = await HeroToken.deployed();
//     let accounts = await web3.eth.getAccounts();
//     account1 = accounts[0];
//     account2 = accounts[1];
//   });

//   it("Should return right json", async () => {
//     const url = await hero.tokenURI(1);
//     console.log(url)
//   })

//   it("Initial Heroes should be 100", async () => {
//     const heroes = await hero.getHeroes();
//     assert(heroes.length == 99);
//   })

//   it("Level up hero", async () => {
//     await hero.levelUp(0);
//     const heroes = await hero.getHeroes();
//     console.log(heroes)
//   })

//   it("Battle", async () => {
//     const result = await hero.battleResult({ from: account2 })
//     console.log(result.receipt.status)
//     await heroToken.sendTokeToWinner( BigInt(100),account2, true)
//     const balance = await heroToken.balanceOf(account2)
//     console.log(balance)
//   });
// });
