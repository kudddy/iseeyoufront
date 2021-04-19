import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";

import React from "react";
import {withStyles} from "@material-ui/styles";
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {red} from "@material-ui/core/colors";
import {CircularProgress} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

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
        background : '#fff',
    },

    rootComment: {
        '& > *': {
            width: '25ch',
        },
    },
    commentStyle: {
        background: "black",
        margin: "0 auto",
        display: 'block',
    },
    input:{
        color: '#fff !important',
        '&.Mui-focused': {
            color: '#fff !important'
        }

    },
    cssOutlinedInput: {
        color: 'white',   // <!-- ADD THIS ONE
        "&$cssFocused $notchedOutline": {
            borderColor: `white !important`
        }
    },
    cssFocused: { color: "white !important" },
    cssLabel: {
        color: "white"
    },
    notchedOutline: {
        borderWidth: "1px",
        borderColor: "white !important"
    },
    iconButton: {
        color: "white",
        padding: 10,

    },
    rootPaper: {
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    imageWidth: {
        margin: "0 auto"
    }
});

class ImageInfo extends React.Component{
    constructor(props) {
        super(undefined);

        this.state = {
            json: [],
            isLoading: false,
            width: null,
            firstInter: true
        }
        this.handleAddComment = this.handleAddComment.bind(this);
    }
    handleBack = ()=>{
        this.probs.history.goBack()
    }
    handleForward = () =>{
        console.log(this.props.history)
        this.probs.history.go(+1)
    }

    componentDidMount(prevProps, prevState, snapshot) {

        const {firstInter } = this.state;

        this.setState({
            width: this.container.offsetWidth,
        })
        // возможно проверка лишняя
        if (firstInter){

            // TODO повтор кода
            let pref_param = replaceAll(this.props.match.params["imgdata"],"-", "/") + ".jpg"

            const img = "https://img1.night2day.ru/" + pref_param

            // запрос на чтение из базы
            const base_url = process.env.REACT_APP_BACKEND_HOST;
            let url = base_url + 'getcomments/';
            // TODO hard code uid model
            // let url = 'getcomments/';
            axios.post(url, {
                MESSAGE_NAME: 'GET_COMMENT',
                PAYLOAD: {
                    url: img
                }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => this.setState({json: res.data, isLoading: true}))
                .catch(err => console.log(err))

            this.setState({
                firstInter: false,
            })
        }

    }


    handleAddComment = () =>{
        console.log(this.nameTextInput.value)


        // грубая проверка на входящие сообщения
        if (this.nameTextInput.value !== ""){

            // готовим ссылку для записи
            let pref_param = replaceAll(this.props.match.params["imgdata"],"-", "/") + ".jpg"

            const img = "https://img1.night2day.ru/" + pref_param

            //пишем в базу данные по фотографии

            const base_url = process.env.REACT_APP_BACKEND_HOST;
            let url = base_url + 'addcomments/';
            // TODO hard code uid model
            // let url = 'getcomments/';
            axios.post(url, {
                MESSAGE_NAME: 'ADD_COMMENT',
                PAYLOAD: {
                    url: img,
                    comment: this.nameTextInput.value
                }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => console.log(res))
                .catch(err => console.log(err))



            const {json } = this.state;

            console.log(json)

            let temp = json["PAYLOAD"]["result"]

            temp.push(this.nameTextInput.value)

            json["PAYLOAD"]["result"] = temp

            this.setState({json: json})

        }


    }

    render() {

        let pref_param = replaceAll(this.props.match.params["imgdata"],"-", "/") + ".jpg"


        const img = "https://img1.night2day.ru/" + pref_param

        const {width, json, isLoading } = this.state;
        const { classes } = this.props;



        let commentsPlug
        let comments = null
        // если еще не загрузилось
        if (!isLoading){
            commentsPlug =  <div className="row">
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


            if (json["STATUS"]) {
                if (json["PAYLOAD"]["result"].length > 0){
                    comments =
                        <div>
                            {json["PAYLOAD"]["result"].map((text) => (
                                <div className={classes.imageWidth} style={{ width: width + "px" }}>
                                    <Typography variant="h5" gutterBottom className={classes.cssFocused}>
                                        {text}
                                    </Typography>
                                </div>

                                    )
                                )
                            }
                        </div>
                }
            }
            commentsPlug =
                <div className={classes.imageWidth} style={{ width: width + "px" }}>
                    <Paper component="form" className={classes.rootPaper} >
                        <TextField label="Ваш комментарий" fullWidth
                                   inputRef={(ref) => this.nameTextInput = ref}
                                   variant="outlined"
                                   color='primary'
                                   InputLabelProps={{
                                       classes: {
                                           root: classes.cssLabel,
                                           focused: classes.cssFocused
                                       }
                                   }}
                                   className={classes.commentStyle}
                                   InputProps={{classes:{
                                           root: classes.cssOutlinedInput,
                                           focused: classes.cssFocused,
                                           notchedOutline: classes.notchedOutline
                                       }
                                   }}/>
                        <Button color="primary"
                                onClick={this.handleAddComment}
                                className={classes.iconButton}>
                            Добавить
                        </Button>
                    </Paper>
                </div>
        }

        return (
            <div className={classes.root}>
                    <img src={img}
                         alt={img}
                         ref={el => (this.container = el)}
                         style={{ display: 'block' , maxWidth: "70%", margin: "0 auto"}}
                    />
                    {comments}
                    {commentsPlug}
            </div>
        )
    }
};
ImageInfo.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(useStyles)(withRouter(ImageInfo))