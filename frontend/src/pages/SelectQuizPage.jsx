import React from "react";
import { Button, Card, CardContent, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, FormGroup, TextField, Typography, Slider } from "@material-ui/core"

const buttonStyle = {
    'margin'     :  '10px',
}
class SelectQuizPage extends React.Component{

    constructor(props){
        super(props);
        this.fileSelect = this.fileSelect.bind(this);
        this.rangeSlider = this.rangeSlider.bind(this);
        this.state = {
            value: [20,37]
        }
    }

    fileSelect = () => {
        return <MenuItem value={0}>追加テスト</MenuItem>
    }

    rangeSlider = () => {
        // const [value, setValue] = React.useState(20);
    
        const handleChange = (event, newValue) => {
            // setValue(newValue);
            this.setState({value: newValue})
        };
    
        return (
                <Slider
                value={this.state.value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                />
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
                            // value={age}
                            // onChange={handleChange}
                        >
                            <MenuItem value={-1}>選択肢テスト</MenuItem>
                            {this.fileSelect()}
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
                            // value={age}
                            // onChange={handleChange}
                        >
                            <MenuItem value={-1}>選択肢テスト</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <Typography id="range-slider" gutterBottom>
                            正解率(%)指定
                        </Typography>
                        {/* <Slider
                            value={this.defaultAccRate}
                            onChange={this.handleChange}
                            valueLabelDisplay="on"
                            aria-labelledby="range-slider"
                            // getAriaValueText={valuetext}
                        /> */}
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