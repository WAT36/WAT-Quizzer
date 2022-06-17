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
            })
    }

    constructor(props){
        super(props);
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
                            // onChange={handleChange}
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