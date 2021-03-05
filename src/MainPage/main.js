import React from 'react';
import './index.css';
import {withRouter} from 'react-router-dom'
//css
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown'

import {withStyles} from "@material-ui/styles";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';

import {CircularProgress} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import axios from 'axios';
import {red} from "@material-ui/core/colors";

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = (theme) => ({
    root: {
        minWidth: 275,
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
        background : '#3f51b5',
        color:"#fff"
    },
    inputButton:{
        display: 'none'
    },
    rootGridImg: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    gridList: {
        width: 1000,
        height: 1000,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    }

});


class Main extends React.Component {

    constructor(props) {
        super(undefined);

        this.state = {
            json: [],
            isLoading: false,
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }


    handleBack = () => {
        this.probs.history.goBack()
    }
    handleForward = () => {
        console.log(this.props.history)
        this.probs.history.go(+1)
    }
    handleClick (){
        if (this.nameTextInput !== null) {

            this.setState({
                isLoading: false,
            });
        }
    }
    handleChange(selectorFiles)
    {
        console.log(selectorFiles[0]);
        let form_data = new FormData();

        form_data.append('image', selectorFiles[0]);
        const base_url = process.env.REACT_APP_BACKEND_HOST
        let url = base_url+'check_similarity/0.8/3/';
        axios.post(url, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => this.setState({json: res.data, isLoading: true}))
            .catch(err => console.log(err))
    }

    componentDidMount () {


        ReactDOM.findDOMNode(this.nameTextInput).focus();

    }
    componentDidUpdate (prevProps, prevState){



        console.log(this.nameTextInput.value)

    }

    render (){

        const { classes } = this.props;

        const { json, isLoading } = this.state;
        // TODO удалить
        let text

        text = "Введите название аккаунта"


        // первая загрузка - ничего
        // нажимаю на копку - загрузить фото -(во время загрузки рисуем значек загрузки)
        // после загрузки отрисовываем экран с фотографиями или если нет - экран с сообщением что ничего не найдено

        // пустой пайлоад и isloading - false - первый раз на экране
        let loading
        if (json.length ===0 && !isLoading){
            console.log("первый раз на экране")
            loading = null

        } else{
            if (!isLoading){
                console.log("ждем загрузку и выводим загрузку")
                loading = <div className="row">
                    {/*<ButtonAppBar />*/}

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
                console.log("выводим фотографии")

                if (json["STATUS"]){
                    console.log("ответ положительный, рисуем фото")

                    let tileData = new Array();

                    json["PAYLOAD"]["result"].forEach(function (item){
                        tileData.push({
                            img: item,
                            title: 'Image',
                            author: 'author'
                        })
                    })


                    loading =    <div className={classes.rootGridImg}>
                                    <GridList cellHeight={500} className={classes.gridList} cols={json["PAYLOAD"]["result"].length} row={3}>
                                        {tileData.map((tile) => (

                                            <GridListTile key={tile.img} cols={3}>
                                                <img src={tile.img} alt={tile.title} />
                                                <GridListTileBar
                                                    title={`Примерная дата посещения: ${tile.img.split("/")[tile.img.split("/").length - 1].slice(0, 8)}`}
                                                    subtitle={<ReactMarkdown>{`Перейти по [ссылке](${tile.img} "Title") на фото в высоком разрешении.`}</ReactMarkdown>}
                                                    actionIcon={
                                                        <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                                            <InfoIcon />
                                                        </IconButton>
                                                    }
                                                />
                                            </GridListTile>
                                        ))}
                                    </GridList>
                                    </div>

                    console.log(tileData)

                } else {
                    console.log("рисуем заглужку")
                    loading = <Typography align="center" variant="h4">Ничего не найдено, попробуйте загрузить др</Typography>
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

                            <Typography align="center" variant="h4">Найти в базе N2D</Typography>

                            <br/>
                            <Typography align="center" variant="h6">Вставьте ссылку или фото лица человека, которого хотите найти</Typography>

                        </Grid>
                        <br/>

                        <form className={classes.input} noValidate autoComplete="off">
                            <TextField id="outlined-basic" label="Поле для ввода" variant="outlined"
                                       inputRef={(ref)=> this.nameTextInput = ref}
                                       helperText = {text}/>

                        </form>


                        <br/>
                        <Grid direction="column" justify="space-around">

                            <Button className={classes.button} onClick={this.handleClick}>Получить</Button>
                            <input
                                accept="image/*"
                                className={classes.inputButton}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={ (e) => this.handleChange(e.target.files) }
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                    Upload
                                </Button>
                            </label>
                        </Grid>

                    </Grid>
                    {loading}

                    {/*<input accept="image/*" className={classes.inputButton} id="icon-button-file" type="file" />*/}
                    {/*<label htmlFor="icon-button-file">*/}
                    {/*    <IconButton color="primary" aria-label="upload picture" component="span">*/}
                    {/*        <PhotoCamera />*/}
                    {/*    </IconButton>*/}
                    {/*</label>*/}



                </div>

            );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default withRouter(Auth)
export default withStyles(useStyles)(withRouter(Main))