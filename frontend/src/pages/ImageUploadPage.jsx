import React from "react";
import { Button, Container } from "@material-ui/core"
import { useCallback } from 'react';
import {useDropzone} from 'react-dropzone';

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

export default function ImageUploadPage(props){

    const MakeDropZoneArea = () => {
        const onDrop = useCallback((acceptedFiles) => {
            // Do something with the files
            console.log('acceptedFiles:', acceptedFiles);
        }, []);
        const {acceptedFiles, getRootProps, getInputProps} = useDropzone({ onDrop });
        
        const files = acceptedFiles.map(file => (
            <li key={file.path}>
                {file.path} - {file.size} bytes
            </li>
        ));
        
        return (
            <section className="container">
                <div {...getRootProps({className: 'dropzone'})} style={dropzoneStyle}>
                    <input {...getInputProps()} />
                    <p style={dropzoneTextStyle}>Drag and drop some files here, or click to select files</p>
                    <p style={dropzoneTextStyle}>ここにファイルをドラッグ&ドロップ　または　クリックしてファイルを選択</p>
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                </aside>
            </section>
        );
    }

    const contents = () => {
        return (
            <Container>
                <h1>WAT Quizzer</h1>

                {MakeDropZoneArea()}

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

    return (
        <>
            <QuizzerLayout 
                contents={contents()}
            />
        </>
    )

}
