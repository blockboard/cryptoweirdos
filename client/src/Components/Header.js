import React from "react";
//import MetaTags from 'react-meta-tags';

import Styles from './Header.module.css'

const Header = (props) => {
    return (
        <div>
            <header>
                <nav className={Styles.nav}>
                    <div className={Styles.container}>
                        <div className={Styles.navHead}>
                            {
                                // TODO: Button Actions "look to codepen fork"
                            }
                            <button className={Styles.toggleNav} data-toggle="open-navbar1">
                                <i className="fa fa-bars"/>
                            </button>
                            <a className={Styles.brand} href="/">Cryptofaces</a>
                        </div>
                        <div className={Styles.menu} id="open-navbar1">
                            <ul className={Styles.list}>
                                <li><a href="#">home</a></li>
                                <li><a href="#">gallery</a></li>
                                <li><a href="#">activity</a></li>
                                <li><a href="#">my collection</a></li>
                                <li><a href="#">contact</a></li>
                                <li><a href="#">Sign in</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
};

export default Header;