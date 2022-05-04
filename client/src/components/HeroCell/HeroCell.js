import React from 'react'
import LiniarParameter from '../LinearParameter/LiniarParameter';
import styles from './HeroCell.module.css';

function HeroCell(props) {
    const e = props.hero;
    const health = e.health
    const strength = e.strength;
    const defense = e.defense;
    const luck = e.luck;
    const price = e.price;
    const max = Math.max(health, strength, defense, luck)
    const address = props.owner;
    const account = props.account;
    return (
        <li className={styles.list} key={e.id}>
            <img className={styles.heroImage} src={props.imgUrl} />
            <ol className={styles.heroParameters}>
                <h2>#{e.id}</h2>
                <li><span className={styles.paramName}>Health: </span>{health}</li>
                <LiniarParameter parameter={health} max={max} />
                <li><span className={styles.paramName} >Strength: </span>{strength}</li>
                <LiniarParameter parameter={strength} max={max} />
                <li><span className={styles.paramName}>Defense: </span>{defense}</li>
                <LiniarParameter parameter={defense} max={max} />
                <li><span className={styles.paramName}>Luck: </span>{luck}</li>
                <LiniarParameter parameter={luck} max={max} />
                {props.isOwned ? <p>Price: {price}</p> : null}
            </ol>
            <div className={styles.button}>
                {props.isOwned ?
                    <button className={ address !== account ? styles.normal : styles.onSale} onClick={ address !== account ? async () => await props.handleBuyFunction(e.id) : null}>
                        {address !== account ? "Buy" : "Owned"}
                    </button> :
                    <button
                    className={e.isOnSale ? styles.onSale : null}
                    onClick={!e.isOnSale ? async () => await props.handleSellFunction(e.id) : null}
                    >
                        {!e.isOnSale ? "Sell" : "On Sale"}
                    </button>}
            </div>
        </li>
    )
}

export default HeroCell