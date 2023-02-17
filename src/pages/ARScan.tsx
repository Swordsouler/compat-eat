import { Button, Modal } from "@mui/material";
import React, { useEffect } from "react";
//import Webcam from 'react-webcam';
import LocalSeeIcon from "@mui/icons-material/LocalSee";
//@ts-ignore
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Box } from "@mui/system";

export const ARScan = () => {
  const [EANCode, setEANCode] = React.useState("");
  const [data, setData] = React.useState<{ product: any }>();
  /*const capture = React.useCallback(
        () => {
            // @ts-ignore
            const imageSrc = webcamRef.current.getScreenshot();
        },
        [webcamRef]
    );*/

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("webcam");

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 15,
        qrbox: 500,
      },
      qrCodeSuccessCallback,
      undefined
    );
    return () => {
      html5QrCode.stop().then((ignore) => {
        // QR Code scanning is stopped.
        html5QrCode.clear();
      });
    };
  }, []);
  let time: NodeJS.Timer;
  const qrCodeSuccessCallback = (decodedText: string) => {
    clearTimeout(time);
    setEANCode(decodedText);
    time = setInterval(() => {
      setEANCode("");
    }, 5000);
  };

  const handleClick = () => {
    //html5QrCode.stop();
    if (EANCode == "") {
      return;
    }
    fetch(
      "https://fr.openfoodfacts.org/api/v0/product/" + EANCode + ".json"
    ).then((response) => {
      response.json().then((data) => {
        console.log(data);
        setData(data);
      });
    });
  };
  return (
    <>
      <div id="webcam" />
      <span id="picture__container">
        <Button
          disabled={EANCode == ""}
          onClick={handleClick}
          variant="contained"
          color="primary"
          id="picture__button"
        >
          <LocalSeeIcon fontSize="large" />
        </Button>
        <Modal
          open={!!data}
          onClose={() => setData(undefined)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div id="modal__container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1>{data?.product.product_name}</h1>
              <img src={data?.product.image_front_url} alt="product" />
            </div>

            <div id="form__button">
              <Button
                variant="contained"
                color="secondary"
                id="form__button__cancel"
                onClick={() => setData(undefined)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                id="form__button__create"
              >
                Add product
              </Button>
            </div>
          </div>
        </Modal>
      </span>
    </>
  );
};
