import React from "react";
import { Button, Card, CardContent, Checkbox, Container,  FormControl, FormControlLabel, InputLabel, MenuItem, Select, FormGroup, TextField, Typography, Slider } from "@material-ui/core"
import { DataGrid } from '@material-ui/data-grid';

import API from "../common/API";
import QuizzerLayout from "./components/QuizzerLayout";

const buttonStyle = {
    'margin'     :  '10px',
}

const messageBoxStyle = {
    'margin'        : '10px 0px 20px',
    'borderStyle'  : 'none'
}

const columns = [
    {   
        field: 'quiz_num', 
        headerName: '問題番号', 
    },
    {
        field: 'checked',
        headerName: 'チェック',
    },
    {
        field: 'question',
        headerName: '問題',
    },
    {
        field: 'answer',
        headerName: '答え',
    },
    {
        field: 'category',
        headerName: 'カテゴリ',
    },
];

export default class SearchQuizPage extends React.Component{
    componentDidMount(){
        API.get("/namelist",(data) => {
            if(data.status === 200){
                data = data.body
                let filelist = []
                for(var i=0;i<data.length;i++){
                    filelist.push(<MenuItem value={data[i].file_num} key={data[i].file_num}>{data[i].file_nickname}</MenuItem>)
                }
                this.setState({
                    filelistoption: filelist,
                })
            }else{
                this.setState({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        })
    }

    constructor(props){
        super(props);
        this.selectedFileChange = this.selectedFileChange.bind(this);
        this.rangeSlider = this.rangeSlider.bind(this);
        this.state = {
            file_num: -1,
            expanded: false,
            value: [0,100],
            checked: false,
            message: '　',
            messageColor: 'initial',
            searchResult: [],
        }
    }

    selectedFileChange = (e) => {
        API.post("/get_category",{
            "file_num": e.target.value
        },(data) => {
            if(data.status === 200){
                data = data.body
                let categorylist = []
                for(var i=0;i<data.length;i++){
                    categorylist.push(<MenuItem value={data[i].category} key={i}>{data[i].category}</MenuItem>)
                }
                this.setState({
                    file_num: e.target.value,
                    categorylistoption: categorylist,
                })
            }else{
                this.setState({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        });
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

    contents = () => {
        return (
            <Container>
                <h1>WAT Quizzer</h1>

                <Card variant="outlined" style={messageBoxStyle}>
                    <CardContent>
                        <Typography variant="h6" component="h6" color={this.state.messageColor}>
                            {this.state.message}
                        </Typography>
                    </CardContent>
                </Card>

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
                            <MenuItem value={-1} key={-1}>選択なし</MenuItem>
                            {this.state.filelistoption}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <TextField 
                            label="検索語句" 
                            //onChange={(e) => { this.setState({quiz_num: e.target.value}); }}
                        />
                    </FormControl>

                    <FormGroup row>
                        検索対象：
                        <FormControlLabel
                            control={
                            <Checkbox 
                                //onChange={handleChange} 
                                name="checkedA" 
                            />}
                            label="問題"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                                //onChange={handleChange}
                                name="checkedB"
                            />}
                            label="答え"
                        />
                    </FormGroup>

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">カテゴリ</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={-1}
                            // value={age}
                            onChange={(e) => {this.setState({selected_category: e.target.value})}}
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
                            onChange={(e) => this.setState({checked: e.target.checked})}
                        />
                    </FormControl>
                </FormGroup>

                <Button 
                    style={buttonStyle} 
                    variant="contained" 
                    color="primary"
                    //onClick={(e) => this.getQuiz()}
                    >
                    検索
                </Button>

                <DataGrid 
                    rows={this.state.searchResult}
                    columns={columns}
                    pageSize={25}
                    checkboxSelection
                />

            </Container>
        )
    }

    render() {
        return (
            <>
                <QuizzerLayout 
                    contents={this.contents()}
                />
            </>
        )
    }

}
