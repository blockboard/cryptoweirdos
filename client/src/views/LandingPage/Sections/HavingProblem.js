import { makeStyles } from "@material-ui/core";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointDown } from '@fortawesome/free-regular-svg-icons'
import { faFrown } from '@fortawesome/free-regular-svg-icons'

const useStyles = makeStyles({
    div:{
        textAlign:"center",
        backgroundColor:"#E5E5E5"
    },
    h1:{
        color:"#000",
        fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
        padding:"20px",
    },
    P:{
        color:"#000",
    },
    button:{
        border:"1px solid",
        padding:"10px",
        display:"inline-block",
        width:"200px",
        marginTop:"20px",
        color:"black"
    },
    sad:{
        paddingTop:"8px",
        paddingLeft:"8px",
        fontSize:"40px"
    },
    hand:{
        paddingTop:"5px",
        paddingLeft:"5px",
        fontSize:"25px"
    },
})

export default function HavingProblem(){
    const classes = useStyles();
    const hand = <FontAwesomeIcon icon={faHandPointDown} className={classes.hand}/>
    const sad = <FontAwesomeIcon icon={faFrown} className={classes.sad}/>

    return(
        <div className={classes.div}>
            <h3 className={classes.h1}>
                Unfortunately we are facing some problems
                {sad}
            </h3>
            <p className={classes.P}>But you can find our collection here{hand}</p>
            <a
                href="https://opensea.io/collection/crypto-weirdos"
                target="_blank"
                className={classes.button}
            >
                OpenSea
            </a>
            {/* <button className={classes.button}>OpenSea</button> */}
        </div>
    )
};