import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";

import React from "react";
import {withStyles} from "@material-ui/styles";

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';

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
    }
});

class ImageInfo extends React.Component{
    constructor(props) {
        super(undefined);

        this.state = {
            AuthState: false,
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

    handleAddComment = () =>{
        console.log(this.nameTextInput.value)
    }

    render() {

        const { classes } = this.props;


        let pref_param = replaceAll(this.props.match.params["imgdata"],"-", "/") + ".jpg"


        const img = "https://img1.night2day.ru/" + pref_param

        return (
            <div className={classes.root}>
                    <img src={img} alt={img} style={{ display: 'block' , maxWidth: "70%", margin: "0 auto"}}/>
                <div>
                    <Paper component="form" className={classes.rootPaper}>
                        <TextField label="Ваш комментарий" fullWidth
                                   ref={(ref) => this.nameTextInput = ref}
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
                    <IconButton type="submit"
                                onClick={this.handleAddComment}
                                className={classes.iconButton}
                                aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    </Paper>
                </div>
            </div>
        )
    }
};
ImageInfo.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(useStyles)(withRouter(ImageInfo))