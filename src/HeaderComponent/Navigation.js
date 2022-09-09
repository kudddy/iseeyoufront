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
    leftBar:{
        marginLeft: "auto"
    },
    title: {
        flexGrow: 1,
    },
    appBar:{
        background : '#262626'
    },
    buttonSendFeedBack: {
        marginLeft: "auto"
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

        const redirectGiveFeedBack = () => {
            this.props.history.push('/givemefeedback')
        }

        const redirectGiveTop = () => {
            this.props.history.push('/topcomment')
        }

        const { classes } = this.props;
        let button = <Button color="inherit" onClick={redirectMain}>I SEE YOU</Button>

        let buttonGiveFeedBack = <Button className={classes.buttonSendFeedBack} onClick={redirectGiveFeedBack} color="inherit">Feedback</Button>

        let buttonGiveTop = <Button className={classes.buttonSendFeedBack} onClick={redirectGiveTop} color="inherit">TOP</Button>

        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        </IconButton>
                        {button}
                        <div className={classes.leftBar}>
                            {buttonGiveTop}
                            {buttonGiveFeedBack}
                        </div>

                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};
export default withStyles(useStyles)(withRouter(ButtonAppBar))


