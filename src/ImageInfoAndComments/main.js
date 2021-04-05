import {withRouter} from 'react-router-dom';

import React from "react";
import {withStyles} from "@material-ui/styles";

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

const useStyles = (theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
    },
    title: {
        flexGrow: 1,
    },
    appBar:{
        background : '#a0a0a0'
    },


});

class ImageInfo extends React.Component{
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

        const { classes } = this.props;


        let pref_param = replaceAll(this.props.match.params["imgdata"],"-", "/") + ".jpg"


        const img = "https://img1.night2day.ru/" + pref_param

        return (
            <div className={classes.root}>
                    <img src={img} alt={img} style={{ display: 'block' , maxWidth: "70%", margin: "0 auto"}}/>
            </div>
        )
    }
};
export default withStyles(useStyles)(withRouter(ImageInfo))