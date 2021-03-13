import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {withRouter} from 'react-router-dom';

import React from "react";
import {withStyles} from "@material-ui/styles";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ReactMarkdown from "react-markdown";
import InfoIcon from "@material-ui/icons/Info";
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
        background : '#2E3B55'
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

        // let param = this.props.match.params

        let pref_param = this.props.match.params["imgdata"].replaceAll("-", "/") + ".jpg"


        const img = "https://img1.night2day.ru/" + pref_param

        return (
            <div className={classes.root}>
                <Typography align="center" variant="h4">Найди меня в отражении огней ночной тусовке</Typography>
                <GridListTile key={img} cols={3}>
                    <img src={img} alt={img} />
                    <GridListTileBar
                        title={`Примерная дата посещения: ${img.split("/")[img.split("/").length - 1].slice(0, 8)}`}
                        subtitle={<ReactMarkdown>{`Перейти по [ссылке](${img} "Title") на фото в высоком разрешении.`}</ReactMarkdown>}
                        actionIcon={
                            <IconButton aria-label={`info about ${img}`} className={classes.icon}>
                                <InfoIcon />
                            </IconButton>
                        }
                    />
                </GridListTile>
            </div>
        )
    }
};
export default withStyles(useStyles)(withRouter(ImageInfo))