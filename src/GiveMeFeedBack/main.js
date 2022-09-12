import React from "react"
import {Avatar, CircularProgress, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/styles";
import {withRouter} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";

const useStyles = (theme) => ({
    root: {

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
    },
    loader: {
        alignItems: 'center'
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
    cssFocused: {
        color: "white !important"
    },
    cssLabel: {
        color: "white"
    },
    notchedOutline: {
        borderWidth: "1px",
        borderColor: "white !important"
    },
    infoText:{
        color: "#a0a0a0"
}})

const colors = ["blue", "red", "green"]

const names = ["Петруха", "Клавдий Петрович", "Анфиса Чехова", "Гарлапаша Маркизовна",
    "Юлианна Караулова", "Света", "Dima", "Konfeta", "Alex", "Ornaldo"]


class GiveMeFeedBack extends React.Component{
    constructor(props) {
        super(undefined);
        this.state = {
            isLoading: false
        }
    }

    componentDidMount(prevProps, prevState, snapshot) {
        let url
        const { REACT_APP_DEV_MODE } = process.env;

        // запрос на чтение из базы
        // if (REACT_APP_DEV_MODE === "true"){
        const base_url = process.env.REACT_APP_BACKEND_HOST;
        url = base_url + '/iseeyou/getfeedback';
        // } else {
        //     url = 'getfeedback/';
        // }

        axios.post(url, {
            MESSAGE_NAME: 'GET_FEEDBACK',
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => this.setState({json: res.data, isLoading: true}))
            .catch(err => console.log(err))

    }

    handleAddFeedback = () =>{

        if (this.nameTextInput.value !== ""){


            //пишем в базу данные по фотографии
            // содержит путь к ручкам сервиса, для дев режима одни, для пром другие. Помогает отладить приложение
            let url
            // check dev mode
            const { REACT_APP_DEV_MODE } = process.env;

            // if (REACT_APP_DEV_MODE === "true"){
            const base_url = process.env.REACT_APP_BACKEND_HOST;
            url = base_url + '/iseeyou/addfeedback';
            // } else {
            //     url = 'addfeedback/';
            // }

            axios.post(url, {
                MESSAGE_NAME: 'ADD_FEEDBACK',
                PAYLOAD: {
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


            let temp = json["PAYLOAD"]["result"]

            temp.push(this.nameTextInput.value)

            json["PAYLOAD"]["result"] = temp

            this.setState({json: json})
            // обнуляем переменную
            this.nameTextInput.value= null

        }

    }

    render(){

        const { classes } = this.props;

        const { json, isLoading } = this.state;

        let commentsPlug
        let comments = null

        // отзывы и комментарии
        if (!isLoading){
            commentsPlug =
                <div className="row" style={{position: 'relative', top: "20px"}}>
                    <CircularProgress style={{marginLeft: '50%'}}/>
                </div>
        } else {
            if (json["STATUS"]) {
                if (json["PAYLOAD"]["result"].length > 0){
                    comments =
                        <div>
                            {json["PAYLOAD"]["result"].map((text) => (

                                    <div className={classes.imageWidth}>
                                        <div style={{ display: "inline-flex" }}>
                                            <Avatar style={{background:colors[Math.floor(Math.random() * colors.length)]}}>H</Avatar>
                                            <div style={{ display: "compact" }}>
                                                <Typography variant="subtitle1" gutterBottom className={classes.cssFocused} style={{textIndent:"5px", marginTop:"-3px"}}>
                                                    { names[Math.floor(Math.random() * names.length)]}
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom className={classes.cssFocused} style={{textIndent:"5px", marginTop:"-12px"}}>
                                                    05.11.2020
                                                </Typography>
                                            </div>
                                        </div>
                                        <Typography variant="h5" gutterBottom className={classes.cssFocused} style={{textIndent:"45px", marginTop:"-12px"}}>
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
                <div className={classes.imageWidth}>
                    <Paper component="form" className={classes.rootPaper} >
                        <TextField label="Ваш отзыв" fullWidth
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
                                onClick={this.handleAddFeedback}
                                className={classes.iconButton}>
                            Добавить
                        </Button>
                    </Paper>
                </div>
        }



        let headerText =
            <Typography
                align="center"
                variant="h4"
                className={classes.infoText}
            >
            Крайние отзывы наших пользователей!
            </Typography>
        return(
            <div className={classes.root}>
                {headerText}
                {comments}
                {commentsPlug}
            </div>
        )
    }
}

GiveMeFeedBack.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(useStyles)(withRouter(GiveMeFeedBack))