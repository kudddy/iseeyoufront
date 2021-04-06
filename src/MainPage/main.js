import React from 'react';
import './index.css';
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import PropTypes from "prop-types";
import ReactMarkdown from 'react-markdown'

import GlitchText from 'react-glitch-effect/core/GlitchText';

//css
import {withStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import {CircularProgress} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import InfoIcon from '@material-ui/icons/Info';
import Typography from "@material-ui/core/Typography";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import {red} from "@material-ui/core/colors";


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

const ENV = process.env.REACT_APP_ENV

const MODEL_TOKEN = process.env.REACT_APP_MODEL_TOKEN

const MODEL_TRESH = process.env.REACT_APP_MODEL_TRESHHOLD

const MODEL_INPUT_COUNT = process.env.REACT_APP_MODEL_INPUT_COUNT

const BASE_URL = "check_similarity/" + MODEL_TOKEN + "/" + MODEL_TRESH + "/" + MODEL_INPUT_COUNT + "/"

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

class Main extends React.Component {

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
        this.handleChange = this.handleChange.bind(this);

    }


    handleBack = () => {
        this.probs.history.goBack()
    }
    handleForward = () => {
        console.log(this.props.history)
        this.probs.history.go(+1)
    }
    handleChange(selectorFiles)
    {
        let form_data = new FormData();

        this.setState({ClickMe: true, Position:[0, 6]});


        form_data.append('image', selectorFiles[0]);
        // for local debug lala check builds дфдфд

        let url
        if (ENV === 'dev'){
            const base_url = process.env.REACT_APP_BACKEND_HOST;
            url = base_url + BASE_URL;
        } else {
            url = BASE_URL;
        }

        axios.post(url, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
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
        const {Position, ClickMe, json, isLoading } = this.state;
        let loading

        if (!ClickMe){
            loading = null
        } else{
            // если кликнули но изображение еще не загрузилось
            if (!isLoading){
                loading = <div className="row">
                    <Grid container direction="column" alignItems="center"
                          spacing={0}
                          justify="center"
                          style={{ minHeight: '60vh' , background: red}}>
                        <Grid item xs={12}>
                            <div className="col-md-1 col-md-offset-1">
                                <CircularProgress />
                            </div>
                        </Grid>
                    </Grid>
                </div>
            } else {

                if (json["STATUS"]){

                    let tileData = [];

                    let slicePayload = [];

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
                        // if (window.screen.width > 1000){
                        //     gridCols = 3
                        // } else{
                        //     gridCols = 1
                        // }
                        loading =    <div><div>
                            <GridList cellHeight={250} cols={gridCols}>
                                {tileData.map((tile) => (

                                    <GridListTile key={tile.img} >
                                        <img src={tile.img} alt={tile.title} style={{ display: 'block' , maxWidth: "95%", margin: "0 auto"}}/>
                                        <GridListTileBar
                                            title={`Дата посещения: ${tile.img.split("/")[tile.img.split("/").length - 1].slice(0, 8)}`}
                                            subtitle={<ReactMarkdown>{`Высокое разрешение [--->](${tile.img}).`}</ReactMarkdown>}
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
        }
        // TODO должна быть ссылка на N2D в шапке профиля
            return (
                <div className="row">
                    <Grid container direction="column" alignItems="center"
                          spacing={0}
                          justify="center"
                          style={{ minHeight: '60vh' }}>
                        <Grid className={classes.interText} item xs={12}>
                            <div className={classes.mainText}>
                                     <GlitchText component='h1'>
                                       I see You
                                     </GlitchText>
                            </div>
                            <div className={classes.infoText}>
                                <Typography align="center" variant="h4">Найди меня в отражении огней ночных тусовок</Typography>

                                <br/>
                                <Typography align="center" variant="h6">Загрузите фотографию человека и мы поможем вам найти его</Typography>
                            </div>
                        </Grid>
                        <br/>
                        <Grid direction="column" justify="space-around">
                            <input
                                accept="image/*"
                                className={classes.inputButton}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={ (e) => this.handleChange(e.target.files) }
                            />
                                <label htmlFor="contained-button-file">
                                    <div className={classes.mainButton}>
                                    <Button variant="contained" color="#a0a0a0" component="span">
                                        Загрузить
                                    </Button>
                                    </div>
                                </label>

                        </Grid>
                        <br/>
                        {loading}
                    </Grid>

                </div>

            );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(withRouter(Main))