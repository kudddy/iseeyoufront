import {withRouter} from 'react-router-dom';

import React from "react";
import {withStyles} from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";



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
        background : '#a0a0a0'
    },
    mainImg:{
        maxWidth: "100%",
        height: "auto",
        textAlign:'center'
    }


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
        console.log("смотрим что передали в параметры")
        console.log(this.props.match.params["imgdata"])


        let pref_param = this.props.match.params["imgdata"].replaceAll("-", "/") + ".jpg"


        const img = "https://img1.night2day.ru/" + pref_param

        return (
            <div className={classes.root}>
                <Typography align="center" variant="h4">Найди меня в отражении огней ночной тусовке</Typography>
                <div className={classes.mainImg}>
                    <img src={img} alt={img} />
                </div>
            </div>
        )
    }
};
export default withStyles(useStyles)(withRouter(ImageInfo))