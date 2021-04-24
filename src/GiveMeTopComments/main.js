import React from 'react';
import './index.css';
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import PropTypes from "prop-types";
//css
import {withStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import InfoIcon from '@material-ui/icons/Info';
import Typography from "@material-ui/core/Typography";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {CircularProgress} from '@material-ui/core';




function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

const useStyles = (theme) => ({
    root: {
        minWidth: 50,
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    interText:{
        color:'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    },
    input: {
        '& > *': {
            width: '50ch',
        },
    },
    button:{
        // background : '#3f51b5',
        // color:"#fff"
    },
    inputButton:{
        display: 'none'
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    buttonMore:{
        textAlign:'center'
    },
    RealImg:{
        top: "100%"
    },
    mainText:{
        fontSize: "48px",
        color: "#ffb200",
        textAlign:'center'
    },
    infoText:{
        color: "#a0a0a0"
    },
    mainButton:{
        backgroundColor:"#a0a0a0",
    }
});

class GiveMeTopComments extends React.Component {

    constructor(props) {
        super(undefined);

        this.state = {
            json: [],
            isLoading: false,
            ClickMe: false,
            Position:[0, 6]
        }
        this.handleToBegin = this.handleToBegin.bind(this);
        this.handleModePic = this.handleModePic.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);

    }


    handleBack = () => {
        this.probs.history.goBack()
    }
    handleForward = () => {
        console.log(this.props.history)
        this.probs.history.go(+1)
    }

    componentDidMount() {
        //check_debug mode
        // const base_url = process.env.REACT_APP_BACKEND_HOST;
        // let url = base_url + 'gettopcomments/';
        // TODO hard code uid model
        let url = 'gettopcomments/';
        axios.post(url)
            .then(res => this.setState({json: res.data, isLoading: true}))
            .catch(err => console.log(err))
    }




    handleRedirect(img){


        let img_info = replaceAll(img.split("ru/")[1]
            .split('.')[0], '/', '-')

        // this.props.history.push("/image/"+ img_info)
        const win = window.open("/image/"+ img_info, "_blank");
        win.focus();
    }

    handleModePic(){
        const { Position } = this.state;

        const slc = 6

        let newPos = []
        let PositionOne = Position[0]
        let PositionTwo = Position[1]

        newPos.push(PositionOne + slc)

        newPos.push(PositionTwo + slc)

        this.setState({Position: newPos})
    }

    handleToBegin(){
        this.setState({Position: [0, 6]})

    }

    render (){

        const { classes } = this.props;
        const {Position, json, isLoading } = this.state;
        let loading

        if (!isLoading){
            loading =
                <div className="row" style={{position: 'relative', top: "20px"}}>
                    <CircularProgress/>
                </div>
        } else {

            if (json["STATUS"]){

                let tileData = [];

                let slicePayload;

                slicePayload = json["PAYLOAD"]["result"].slice(Position[0], Position[1])

                let buttonToBegin
                if (Position[0] !== 0){
                    buttonToBegin = <Button className={classes.mainButton} variant="contained" onClick={() => this.handleToBegin()}>В начало</Button>

                } else {
                    buttonToBegin = null
                }

                if (slicePayload.length>0){
                    slicePayload.forEach(function (item){
                        tileData.push({
                            img: item,
                            title: 'Image',
                            author: 'author'
                        })
                    })


                    const buttonGetMore = <Button className={classes.mainButton} variant="contained" onClick={() => this.handleModePic()}>Еще</Button>
                    let gridCols


                    if (window.screen.availWidth <= 500){
                        gridCols = 1
                    } else if (window.screen.availWidth > 500 && window.screen.availWidth < 1024) {
                        gridCols = 2
                    } else {
                        gridCols = 3
                    }
                    loading =    <div><div>
                        <GridList cellHeight={250} cols={gridCols}>
                            {tileData.map((tile) => (
                                <GridListTile key={tile.img} >
                                    <img src={tile.img} alt={tile.title} style={{ display: 'block' , maxWidth: "95%", margin: "0 auto"}}/>
                                    <GridListTileBar
                                        title={`Дата посещения: ${tile.img.split("/")[tile.img.split("/").length - 1].slice(0, 8)}`}
                                        actionPosition = 'left'
                                        subtitle={<span>Тапните для того чтобы получить фото в высоком разрешении или <br/> оставить комментарий</span>}
                                        actionIcon={
                                            <IconButton aria-label={`info about ${tile.title}`} className={classes.icon} onClick={() => this.handleRedirect(tile.img)}>
                                                <InfoIcon />
                                            </IconButton>
                                        }
                                    />
                                </GridListTile>
                            ))}

                        </GridList>
                    </div>
                        <br/>
                        <div className={classes.buttonMore}>
                            {buttonToBegin}
                            {buttonGetMore}
                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>

                } else {

                    // loading = <Typography className={classes.infoText} align="center" variant="h4">У нас все, загрузите еще фотографию для продолжения.</Typography>

                    loading = <div className={classes.buttonMore}>
                        <br/>
                        <Typography className={classes.infoText} align="center" variant="h4">У нас все, загрузите еще фотографию для продолжения.</Typography>
                        {buttonToBegin}
                    </div>

                }


            } else {

                loading = <Typography className={classes.infoText} align="center" variant="h4">Ничего не найдено, попробуйте загрузить др</Typography>
            }


        }
        // TODO должна быть ссылка на N2D в шапке профиля
            return (
                <div className="row">
                    <Typography align="center" variant="h4" style={{color: "#a0a0a0"}}>Топ комментируемых фотографий</Typography>
                    <Grid container direction="column" alignItems="center"
                          spacing={0}
                          justify="center"
                          style={{ minHeight: '60vh' }}>
                        <br/>
                        {loading}
                    </Grid>

                </div>

            );
    }
}

GiveMeTopComments.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(withRouter(GiveMeTopComments))