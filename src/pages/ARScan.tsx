import { Button } from '@mui/material';
import React from 'react';
import Webcam from 'react-webcam';
import LocalSeeIcon from '@mui/icons-material/LocalSee';

export const ARScan = () => {
    const webcamRef = React.useRef(null);
    /*const capture = React.useCallback(
        () => {
            // @ts-ignore
            const imageSrc = webcamRef.current.getScreenshot();
        },
        [webcamRef]
    );*/
    return (
        <>
            <Webcam
                id="webcam"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    facingMode: "environment"
                }}/>
            <span id="picture__container">
                <Button variant="contained" color='primary' id="picture__button"><LocalSeeIcon fontSize='large'/></Button>
            </span>
        </>
    );
};