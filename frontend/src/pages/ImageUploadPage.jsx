import React from "react";
import { Button, Container } from "@material-ui/core"
import { useCallback } from 'react';
import Dropzone from 'react-dropzone'

import QuizzerLayout from "./components/QuizzerLayout";

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

        }
    }

    makeDropZoneArea = () => {
        
        return (
            <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
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

    }

    contents = () => {
        return (
            <Container>
                <h1>WAT Quizzer</h1>

                {this.makeDropZoneArea()}

                <Button 
                    style={buttonStyle} 
                    variant="contained" 
                    color="primary"
                    //onClick={(e) => this.getAccuracy()}
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
