import React from "react";
import { Card, CardContent, Container, FormControl, InputLabel, MenuItem, Select, FormGroup, Typography } from "@material-ui/core"

import API from "../common/API";
import QuizzerLayout from "./components/QuizzerLayout";

const messageBoxStyle = {
    'margin'        : '10px 0px 20px',
    'borderStyle'  : 'none'
}

export default class AddQuizPage extends React.Component{
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
        this.state = {
            file_num: -1,
            message: '　',
            messageColor: 'initial',
        }
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
                            // onChange={(e) => this.selectedFileChange(e)}
                        >
                            <MenuItem value={-1} key={-1}>選択なし</MenuItem>
                            {this.state.filelistoption}
                        </Select>
                    </FormControl>


                </FormGroup>


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
