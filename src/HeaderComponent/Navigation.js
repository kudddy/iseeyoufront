import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {withRouter} from 'react-router-dom';

import React from "react";
import {withStyles} from "@material-ui/styles";



const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
    },
    title: {
        flexGrow: 1,
    },
    appBar:{
        background : '#2E3B55'
    }

});

class ButtonAppBar extends React.Component{
    constructor(props) {
        super(undefined);

        this.state = {
            AuthState: false,
        }
    }
    handleBack = ()=>{
        this.probs.history.goBack()
    }
    handleForward = () =>{
        console.log(this.props.history)
        this.probs.history.go(+1)
    }

    render() {

        const redirectMain = () => {

            this.props.history.push('/')

        }


        const { classes } = this.props;
        let button
        console.log("смотрим что у нас при баддоне")
        console.log(window.location.href)
        if (window.location.href===process.env.REACT_APP_HOST){
            console.log("в фалсе")
            button = <Button color="inherit" onClick={redirectMain} disabled={true}>Redirector</Button>
        }else {
            console.log("в тру")
            button = <Button color="inherit" onClick={redirectMain}>FINDME</Button>

        }

        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        </IconButton>
                        {button}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};
export default withStyles(useStyles)(withRouter(ButtonAppBar))


