import React from "react";
import { Card, CardContent, Container, Typography } from "@material-ui/core"
import Dropzone from 'react-dropzone'
import axios from 'axios';

import QuizzerLayout from "./components/QuizzerLayout";

const messageBoxStyle = {
    'margin': '10px 0px 20px',
    'borderStyle': 'none'
}

const dropzoneStyle = {
    'backgroundColor': '#f4f4f4',
    'margin': '10px',
    'padding': '10px',
    'border': '#ddd dashed 5px',
    'minHeight': '200px',
    'textAlign': 'center' as "center",
}

interface ImageUploadPageState {
    message: string,
    messageColor: "error" | "initial" | "inherit" | "primary" | "secondary" | "textPrimary" | "textSecondary" | undefined,
    isUploading: boolean,
    images: ImageUploadReturnValue[]
}

interface ImageUploadReturnValue {
    name: string,
    isUploading: boolean,
    url: string
}

export default class ImageUploadPage extends React.Component<{},ImageUploadPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            message: '　',
            messageColor: 'initial',
            isUploading: false,
            images: []
        } as ImageUploadPageState;
        this.handleOnDrop = this.handleOnDrop.bind(this);
    }

    handleOnDrop(files: File[]) {
        this.setState({ 
            isUploading: true,
            message: '　',
            messageColor: 'initial',
        });

        Promise.all(files.map(file => this.uploadImage(file)))
            .then(images => {
                console.log("images:",images);
                this.setState({
                    isUploading: false,
                    images: this.state.images.concat(images),
                    message: 'アップロードが完了しました:'+images[0].name,
                    messageColor: 'initial',
                });
            }).catch(e => {
                    console.log(e);
                    this.setState({
                        isUploading: false,
                        message: 'エラー：アップロードに失敗しました',
                        messageColor: 'error',
                    });
                }
            );
    }

    uploadImage(file: File) {
        return axios.post(process.env.REACT_APP_API_SERVER + '/upload', {
            params: {
                filename: file.name,
                filetype: file.type
            }
        }).then(res => {
            const options = {
                headers: {
                    'Content-Type': file.type
                }
            };
            return axios.put(res.data.url, file, options);
        }).then(res => {
            const name = String(res.config.data);
            return {
                name,
                isUploading: true,
                url: `https://`+ process.env.REACT_APP_S3_BUCKET_NAME +`.s3.amazonaws.com/${file.name}`
            } as ImageUploadReturnValue;
        }).catch(e => {
            console.log("frontend axioserrpr:",e)
            return {} as ImageUploadReturnValue;
        });
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

                <Dropzone onDrop={this.handleOnDrop} >
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div {...getRootProps()} style={dropzoneStyle}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                                {this.state.isUploading ?
                                    <p>ファイルをアップロードしています</p> :
                                    <p>ここに画像をドラックまたはクリック</p>}
                            </div>
                        </section>
                    )}
                </Dropzone>
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
