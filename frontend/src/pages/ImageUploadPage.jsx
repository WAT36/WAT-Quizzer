import React from "react";
import { Button, Card, CardContent, Container, Typography } from "@material-ui/core"
import Dropzone from 'react-dropzone'

import QuizzerLayout from "./components/QuizzerLayout";

const messageBoxStyle = {
    'margin'        : '10px 0px 20px',
    'borderStyle'  : 'none'
}

const buttonStyle = {
    'margin'     :  '10px',
}

const dropzoneStyle = {
    'background-color': '#f4f4f4',
    'margin': '10px',
    'padding': '10px',
    'border': '#ddd dashed 5px',
    'min-height': '200px',
    'text-align': 'center',
}

const dropzoneTextStyle = {
    'color': '#999',
    'font-weight': 'bold',
    'font-size': '14px',
}

export default class ImageUploadPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            message: '　',
            messageColor: 'initial',
            selectedFile: undefined
        }
    }

    makeDropZoneArea = () => {
        
        return (
            <Dropzone 
                onDrop={acceptedFiles => 
                    {
                        console.log(acceptedFiles);
                        this.setState({
                            message: '　',
                            messageColor: 'initial',
                            selectedFile: acceptedFiles,
                        })
                    }
                    }>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div {...getRootProps()} style={dropzoneStyle}>
                        <input {...getInputProps()} />
                        <p style={dropzoneTextStyle}>Drag and drop some files here, or click to select files</p>
                        <p style={dropzoneTextStyle}>ここにファイルをドラッグ&ドロップ　または　クリックしてファイルを選択</p>
                    </div>
                    </section>
                )}
            </Dropzone>
        );
    }

    uploadImage = () => {
        if(this.state.selectedFile === undefined || this.state.selectedFile.length < 1){
            this.setState({
                message: 'エラー:画像ファイルを選択してください',
                messageColor: 'error',
            })
            return;
        }
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

                {this.makeDropZoneArea()}

                <Button 
                    style={buttonStyle} 
                    variant="contained" 
                    color="primary"
                    onClick={(e) => this.uploadImage()}
                    >
                    アップロード
                </Button>
            </Container>
        )
    }

    render(){
        return (
            <>
                <QuizzerLayout 
                    contents={this.contents()}
                />
            </>
        )
    }

}
