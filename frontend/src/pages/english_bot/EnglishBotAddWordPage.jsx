import React from "react";
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import EnglishBotLayout from "./components/EnglishBotLayout";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import API from "../../common/API";

const messageBoxStyle = {
    'margin': '10px 0px 20px',
    'borderStyle': 'none'
}

class EnglishBotAddWordPage extends React.Component {

    constructor(props) {
        super(props);
        this.getPartOfSpeechList = this.getPartOfSpeechList.bind(this)
        this.state = {
            message: '　',
            messageColor: 'initial',
        }
    }

    componentDidMount() {
        this.setState({
            message: '',
            messageColor: 'initial',
            posListOption: []
        })
        this.getPartOfSpeechList();
    }

    getPartOfSpeechList = () => {
        API.get("/english/partsofspeech", (data) => {
            if (data.status === 200) {
                data = data.body
                let posList = []
                for (var i = 0; i < data.length; i++) {
                    posList.push(<MenuItem value={data[i].id} key={data[i].id}>{data[i].name}</MenuItem>)
                }
                this.setState({
                    posListOption: posList,
                })
            } else {
                this.setState({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        })
    }

    contents = () => {
        return (
            <Container>
                <h1>Add Word</h1>

                <Card variant="outlined" style={messageBoxStyle}>
                    <CardContent>
                        <Typography variant="h6" component="h6">
                            {/* color={this.state.messageColor} */}
                            {/* {this.state.message} */}
                        </Typography>
                    </CardContent>
                </Card>

                <FormGroup>
                    <FormControl>
                        <TextField fullWidth label="New Word" id="newWord" />
                    </FormControl>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: 200 }}>{"品詞"}</TableCell>
                                    <TableCell>{"意味"}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <InputLabel id="demo-simple-select-label"></InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            defaultValue={-1}
                                            label="partOfSpeech"
                                            sx={{ width: 1 }}
                                        //onChange={handleChange}
                                        >
                                            <MenuItem value={-1} key={-1}>選択なし</MenuItem>
                                            {this.state.posListOption}
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <TextField id="input-mean-01" label="意味" variant="outlined" sx={{ width: 1 }} />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </FormGroup>
            </Container>
        )
    }

    render() {
        return (
            <>
                <EnglishBotLayout
                    contents={this.contents()}
                />
            </>
        )
    }

}

export default EnglishBotAddWordPage;