import React from "react"
import { Button, Card, CardContent, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, FormGroup, TextField, Slider, Typography } from "@material-ui/core"

const buttonStyle = {
    'margin'     :  '10px',
}

export default function SelectQuizPage(){
    const [value, setValue] = React.useState([20, 37]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container>
            <h1>WAT Quizzer</h1>

            <FormGroup>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">問題ファイル</InputLabel>
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
                    <Slider
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="on"
                        aria-labelledby="range-slider"
                        // getAriaValueText={valuetext}
                    />
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