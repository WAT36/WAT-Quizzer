import React from "react";
import { Button, Card, CardContent, CardActions, Checkbox, Container, Collapse, FormControl, FormControlLabel, InputLabel, MenuItem, Select, FormGroup, TextField, Typography, Slider } from "@material-ui/core"

import API from "../common/API";

const buttonStyle = {
    'margin'     :  '10px',
}
class SelectQuizPage extends React.Component{
    componentDidMount(){
        API.get("/namelist",(data) => {
            let filelist = []
            for(var i=0;i<data.length;i++){
                filelist.push(<MenuItem value={data[i].file_num}>{data[i].file_nickname}</MenuItem>)
            }
            this.setState({
                filelistoption: filelist,
            })
        })
    }

    constructor(props){
        super(props);
        this.selectedFileChange = this.selectedFileChange.bind(this);
        this.rangeSlider = this.rangeSlider.bind(this);
        this.answerSection = this.answerSection.bind(this);
        this.getQuiz = this.getQuiz.bind(this);
        this.state = {
            expanded: false,
            value: [20,37],
        }
    }

    rangeSlider = () => {
        const handleChange = (event, newValue) => {
            this.setState({value: newValue})
        };
    
        return (
            <>
                <Typography id="range-slider" gutterBottom>
                正解率(%)指定
                </Typography>
                <Slider
                value={this.state.value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                />
            </>
        );
    } 

    selectedFileChange = (e) => {
        API.post("/get_category",{
            "file_num": e.target.value
        },(data) => {
            let categorylist = []
            for(var i=0;i<data.length;i++){
                categorylist.push(<MenuItem value={data[i].category}>{data[i].category}</MenuItem>)
            }
            this.setState({
                file_num: e.target.value,
                categorylistoption: categorylist,
            })
        });
    }

    getQuiz = () => {
        API.post("/get_quiz",{
            "file_num": this.state.file_num,
            "quiz_num": this.state.quiz_num
        },(data) => {
            this.setState({
                quiz_sentense: data[0].quiz_sentense,
                answer: data[0].answer,
            })
        });
    }

    answerSection = () => {
        const handleExpandClick = () => {
            this.setState({expanded: !this.state.expanded})
        };

        return (
            <>
                <CardActions>
                    <Button 
                        size="small"
                        onClick={handleExpandClick}
                        aria-expanded={this.state.expanded}
                    >答え
                    </Button>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography variant="subtitle1" component="h2">
                            {this.state.answer}
                        </Typography>
                    </CardContent>
                </Collapse>
            </>
        )
    }

    render() {
        return (
            <Container>
                <h1>WAT Quizzer</h1>
                <FormGroup>
                    <FormControl>
                        <InputLabel id="quiz-file-input">問題ファイル</InputLabel>
                        <Select
                            labelId="quiz-file-name"
                            id="quiz-file-id"
                            defaultValue={-1}
                            // value={age}
                            onChange={(e) => this.selectedFileChange(e)}
                        >
                            <MenuItem value={-1}>選択なし</MenuItem>
                            {this.state.filelistoption}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <TextField 
                            label="問題番号" 
                            onChange={(e) => { this.setState({quiz_num: e.target.value}); }}
                        />
                    </FormControl>

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">カテゴリ</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={-1}
                            // value={age}
                            onChange={(e) => { this.setState({selected_category: e.target.value})}}
                        >
                            <MenuItem value={-1}>選択なし</MenuItem>
                            {this.state.categorylistoption}
                        </Select>
                    </FormControl>

                    <FormControl>
                        {this.rangeSlider()}
                    </FormControl>

                    <FormControl>
                        <FormControlLabel
                            value="only-checked"
                            control={<Checkbox color="primary" />}
                            label="チェック済から出題"
                            labelPlacement="start"
                        />
                    </FormControl>
                </FormGroup>

                <Button 
                    style={buttonStyle} 
                    variant="contained" 
                    color="primary"
                    onClick={(e) => this.getQuiz()}>
                    出題
                </Button>
                <Button style={buttonStyle} variant="contained" color="secondary">
                    ランダム出題
                </Button>
                <Button style={buttonStyle} variant="contained" color="secondary">
                    最低正解率問出題
                </Button>
                <Button style={buttonStyle} variant="contained" color="secondary">
                    最小正解数問出題
                </Button>
                <Button style={buttonStyle} variant="contained" color="default">
                    答え
                </Button>
                <Button style={buttonStyle} variant="contained" color="default" disabled>
                    画像表示
                </Button>

                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            問題
                        </Typography>
                        <Typography variant="subtitle1" component="h2">
                            {this.state.quiz_sentense}
                        </Typography>
                    </CardContent>
                    {this.answerSection()}
                </Card>


            </Container>
        )
    }

}

export default SelectQuizPage;