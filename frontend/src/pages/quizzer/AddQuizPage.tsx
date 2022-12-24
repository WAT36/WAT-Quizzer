import React from "react";
import { Button, Card, CardContent, Container, FormControl, InputLabel, MenuItem, Select, FormGroup, Typography, TextField } from "@material-ui/core"

import { get, post } from "../../common/API";
import QuizzerLayout from "./components/QuizzerLayout";

const messageBoxStyle = {
    'margin'        : '10px 0px 20px',
    'borderStyle'  : 'none'
}

const buttonStyle = {
    'margin'     :  '10px',
}

const typoStyles = {
    title: {
        fontSize: 14,
    },
}

interface AddQuizPageState {
    file_num: number,
    input_data: string,
    message: string,
    messageColor: "error" | "initial" | "inherit" | "primary" | "secondary" | "textPrimary" | "textSecondary" | undefined,
    addLog: any,
    filelistoption: JSX.Element[],
}

export default class AddQuizPage extends React.Component<{},AddQuizPageState>{
    componentDidMount(){
        get("/namelist",(data: any) => {
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

    constructor(props: any){
        super(props);
        this.state = {
            file_num: -1,
            input_data: "",
            message: '　',
            messageColor: 'initial',
        } as AddQuizPageState
    }

    selectedFileChange = (e: any) => {
        this.setState({
            file_num: e.target.value,
        })
    }

    addQuiz = () => {
        if(this.state.file_num === -1){
            this.setState({
                message: 'エラー:問題ファイルを選択して下さい',
                messageColor: 'error',
            })
            return;
        }else if(!this.state.input_data || this.state.input_data === ""){
            this.setState({
                message: 'エラー:追加する問題を入力して下さい',
                messageColor: 'error',
            })
            return;
        }

        post("/add",{
            "file_num": this.state.file_num,
            "data": this.state.input_data
        },(data: any) => {
            if(data.status === 200){
                data = data.body
                this.setState({
                    message: '　',
                    messageColor: 'initial',
                    addLog: data,
                })
                //入力データをクリア
                const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
                if(inputQuizField){
                    inputQuizField.value = "";
                }
            }else{
                this.setState({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        });
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

                    <Typography variant="h6" component="h6" style={messageBoxStyle}>
                        追加する問題（形式：テスト問題,正解,カテゴリ,画像ファイル名）
                    </Typography>

                    <TextField
                        label="追加問題入力"
                        className="input-quiz-fields"
                        multiline
                        placeholder="追加する問題（形式：テスト問題,正解,カテゴリ,画像ファイル名）を何行でも"
                        minRows={6}
                        variant="outlined"
                        onChange={(e) => this.setState({input_data: e.target.value})}
                    />

                </FormGroup>

                <Button 
                    style={buttonStyle} 
                    variant="contained" 
                    color="primary"
                    onClick={(e) => this.addQuiz()}
                    >
                    送信
                </Button>

                <Card variant="outlined">
                    <CardContent>
                        <Typography style={typoStyles.title} color="textSecondary" gutterBottom>
                            --実行ログ--
                        </Typography>
                        <Typography variant="h6" component="h6">
                            {this.state.addLog}
                        </Typography>
                    </CardContent>
                </Card>

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
