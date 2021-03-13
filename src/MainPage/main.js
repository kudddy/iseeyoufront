import React from 'react';
import './index.css';
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import PropTypes from "prop-types";

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
    },
    buttonMore:{
        textAlign:'center'
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
        // for local debug
        const base_url = process.env.REACT_APP_BACKEND_HOST;
        let url = base_url + 'check_similarity/7dbbccad-a746-4f3d-ac3a-e22327e1bcf9/0.6/45/';
        // TODO hard code uid model
        // let url = 'check_similarity/7dbbccad-a746-4f3d-ac3a-e22327e1bcf9/0.6/9/';
        axios.post(url, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => this.setState({json: res.data, isLoading: true}))
            .catch(err => console.log(err))
    }

    handleRedirect(img){

        let img_info = img.split("ru/")[1]
            .split('.')[0].replaceAll('/','-')

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
                    // проверяем теорию со слайсом
                    // нужно проверить


                    slicePayload = json["PAYLOAD"]["result"].slice(Position[0], Position[1])


                    // проверка на слайс
                    if (slicePayload.length>0){
                        slicePayload.forEach(function (item){
                            tileData.push({
                                img: item,
                                title: 'Image',
                                author: 'author'
                            })
                        })

                        const buttonGetMore = <Button variant="contained" color="primary" onClick={() => this.handleModePic()}>Еще</Button>

                        loading =    <div><div className={classes.rootGridImg}>
                            <GridList cellHeight={500} className={classes.gridList} cols={slicePayload.length} row={3}>
                                {tileData.map((tile) => (

                                    <GridListTile key={tile.img} cols={3}>
                                        <img src={tile.img} alt={tile.title} />
                                        <GridListTileBar
                                            title={`Дата посещения: ${tile.img.split("/")[tile.img.split("/").length - 1].slice(0, 8)}`}
                                            // subtitle={<ReactMarkdown>{`Перейти по [ссылке](${tile.img} "Title") на фото в высоком разрешении.`}</ReactMarkdown>}
                                            subtitle={`Высокое разрешение --->`}
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
                            <div className={classes.buttonMore}>
                                {buttonGetMore}
                            </div>

                        </div>

                    } else {

                        loading = <Typography align="center" variant="h4">У нас все, загрузите еще фотоографию для
                            продолжения.</Typography>
                    }








                } else {
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
                            <Typography align="center" variant="h4">Найди меня в отражении огней ночной тусовке</Typography>

                            <br/>
                            <Typography align="center" variant="h6">Загрузите фотографию человека и мы поможем вам найти его</Typography>

                        </Grid>
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
                                <Button variant="contained" color="primary" component="span">
                                    Upload
                                </Button>
                            </label>
                        </Grid>
                        {loading}
                    </Grid>

                </div>

            );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default withRouter(Auth)
export default withStyles(useStyles)(withRouter(Main))