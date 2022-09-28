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

const messageBoxStyle = {
    'margin': '10px 0px 20px',
    'borderStyle': 'none'
}

class EnglishBotAddWordPage extends React.Component {
    componentDidMount() {
        this.setState({
            message: '',
            messageColor: 'error',
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
                                    <TableCell>{"品詞"}</TableCell>
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
                                            //value={age}
                                            label="Age"
                                        //onChange={handleChange}
                                        >
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <TextField id="input-mean-01" label="意味" variant="outlined" />
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