import React from 'react'
import LiniarParameter from '../LinearParameter/LiniarParameter';
import styles from './BattleHeroCell.module.css';

function BattleHeroCell(props) {
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
                <li><span className={styles.paramName}>Health: </span>{health}</li>
                <li><span className={styles.paramName} >Strength: </span>{strength}</li>
                <li><span className={styles.paramName}>Defense: </span>{defense}</li>
                <li><span className={styles.paramName}>Luck: </span>{luck}</li>
            </ol>
        </li>
    )
}

export default BattleHeroCell