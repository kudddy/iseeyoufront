import React from 'react';
import './index.css';
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import PropTypes from "prop-types";
import GlitchText from 'react-glitch-effect/core/GlitchText';

import {withStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import InfoIcon from '@material-ui/icons/Info';
import Typography from "@material-ui/core/Typography";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {CircularProgress, Dialog, DialogActions, DialogContent} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';



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
        backgroundColor:"black",
    },
    closeButton:{

    },
    userAgree:{
        background: "#262626",
        color: "#a0a0a0"

    },
    headAgree:{
        background: "#262626",
        color: "#a0a0a0"
    },

    mainTextAgreements:{
        background: "#262626",
        color: "#a0a0a0"
    }
});


const DialogTitle = withStyles(useStyles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle className={classes.headAgree} {...other}>
            <Typography variant="h6">{children}</Typography>
        </MuiDialogTitle>
    );
});

class Main extends React.Component {

    constructor(props) {
        super(undefined);

        this.state = {
            json: [],
            isLoading: false,
            ClickMe: false,
            Position:[0, 6],
            responseError: false
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
        // содержит путь к ручкам сервиса, для дев режима одни, для пром другие. Помогает отладить приложение
        let url
        // check dev mode
        const { REACT_APP_DEV_MODE } = process.env;

        let form_data = new FormData();

        this.setState({ClickMe: true, Position:[0, 6], isLoading: false});


        form_data.append('image', selectorFiles[0]);
        if (REACT_APP_DEV_MODE === "true"){
            const base_url = process.env.REACT_APP_BACKEND_HOST;
            url = base_url + 'check_similarity/7dbbccad-a746-4f3d-ac3a-e22327e1bcf9/0.6/45/';
        } else {
            url = 'check_similarity/7dbbccad-a746-4f3d-ac3a-e22327e1bcf9/0.75/45/';
        }
        // TODO hard code uid model

        axios.post(url, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => this.setState({json: res.data, isLoading: true}))
            .catch(err => this.setState({responseError: true, isLoading: true}))
    }

    handleRedirect(img){


        let img_info = replaceAll(img.split("ru/")[1]
            .split('.')[0], '/', '-')

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

    handleClickOpen = () => {
        this.setState({open: true})
    };

    handleClose = () => {
        this.setState({open: false})
    };

    render (){

        const { classes } = this.props;
        const {Position, ClickMe, json, isLoading, responseError, open } = this.state;
        let loading

        if (!ClickMe){
            loading = null
        } else{
            if (!isLoading){
                loading =
                    <div className="row" style={{position: 'relative', top: "20px"}}>
                        <CircularProgress/>
                    </div>
            } else {

                if (responseError){
                    loading =
                        <Typography className={classes.infoText}
                                          align="center"
                                          variant="h4">Упс, что то пошло не так! Попробуйте перезагрузить страницу.
                        </Typography>
                } else {
                    if (json["STATUS"]){

                        let tileData = [];

                        let slicePayload;

                        slicePayload = json["PAYLOAD"]["result"].slice(Position[0], Position[1])

                        let buttonToBegin
                        if (Position[0] !== 0){
                            buttonToBegin =
                                <Button
                                className={classes.mainButton}
                                style={{ backgroundColor: "#f43" }}
                                variant="contained" onClick={() => this.handleToBegin()}>В начало
                                </Button>

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
                            const buttonGetMore = <Button className={classes.mainButton}
                                                          style={{ backgroundColor: "#f43" }}
                                                          variant="contained"
                                                          onClick={() => this.handleModePic()}>Еще</Button>

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
                        loading =
                            <Typography
                                className={classes.infoText}
                                align="center"
                                variant="h4">Ничего не найдено, попробуйте загрузить др
                            </Typography>
                    }
                }



            }
        }
        // TODO должна быть ссылка на N2D в шапке профиля
            return (
                <div className="row" >
                    <Grid container direction="column" alignItems="center"
                          spacing={0}
                          justify="center"
                          style={{ minHeight: '60vh' }}>
                        <Grid className={classes.interText} item xs={12}>
                            <div className={classes.mainText}>
                                     <GlitchText
                                         component='h1'>
                                       I see You
                                     </GlitchText>
                            </div>
                            <div className={classes.infoText}>
                                <Typography align="center" variant="h4">Найди меня в отражении огней ночных тусовок</Typography>
                                <br/>
                                <Typography align="center"
                                            variant="h6">
                                    Загрузите фотографию человека и мы найдем Вам его в случае если он засветился на вечеринке,
                                </Typography>
                                <Typography align="center"
                                            variant="h6">
                                    в крайнем случае покажем максимально похожего.
                                </Typography>
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

                                    <Button
                                        variant="contained"
                                        component="span"
                                        style={{
                                            backgroundColor: "#f43",
                                        }}
                                    >
                                        Загрузить
                                    </Button>
                                    </div>
                                </label>

                        </Grid>
                        <br/>
                        {loading}
                        <br/>
                        <br/>
                        <div>
                            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                                Пользовательское соглашение
                            </Button>
                            <Dialog  className={classes.userAgree} onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={open}>
                                <DialogTitle className={classes.headAgree} id="customized-dialog-title" onClose={this.handleClose}>
                                    Условия использования веб-приложения
                                </DialogTitle>
                                <DialogContent className={classes.mainTextAgreements} dividers>
                                    <Typography gutterBottom>
                                        В первую очередь Вы должны четко понимать, что никаких пользовательских данных мы не храним.
                                        Приложение получает фото, векторизует его, сравнивает с другими векторами и выводит результат.
                                    </Typography>
                                    <Typography gutterBottom>
                                        Во вторых мы не правообладатели базы и никакого отношения к ней не имеем, все данные взяты из открытого источника, а именно
                                        с сайта https://night2day.ru.
                                    </Typography>
                                    <Typography gutterBottom>
                                        В третьих сайт носит развлекательный характер и не преследует цель каким-либо образом нажиться на Вас.
                                    </Typography>
                                    <Typography gutterBottom>
                                        В четвертых мы всегда можете связаться с создателем через электронную почту по адресу - iseeyouappforyou@gmail.com.
                                    </Typography>
                                </DialogContent>
                                <DialogActions className={classes.mainTextAgreements}>
                                    <Button autoFocus onClick={this.handleClose} color="primary">
                                        Принять соглашение
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </Grid>


                </div>

            );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(withRouter(Main))