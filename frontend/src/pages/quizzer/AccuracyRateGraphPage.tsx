import React from "react";
import { Button, Card, CardContent, Container, FormControl, InputLabel, MenuItem, Select, FormGroup, Typography } from "@material-ui/core"
import { Chart } from "react-google-charts";

import { get, post } from "../../common/API";
import QuizzerLayout from "./components/QuizzerLayout";

const messageBoxStyle = {
    'margin'        : '10px 0px 20px',
    'borderStyle'  : 'none'
}

const buttonStyle = {
    'margin'     :  '10px',
}


export default class AccuracyRateGraphPage extends React.Component{
    componentDidMount(){
        get("/namelist",(data) => {
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
        this.displayChart = this.displayChart.bind(this);
        this.state = {
            file_num: -1,
            message: '　',
            messageColor: 'initial',
        }
    }

    getAccuracy = () => {
        if(this.state.file_num === -1){
            this.setState({
                message: 'エラー:問題ファイルを選択して下さい',
                messageColor: 'error',
            })
            return;
        }

        post("/category/accuracy_rate",{
            "file_num": this.state.file_num
        },(data) => {
            if(data.status === 200){
                data = data.body
                this.setState({
                    accuracy_data: data,
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

    updateCategory = () => {
        if(this.state.file_num === -1){
            this.setState({
                message: 'エラー:問題ファイルを選択して下さい',
                messageColor: 'error',
            })
            return;
        }

        post("/category/renewal",{
            "file_num": this.state.file_num
        },(data) => {
            if(data.status === 200){
                data = data.body
                this.setState({
                    message: '指定問題ファイルへのカテゴリ更新に成功しました',
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

    displayChart = () => {

        const display_data = this.state.accuracy_data

        // データがない場合は何もしない
        if(display_data === undefined 
            || display_data === null 
            || display_data.result === undefined 
            || display_data.checked_result === undefined){
            return;
        }

        let visualized_data = [
            [
                'Name', 
                'Accuracy_Rate', 
                { role: 'style' }, 
                { role: 'annotation' } 
            ],
            // ["Copper", 8.94, "#b87333", null],
            // ["Silver", 10.49, "silver", null],
            // ["Gold", 19.3, "gold", null],
            // ["Platinum", 21.45, "color: #e5e4e2", null],
        ];

        // チェック済データ追加
        let checked_rate = display_data.checked_result
        for(let i=0;i<checked_rate.length;i++){
            let annotation_i = String(Math.round(parseFloat(checked_rate[i].accuracy_rate) *10)/10)+'% / '+String(checked_rate[i].count)+'問'
            visualized_data.push(['(チェック済問題)',parseFloat(checked_rate[i].accuracy_rate),'#32CD32',annotation_i])
        }

        // カテゴリ毎のデータ追加
        let category_rate = display_data.result
        for(let i=0;i<category_rate.length;i++){
            let annotation_i = String(Math.round(parseFloat(category_rate[i].accuracy_rate) *10)/10)+'% / '+String(category_rate[i].count)+'問'
            visualized_data.push([category_rate[i].c_category,parseFloat(category_rate[i].accuracy_rate),'#76A7FA',annotation_i])
        }

        // グラフ領域の縦の長さ（＝40 * データの個数）
        let graph_height = 40 * visualized_data.length

        const options = {
            height: graph_height,
            legend: { position: "none" },
            chartArea: {
                left: '15%',
                top: 10,
                width: '75%',
                height: graph_height-50
            },
            hAxis: {
                minValue: 0,
                maxValue: 1
            }
        };

        return (
            <>
                <Chart 
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={visualized_data}
                    options={options}
                />
            </>
        )
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
                            onChange={(e) => {this.setState({file_num: e.target.value});}}
                        >
                            <MenuItem value={-1} key={-1}>選択なし</MenuItem>
                            {this.state.filelistoption}
                        </Select>
                    </FormControl>

                </FormGroup>

                <Button 
                    style={buttonStyle} 
                    variant="contained" 
                    color="primary"
                    onClick={(e) => this.getAccuracy()}
                    >
                    正解率表示
                </Button>

                <Button 
                    style={buttonStyle} 
                    variant="contained" 
                    color="primary"
                    onClick={(e) => this.updateCategory()}
                    >
                    カテゴリ更新
                </Button>

                {this.displayChart()}

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
