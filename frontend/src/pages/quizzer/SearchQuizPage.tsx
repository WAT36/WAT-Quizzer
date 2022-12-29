import React from "react";
import { Button, Card, CardContent, Checkbox, Container,  FormControl, FormControlLabel, InputLabel, MenuItem, Select, FormGroup, TextField, Typography, Slider } from "@material-ui/core"
import { DataGrid, GridRowsProp, GridSelectionModel } from '@material-ui/data-grid';

import { baseURL, get, post } from "../../common/API";
import QuizzerLayout from "./components/QuizzerLayout";

const buttonStyle = {
    'margin'     :  '10px',
}

const messageBoxStyle = {
    'margin'        : '10px 0px 20px',
    'borderStyle'  : 'none'
}

const searchedTableStyle = { 
    'height': 600, 
    'width': '100%' 
}

const groupStyle = {
    'border': 'solid thin lightgray',
    'border-radius': '5px',
    'margin': '10px 0px',
    'padding': '0px 5px',
    'align-items': 'center',
}

const columns = [
    {   
        field: 'id', 
        headerName: 'ID', 
        sortable: false,
        width: 75,
    },
    {
        field: 'checked',
        headerName: '✅',
        sortable: false,
        width: 75,
        //valueGetter: (params) => params.getValue(params.id, 'checked') === 1 ? '✅' : '',
    },
    {
        field: 'quiz_sentense',
        headerName: '問題',
        sortable: false,
        width: 300,
    },
    {
        field: 'answer',
        headerName: '答え',
        sortable: false,
        width: 300,
    },
    {
        field: 'category',
        headerName: 'カテゴリ',
        sortable: false,
        width: 250,
    },
    {
        field: 'accuracy_rate',
        headerName: '正解率',
        sortable: true,
        width: 150,
    },
];

interface SearchQuizPageState {
    file_num: number,
    value: number[] | number,
    checked: boolean,
    message: string,
    messageColor: "error" | "initial" | "inherit" | "primary" | "secondary" | "textPrimary" | "textSecondary" | undefined,
    searchResult: GridRowsProp,
    query: string,
    selected_category: string,
    cond_question: boolean,
    cond_answer: boolean,
    filelistoption: JSX.Element[],
    categorylistoption: JSX.Element[],
    checkedIdList: number[],
    changedCategory: string,
}

export default class SearchQuizPage extends React.Component<{},SearchQuizPageState>{
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
        this.selectedFileChange = this.selectedFileChange.bind(this);
        this.rangeSlider = this.rangeSlider.bind(this);
        this.state = {
            file_num: -1,
            value: [0, 100],
            checked: false,
            message: '　',
            messageColor: 'initial',
            searchResult: [] as GridRowsProp,
            checkedIdList: [] as number[],
            changedCategory: "",
        } as SearchQuizPageState
    }

    selectedFileChange = (e: any) => {
        post("/get_category",{
            "file_num": e.target.value
        },(data: any) => {
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
        const handleChange = (event: React.ChangeEvent<{}>, newValue: number[] | number ) => {
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

    searchQuiz = () => {
        if(this.state.file_num === -1){
            this.setState({
                message: 'エラー:問題ファイルを選択して下さい',
                messageColor: 'error',
            })
            return;
        }

        post("/search",{
            "file_num": this.state.file_num,
            "query" : this.state.query || "",
            "category": this.state.selected_category === "" ? null : this.state.selected_category,
            "min_rate": Array.isArray(this.state.value) ? this.state.value[0] : this.state.value,
            "max_rate": Array.isArray(this.state.value) ? this.state.value[1] : this.state.value,
            "cond": {
                "question": this.state.cond_question,
                "answer": this.state.cond_answer,
            }
        },(data: any) => {
            if(data.status === 200){
                data = data.body
                this.setState({
                    searchResult: data,
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

    // チェックした問題のIDをステートに登録
    checkedIdList = (selectionModel: GridSelectionModel, details?: any) => {
        this.setState({
            checkedIdList: selectionModel as number[]
        })
    }

    // チェックした問題に指定カテゴリを一括登録する
    registerCategoryToChecked = async () => {
        if(this.state.checkedIdList.length === 0){
            this.setState({
                message: 'エラー:チェックされた問題がありません',
                messageColor: 'error',
            })
            return;
        }else if(this.state.changedCategory === ""){
            this.setState({
                message: 'エラー:一括登録するカテゴリ名を入力して下さい',
                messageColor: 'error',
            })
            return;
        }

        // チェックした問題にカテゴリを登録
        const failureIdList: number[] = []
        for(const checkedId of this.state.checkedIdList){
            const result = await fetch(baseURL + "/edit/category/add",{
                method: 'POST',
                body: JSON.stringify({
                        "file_num": this.state.file_num,
                        "quiz_num": checkedId,
                        "category": this.state.changedCategory,
                    }),
                headers: { 'Content-Type': 'application/json' }
            })
            if(result.status !== 200){
                failureIdList.push(checkedId)
            }
        }

        let message: string;
        let messageColor: "error" | "initial"
        if(failureIdList.length > 0){
            message = `エラー:問題ID[${failureIdList.join()}]へのカテゴリ登録に失敗しました（${this.state.checkedIdList.length - failureIdList.length}/${this.state.checkedIdList.length}件登録成功）`;
            messageColor = 'error';
        }else{
            message = `チェック問題(${this.state.checkedIdList.length}件)へのカテゴリ登録に成功しました`;
            messageColor = 'initial';
        }

        // 終わったらチェック全て外す、入力カテゴリも消す
        this.setState({
            checkedIdList: [],
            changedCategory: "",
            message,
            messageColor
        })
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
                            onChange={(e) => { this.setState({query: e.target.value}); }}
                        />
                    </FormControl>

                    <FormGroup row>
                        検索対象：
                        <FormControlLabel
                            control={
                            <Checkbox 
                                onChange={(e) => { this.setState({cond_question: e.target.checked}); }}
                                name="checkedA" 
                            />}
                            label="問題"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                                onChange={(e) => { this.setState({cond_answer: e.target.checked}); }}
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
                            onChange={(e) => {this.setState({selected_category: String(e.target.value)})}}
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
                            control={<Checkbox color="primary" onChange={(e) => this.setState({checked: e.target.checked})} />}
                            label="チェック済から出題"
                            labelPlacement="start"
                        />
                    </FormControl>
                </FormGroup>

                <Button 
                    style={buttonStyle} 
                    variant="contained" 
                    color="primary"
                    onClick={(e) => this.searchQuiz()}
                    >
                    検索
                </Button>

                <div style={searchedTableStyle}>
                    <DataGrid 
                        rows={this.state.searchResult}
                        columns={columns}
                        pageSize={15}
                        checkboxSelection
                        disableSelectionOnClick
                        onSelectionModelChange={(selectionModel,details) => this.checkedIdList(selectionModel,details)}
                    />
                </div>

                <FormGroup style={groupStyle} row>
                    チェックした問題全てにカテゴリ「
                    <FormControl>
                        <TextField
                            id="change-category"
                            value={this.state.changedCategory}
                            onChange={(e:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => this.setState({changedCategory: e.target.value})}
                        />
                    </FormControl>
                    」を
                    <FormControl>
                        <Button 
                            style={buttonStyle} 
                            variant="contained" 
                            color="primary"
                            onClick={async (e) => await this.registerCategoryToChecked()}
                            >
                            一括カテゴリ登録
                        </Button>
                    </FormControl>
                    or
                    <FormControl>
                        <Button 
                            style={buttonStyle} 
                            variant="contained" 
                            color="primary"
                            //onClick={async (e) => await this.registerCategoryToChecked()}
                            >
                            一括カテゴリ削除
                        </Button>
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
