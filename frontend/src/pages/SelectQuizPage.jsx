import React from "react";
import { Button, Card, CardContent, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, FormGroup, TextField, Typography, Slider } from "@material-ui/core"

const buttonStyle = {
    'margin'     :  '10px',
}
class SelectQuizPage extends React.Component{
    componentDidMount(){
        fetch('http://localhost:4000/namelist')
            .then(response => response.json())
            .then(data => {
                let filelist = []
                for(var i=0;i<data.length;i++){
                    filelist.push(<MenuItem value={data[i].file_num}>{data[i].file_nickname}</MenuItem>)
                }
                this.setState({
                    filelistoption: filelist,
                })
            }).catch(error => {
                console.error("componentDidMount:",error)
            });
        
        fetch('http://localhost:4000/get_category',{
                method: 'POST',
                body: JSON.stringify({
                    "file_num": 1
                }),
                headers: {'Content-Type': 'application/json'},
            })
            .then(response => response.json())
            .then(data => {
                let categorylist = []
                for(var i=0;i<data.length;i++){
                    categorylist.push(<MenuItem value={data[i].category}>{data[i].category}</MenuItem>)
                }
                this.setState({
                    categorylistoption: categorylist,
                })
            }).catch(error => {
                console.error("componentDidMount:",error)
            });
    }

    constructor(props){
        super(props);
        this.selectedFileChange = this.selectedFileChange.bind(this);
        this.rangeSlider = this.rangeSlider.bind(this);
        this.state = {
            value: [20,37]
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

        fetch('http://localhost:4000/get_category',{
                method: 'POST',
                body: JSON.stringify({
                    "file_num": e.target.value
                }),
                headers: {'Content-Type': 'application/json'},
            })
            .then(response => response.json())
            .then(data => {
                let categorylist = []
                for(var i=0;i<data.length;i++){
                    categorylist.push(<MenuItem value={data[i].category}>{data[i].category}</MenuItem>)
                }
                this.setState({
                    categorylistoption: categorylist,
                })
            }).catch(error => {
                console.error(error)
            });
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
                        <TextField label="問題番号" />
                    </FormControl>

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">カテゴリ</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={-1}
                            // value={age}
                            // onChange={handleChange}
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

                <Button style={buttonStyle} variant="contained" color="primary">
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

                <Card>
                    <CardContent>
                        問題カード
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        答えカード
                    </CardContent>
                </Card>

            </Container>
        )
    }

}

export default SelectQuizPage;