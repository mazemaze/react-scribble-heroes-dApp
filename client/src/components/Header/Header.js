import React from 'react'
import styles from './Header.module.css';
function Header(props) {
    const connectToWallet = () => {
       return <div>
            <button onClick={async () => await props.connect()}>
                Connect To Wallet
            </button>
        </div>
    }

    const mintNewHero = () => {
        return <div className={styles.buttons}>
        <button onClick={() => props.mintDialog()}>
            Mint New Hero
        </button>
        <button onClick={() => props.battleDialog()}>
            Battle
        </button>
        <button onClick={() => props.disconnect()}>
            Disconnect
        </button>
    </div>
    }
    return (
        <div className={styles.container} >
            <div className={styles.title}>
                <h1>Scribble Heroes</h1>
            </div>
            {!props.web3 ? connectToWallet() : mintNewHero()}
        </div>
    )
}

export default Header