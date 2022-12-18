import React from "react";
import { Button, Card, CardContent, Container, FormControl, InputLabel, MenuItem, Paper, Select, FormGroup, Typography, TextField } from "@material-ui/core"

import { get, post } from "../../common/API";
import QuizzerLayout from "./components/QuizzerLayout";

const messageBoxStyle = {
    'margin'        : '10px 0px 20px',
    'borderStyle'  : 'none'
}

const buttonStyle = {
    'margin'     :  '10px',
}

const paperStyle = {
    'width': '40%',
    'float': 'left' as "left",
    'margin' : '5px',
}

interface DeleteQuizPageState {
    file_num: number,
    message: string,
    messageColor: "error" | "initial" | "inherit" | "primary" | "secondary" | "textPrimary" | "textSecondary" | undefined,
    filelistoption: JSX.Element[],
    quiz_num: number,
    get_file_num: number | null,
    get_quiz_num: number | null,
    question: string,
    answer: string,
    category: string,
    image: string,
    integrate_to_quiz_num: number | null,
    integrate_to_question: string,
    integrate_to_answer: string,
    integrate_to_category: string,
    integrate_to_image: string,
}

export default class DeleteQuizPage extends React.Component<{},DeleteQuizPageState>{
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
            message: '　',
            messageColor: 'initial',
        } as DeleteQuizPageState
    }

    getQuiz = () => {
        if(this.state.file_num === -1){
            this.setState({
                message: 'エラー:問題ファイルを選択して下さい',
                messageColor: 'error',
            })
            return;
        }else if(!this.state.quiz_num){
            this.setState({
                message: 'エラー:問題番号を入力して下さい',
                messageColor: 'error',
            })
            return;
        }

        post("/get_quiz",{
            "file_num": this.state.file_num,
            "quiz_num": this.state.quiz_num
        },(data: any) => {
            if(data.status === 200){
                data = data.body
                this.setState({
                    get_file_num: data[0].file_num,
                    get_quiz_num: data[0].quiz_num,
                    question: data[0].quiz_sentense,
                    answer: data[0].answer,
                    category: data[0].category,
                    image: data[0].img_file,
                    message: '　',
                    messageColor: 'initial',
                })
            }else if(data.status === 404){
                this.setState({
                    message: 'エラー:条件に合致するデータはありません',
                    messageColor: 'error',
                })
            }else{
                this.setState({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        });
    }

    getIntegrateToQuiz = () => {
        if(this.state.file_num === -1){
            this.setState({
                message: 'エラー:問題ファイルを選択して下さい',
                messageColor: 'error',
            })
            return;
        }else if(!this.state.integrate_to_quiz_num){
            this.setState({
                message: 'エラー:問題番号を入力して下さい',
                messageColor: 'error',
            })
            return;
        }

        post("/get_quiz",{
            "file_num": this.state.get_file_num,
            "quiz_num": this.state.integrate_to_quiz_num
        },(data: any) => {
            if(data.status === 200){
                data = data.body
                this.setState({
                    integrate_to_quiz_num: data[0].quiz_num,
                    integrate_to_question: data[0].quiz_sentense,
                    integrate_to_answer: data[0].answer,
                    integrate_to_category: data[0].category,
                    integrate_to_image: data[0].img_file,
                    message: '　',
                    messageColor: 'initial',
                })
            }else if(data.status === 404){
                this.setState({
                    message: 'エラー:条件に合致するデータはありません',
                    messageColor: 'error',
                })
            }else{
                this.setState({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        });
    }

    deleteQuiz = () => {
        if( !this.state.get_file_num || !this.state.get_quiz_num ){
            this.setState({
                message: 'エラー:削除する問題を取得して下さい',
                messageColor: 'error',
            })
            return;
        }

        post("/delete",{
            "file_num": this.state.get_file_num,
            "quiz_num": this.state.get_quiz_num
        },(data: any) => {
            if(data.status === 200){
                data = data.body
                let quiz_num = '['+this.state.get_file_num+'-'+this.state.get_quiz_num+']'
                this.setState({
                    message: 'Success! 削除に成功しました'+quiz_num,
                    messageColor: 'initial',
                    get_file_num: null,
                    get_quiz_num: null,
                    question: "",
                    answer: "",
                    category: "",
                    image: "",
                })
            }else if(data.status === 404){
                this.setState({
                    message: 'エラー:条件に合致するデータはありません',
                    messageColor: 'error',
                })
            }else{
                this.setState({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        });
    }

    integrateQuiz = () => {
        if( !this.state.get_file_num || !this.state.get_quiz_num ){
            this.setState({
                message: 'エラー:統合元(左)の問題を取得して下さい',
                messageColor: 'error',
            })
            return;
        }else if( !this.state.get_file_num || !this.state.integrate_to_quiz_num ){
            this.setState({
                message: 'エラー:統合先(右)の問題を取得して下さい',
                messageColor: 'error',
            })
            return;
        }

        post("/integrate",{
            "pre_file_num": this.state.get_file_num,
            "pre_quiz_num": this.state.get_quiz_num,
            "post_file_num": this.state.get_file_num,
            "post_quiz_num": this.state.integrate_to_quiz_num
        },(data: any) => {
            if(data.status === 200){
                data = data.body
                let quiz_num = '['+this.state.get_file_num+':'+this.state.get_quiz_num+'->'+this.state.integrate_to_quiz_num+']'
                this.setState({
                    message: 'Success! 統合に成功しました'+quiz_num,
                    messageColor: 'initial',
                    get_file_num: null,
                    get_quiz_num: null,
                    question: "",
                    answer: "",
                    category: "",
                    image: "",
                    integrate_to_quiz_num: null,
                    integrate_to_question: "",
                    integrate_to_answer: "",
                    integrate_to_category: "",
                    integrate_to_image: "",
                })
            }else if(data.status === 404){
                this.setState({
                    message: 'エラー:条件に合致するデータはありません',
                    messageColor: 'error',
                })
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

                <Paper variant="outlined" style={paperStyle}>
                    <Card variant="outlined">
                        <CardContent>

                            <Typography variant="h6" component="h6">
                                削除する(統合元の)問題
                            </Typography>
                            
                            <FormGroup>
                                <FormControl>
                                    <InputLabel id="quiz-file-input">問題ファイル</InputLabel>
                                    <Select
                                        labelId="quiz-file-name"
                                        id="quiz-file-id"
                                        defaultValue={-1}
                                        // value={age}
                                        onChange={(e) => {this.setState({file_num: Number(e.target.value)});}}
                                    >
                                        <MenuItem value={-1} key={-1}>選択なし</MenuItem>
                                        {this.state.filelistoption}
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <TextField 
                                        label="問題番号" 
                                        onChange={(e) => { this.setState({quiz_num: Number(e.target.value)}); }}
                                    />
                                </FormControl>
                            </FormGroup>

                            <Button 
                                style={buttonStyle} 
                                variant="contained" 
                                color="primary"
                                onClick={(e) => this.getQuiz()}
                                >
                                問題取得
                            </Button>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                ファイル：{this.state.get_file_num}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                問題番号：{this.state.get_quiz_num}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                問題　　：{this.state.question}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                答え　　：{this.state.answer}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                カテゴリ：{this.state.category}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                画像　　：{this.state.image}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Button 
                        style={buttonStyle} 
                        variant="contained" 
                        color="primary"
                        onClick={(e) => this.deleteQuiz()}
                        >
                        削除
                    </Button>
                </Paper>



                <Paper variant="outlined" style={paperStyle}>
                    <Card variant="outlined">
                        <CardContent>

                            <Typography variant="h6" component="h6">
                                統合先の問題
                            </Typography>
                            
                            <FormGroup>
                                <FormControl disabled>
                                    <InputLabel id="quiz-file-input">問題ファイル</InputLabel>
                                    <Select
                                        labelId="quiz-file-name"
                                        id="quiz-file-id"
                                        defaultValue={this.state.file_num || -1}
                                        // value={age}
                                        //onChange={(e) => {this.setState({file_num: e.target.value});}}
                                    >
                                        <MenuItem value={-1} key={-1}>同左</MenuItem>
                                        {this.state.filelistoption}
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <TextField 
                                        label="問題番号" 
                                        onChange={(e) => { this.setState({integrate_to_quiz_num: Number(e.target.value)}); }}
                                    />
                                </FormControl>
                            </FormGroup>

                            <Button 
                                style={buttonStyle} 
                                variant="contained" 
                                color="primary"
                                onClick={(e) => this.getIntegrateToQuiz()}
                                >
                                問題取得
                            </Button>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                ファイル：{this.state.get_file_num}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                問題番号：{this.state.integrate_to_quiz_num}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                問題　　：{this.state.integrate_to_question}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                答え　　：{this.state.integrate_to_answer}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                カテゴリ：{this.state.integrate_to_category}
                            </Typography>

                            <Typography variant="h6" component="h6" style={messageBoxStyle}>
                                画像　　：{this.state.integrate_to_image}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Button 
                        style={buttonStyle} 
                        variant="contained" 
                        color="primary"
                        onClick={(e) => this.integrateQuiz()}
                        >
                        統合
                    </Button>
                </Paper>

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
