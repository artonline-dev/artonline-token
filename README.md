# art-online-core
Art Online 서비스 코어 컨트랙트

# 로컬 실행

#### shell
```
yarn develop
```

#### truffle console

migrate
```
migrate
```

check balance
```
const accounts = await web3.eth.getAccounts();
const instance = await ATCToken.deployed();
const balance = await instance.balanceOf(accounts[0]);
balance.toNumber();
```