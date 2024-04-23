import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FilterCenterFocusIcon from "@mui/icons-material/FilterCenterFocus";

function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [sourceImage, setSourceImage] = useState<File>();
  const [sourceUrl, setSourceUrl] = useState("");
  const [words, setWords] = useState<string>("YOUR MARK");
  const [markedImageUrl, setMarkedImageUrl] = useState<string>("");
  const [placement, setPlacement] = useState("center");
  const [readyToDraw, setReadyToDraw] = useState(false);
  const [convertImage, setConvertImage] = useState<HTMLImageElement>();
  const [rotate, setRotate] = useState(0);
  const [toggleMultilines, setToggleMultilines] = useState(false);
  const [wordOffset, setWordOffset] = useState(1);
  const [quality, setQuality] = useState(1);
  const [moreDetail, setMoreDetail] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [useLine, setUseLine] = useState(true);
  const [colorValue, setColorValue] = useState("#ffffff");
  const [opacity, setOpacity] = useState(126);

  useEffect(() => {
    const uploadImage = uploadInputRef.current;
    function clearUploadImage() {
      if (uploadImage) {
        uploadImage.value = "";
      }
    }
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
      setSourceImage(undefined);
      setSourceUrl("");
      setWords("YOUR MARK");
      setMarkedImageUrl("");
      setPlacement("center");
      setReadyToDraw(false);
      setConvertImage(undefined);
      setRotate(0);
      setToggleMultilines(false);
      // setToggleUseDeg(false);
      setWordOffset(1);
      setQuality(1);
      setMoreDetail(false);
      clearUploadImage();
    };
  }, []);

  function handlePaste(e: ClipboardEvent) {
    const file = e.clipboardData?.files[0];
    if (file) {
      setSourceImage(file);
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        if (target && typeof target.result === "string") {
          setSourceUrl(target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    if (!(sourceImage && sourceUrl)) return;

    const image = new Image();
    image.src = sourceUrl;

    image.onload = () => {
      setReadyToDraw(true);
      setConvertImage(image);
    };
  }, [sourceImage, sourceUrl, words, placement]);

  useEffect(() => {
    const canvasRef = canvas.current;
    window.setTimeout(() => {
      if (!readyToDraw) return;
      if (!convertImage) return;
      if (!canvasRef) return;
      if (!originalImageRef.current) return;

      const canvas = canvasRef;
      const ctx = canvas.getContext("2d");

      if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) return;

      canvas.width = convertImage.width;
      canvas.height = convertImage.height;

      const range = (quality: number) => {
        if (0 <= quality && quality < 3) return "low";
        else if (3 <= quality && quality < 7) return "medium";
        else return "high";
      };

      ctx.imageSmoothingQuality = range(quality * 10);

      if (moreDetail) {
        ctx.imageSmoothingEnabled = false;
      } else {
        ctx.imageSmoothingEnabled = true;
      }

      ctx.drawImage(convertImage, 0, 0);

      const imgHeight = convertImage.height;
      const imgWidth = convertImage.width;

      const max = Math.max(imgWidth, imgHeight);
      const min = Math.min(imgWidth, imgHeight);
      const avg = (max + min) / 2;
      // const ratio = (min * 2) / max;

      ctx.font = `bold ${fontSize * (avg / 320)}px sans-serif`;

      const { width, alphabeticBaseline, hangingBaseline } =
        ctx.measureText(words);
      // ctx.lineWidth = 2;
      // ctx.strokeStyle = "#000000a6";
      ctx.fillStyle = colorValue + opacity.toString(16).padStart(2, "0");

      ctx.save();

      const offset = hangingBaseline * 2;
      if (toggleMultilines) {
        const deg = (rotate * Math.PI) / 180;
        // const heightQ = Math.sin(deg) * imgWidth;

        // const reverse = deg < 0;
        const heightGap = (Math.sin(deg) * imgWidth) / imgHeight;
        const totalHeight = Math.sqrt(imgWidth ** 2 + imgHeight ** 2);
        const totalLen = Math.ceil(totalHeight / offset);
        const splitSign = useLine ? "─" : "　";

        // if (rotate) {
        ctx.translate(
          imgWidth / 2,
          (totalLen * offset) / 2 - ((totalLen - 1) * hangingBaseline) / 2
        );
        ctx.rotate(deg);
        // }

        for (
          let i = -Math.ceil(totalLen / 2);
          i < Math.ceil(totalLen / 2);
          i += 1
        ) {
          // const normal = i * offset;
          // const strokeHeight = hangingBaseline * 1.5;
          // if (rotate) {
          //   strokeHeight = hangingBaseline * 2;
          // }

          ctx.textAlign = "center";

          // const krLen = (words.match(/[ㄱ-ㅎ가-힣]/g)?.length ?? 0) * 2;
          // const enLen = words.match(/[^ㄱ-ㅎ가-힣]/g)?.length ?? 0;
          // const wordLen = krLen + enLen;
          // console.log(krLen, enLen);

          // ctx.strokeText(
          //   /* 갭차이 */
          //   (words + splitSign.repeat(words.length / 2)).repeat(totalHeight / 2),
          //   (width / 1.5) * i,
          //   strokeHeight + i * offset
          // );
          ctx.fillText(
            /* 갭차이 */
            (words + splitSign.repeat(words.length / 2)).repeat(
              totalHeight / 2
            ),
            (width / 1.5) * i,
            heightGap + hangingBaseline * 1.5 + i * offset * wordOffset
          );
        }
      } else {
        switch (placement) {
          case "top-left": {
            ctx.textAlign = "left";
            // ctx.strokeText(words, 0, hangingBaseline);
            ctx.fillText(words, 0, hangingBaseline);
            break;
          }
          case "top": {
            ctx.textAlign = "center";
            // ctx.strokeText(words, imgWidth / 2, hangingBaseline);
            ctx.fillText(words, imgWidth / 2, hangingBaseline);
            break;
          }
          case "top-right": {
            ctx.textAlign = "right";
            // ctx.strokeText(words, imgWidth, hangingBaseline);
            ctx.fillText(words, imgWidth, hangingBaseline);
            break;
          }
          case "bottom-left": {
            ctx.textAlign = "left";
            // ctx.strokeText(words, 0, imgHeight - alphabeticBaseline);
            ctx.fillText(words, 0, imgHeight - alphabeticBaseline);
            break;
          }
          case "bottom": {
            ctx.textAlign = "center";
            // ctx.strokeText(words, imgWidth / 2, imgHeight - alphabeticBaseline);
            ctx.fillText(words, imgWidth / 2, imgHeight - alphabeticBaseline);
            break;
          }
          case "bottom-right": {
            ctx.textAlign = "right";
            // ctx.strokeText(words, imgWidth, imgHeight - alphabeticBaseline);
            ctx.fillText(words, imgWidth, imgHeight - alphabeticBaseline);
            break;
          }
          case "left": {
            ctx.textAlign = "left";
            // ctx.strokeText(words, 0, imgHeight / 2);
            ctx.fillText(words, 0, imgHeight / 2);
            break;
          }
          case "right": {
            ctx.textAlign = "right";
            // ctx.strokeText(words, imgWidth, imgHeight / 2);
            ctx.fillText(words, imgWidth, imgHeight / 2);
            break;
          }
          case "center": {
            ctx.textAlign = "center";
            // ctx.strokeText(words, imgWidth / 2, imgHeight / 2);
            ctx.fillText(words, imgWidth / 2, imgHeight / 2);
            break;
          }
        }
      }

      ctx.restore();
    }, 0);
  }, [
    colorValue,
    convertImage,
    fontSize,
    moreDetail,
    opacity,
    placement,
    quality,
    readyToDraw,
    rotate,
    toggleMultilines,
    useLine,
    wordOffset,
    words,
  ]);

  // useEffect(() => {
  //   if (!originalImageRef.current) return;
  //   const { width: imgWidth, height: imgHeight } =
  //     originalImageRef.current.getBoundingClientRect();
  //   if (destImageRef.current) {
  //     destImageRef.current.style.aspectRatio = "" + imgWidth / imgHeight;
  //   }
  // }, [markedImageUrl]);

  useEffect(() => {
    if (!markedImageUrl) return;
    if (!sourceImage) return;

    const link = document.createElement("a");
    // const downloadUrl = URL.createObjectURL(markedImageUrl)
    link.download =
      sourceImage.name.split(".")[0] + "-convert_by_markmyimage" + ".png";
    link.href = markedImageUrl;
    link.click();
    link.remove();
    setMarkedImageUrl("");
  }, [markedImageUrl, sourceImage]);

  function handleUploadImage(e: ChangeEvent<HTMLInputElement>) {
    setSourceUrl("");
    setSourceImage(undefined);

    const file = e.target.files?.[0];
    if (file) {
      setSourceImage(file);
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        if (target && typeof target.result === "string") {
          setSourceUrl(target.result);
          const uploadRef = uploadInputRef.current;
          if (uploadRef && uploadRef.value && sourceUrl) {
            uploadRef.value = "";
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleChangeWord(e: ChangeEvent<HTMLInputElement>) {
    setWords(e.target.value);
  }

  function handlePlacement(placement: string) {
    setToggleMultilines(false);
    setPlacement(placement);
  }

  function handleToggleMultilines() {
    setToggleMultilines(!toggleMultilines);
  }

  // function handleToggleUseDeg() {
  //   setToggleUseDeg((toggleUseDeg) => {
  //     if (toggleUseDeg) {
  //       setRotate(0);
  //     } else {
  //       setRotate(-45);
  //     }
  //     return !toggleUseDeg;
  //   });
  // }

  function handleWordOffset(e: ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    setWordOffset(value);
  }

  function handleExport() {
    const canvasRef = canvas.current;
    if (!canvasRef) return;
    const pngUrl = canvasRef.toDataURL("image/png", quality);
    setMarkedImageUrl(pngUrl);
  }

  function handleQuality(e: ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    setQuality(value);
  }

  function handleMoreDetailToggle() {
    setMoreDetail(!moreDetail);
  }

  function handleChangeFontSize(e: ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    setFontSize(value);
  }

  function handleChangeColor(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setColorValue(value);
  }

  function handleChangeOpacity(e: ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    setOpacity(value);
  }

  function handleRotate(e: ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;

    setRotate(Math.abs(value) >= 360 ? 0 : value);
  }

  function handleUseLine() {
    setUseLine(!useLine);
  }

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      flex={1}
      gap={1}
      sx={{ position: "relative" }}>
      <Stack
        direction='row'
        flex={1}
        justifyContent='flex-start'
        sx={{
          width: "100%",
          boxSizing: "border-box",
          p: 5,
        }}>
        <Stack
          direction='column'
          flex={1}
          sx={{ position: "relative", maxHeight: "calc(100vh - 112px)" }}>
          <Typography
            fontWeight={700}
            sx={{ position: "absolute", bottom: "100%", left: 0 }}>
            Preview
          </Typography>
          {!sourceImage ? (
            <Stack
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#ccc",
                "&::before": {
                  content: '"PREVIEW"',
                  m: "auto",
                  fontWeight: 700,
                  textTransform: "uppercase",
                },
              }}
            />
          ) : (
            <Box
              ref={canvas}
              component='canvas'
              sx={{
                alignSelf: "center",
                width: "auto",
                maxWidth: "100%",
                maxHeight: "calc(100vh - 192px)",
              }}
            />
          )}
        </Stack>
      </Stack>

      <Divider flexItem orientation='horizontal' />
      <Divider flexItem orientation='vertical' />

      {/* tools */}
      <Stack
        flex={1}
        sx={{
          p: 5,
        }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={2}
          sx={{ position: "relative", maxHeight: "calc(100vh - 112px)" }}>
          <Stack>
            <Typography
              fontWeight={700}
              sx={{ position: "absolute", bottom: "100%", left: 0 }}>
              Original
            </Typography>
            <Stack
              component='label'
              justifyContent='flex-start'
              alignItems='center'
              htmlFor='imginput'
              sx={{
                position: "relative",
                backgroundColor: sourceUrl ? "transparent" : "#ccc",
                width: "auto",
                minWidth: 150,
                // minHeight: 150,
                maxWidth: "100%",
                maxHeight: "100%",
                height: "min-content",
                ...(!sourceUrl && {
                  "&::before": {
                    m: "auto",
                    content: '"upload"',
                    textTransform: "uppercase",
                    fontWeight: 700,
                    my: 8,
                  },
                }),
              }}>
              <Box
                ref={originalImageRef}
                component='img'
                {...(sourceUrl && {
                  src: sourceUrl,
                })}
                sx={{
                  position: "relativee",
                  maxWidth: 300,
                  display: "none",
                  "&[src]": {
                    display: "block",
                    zIndex: 1,
                  },
                  width: "auto",
                  maxHeight: "100%",
                }}
              />
            </Stack>
          </Stack>
          <input
            ref={uploadInputRef}
            type='file'
            hidden
            id='imginput'
            accept='image/*'
            onChange={handleUploadImage}
          />
          <Stack gap={3} flex={1}>
            {sourceImage && (
              <Stack gap={2}>
                <Stack>
                  <TextField
                    fullWidth
                    label='워터마크 워딩'
                    placeholder='워터마크에 사용할 텍스트를 입력하세요.'
                    size='small'
                    onChange={handleChangeWord}
                    value={words}
                  />
                </Stack>
                <Stack direction='row' gap={2}>
                  <TextField
                    label='폰트 크기'
                    type='number'
                    value={fontSize}
                    size='small'
                    onChange={handleChangeFontSize}
                  />
                  <Box
                    component='input'
                    type='color'
                    value={colorValue}
                    onChange={handleChangeColor}
                    sx={{
                      border: "1px solid #ccc",
                      height: "100%",
                    }}
                  />
                  <Box
                    component='input'
                    type='range'
                    min={0}
                    max={255}
                    value={opacity}
                    onChange={handleChangeOpacity}
                  />
                </Stack>
                <Stack gap={1}>
                  <Stack direction='row' justifyContent='center' gap={1}>
                    <IconButton onClick={() => handlePlacement("top-left")}>
                      <KeyboardArrowUpIcon
                        sx={{ transform: "rotate(-45deg)" }}
                      />
                    </IconButton>
                    <IconButton onClick={() => handlePlacement("top")}>
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePlacement("top-right")}>
                      <KeyboardArrowUpIcon
                        sx={{ transform: "rotate(45deg)" }}
                      />
                    </IconButton>
                  </Stack>
                  <Stack direction='row' justifyContent='center' gap={1}>
                    <IconButton onClick={() => handlePlacement("left")}>
                      <KeyboardArrowUpIcon
                        sx={{ transform: "rotate(-90deg)" }}
                      />
                    </IconButton>
                    <IconButton onClick={() => handlePlacement("center")}>
                      <FilterCenterFocusIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePlacement("right")}>
                      <KeyboardArrowUpIcon
                        sx={{ transform: "rotate(90deg)" }}
                      />
                    </IconButton>
                  </Stack>
                  <Stack direction='row' justifyContent='center' gap={1}>
                    <IconButton onClick={() => handlePlacement("bottom-left")}>
                      <KeyboardArrowUpIcon
                        sx={{ transform: "rotate(-135deg)" }}
                      />
                    </IconButton>
                    <IconButton onClick={() => handlePlacement("bottom")}>
                      <KeyboardArrowUpIcon
                        sx={{ transform: "rotate(180deg)" }}
                      />
                    </IconButton>
                    <IconButton onClick={() => handlePlacement("bottom-right")}>
                      <KeyboardArrowUpIcon
                        sx={{ transform: "rotate(135deg)" }}
                      />
                    </IconButton>
                  </Stack>
                </Stack>
                <Stack gap={2}>
                  <Stack direction='row' gap={1}>
                    <Button
                      variant='contained'
                      onClick={handleToggleMultilines}>
                      멀티라인
                    </Button>
                    {toggleMultilines && (
                      <Button variant='contained' onClick={handleUseLine}>
                        {useLine ? "라인 채우기" : "공백 채우기"}
                      </Button>
                    )}
                    {toggleMultilines && (
                      <TextField
                        label='오프셋'
                        size='small'
                        type='number'
                        inputProps={{
                          min: 1,
                          max: 2,
                          step: 0.01,
                        }}
                        value={wordOffset}
                        onChange={handleWordOffset}
                      />
                    )}
                    {toggleMultilines && (
                      <TextField
                        label='각도'
                        size='small'
                        type='number'
                        inputProps={{
                          min: -360,
                          max: 360,
                          step: 1,
                        }}
                        value={rotate}
                        onChange={handleRotate}
                      />
                    )}
                  </Stack>
                </Stack>
                <Stack direction='row' gap={1}>
                  <TextField
                    label='이미지 퀄리티'
                    size='small'
                    type='number'
                    inputProps={{
                      min: 0.1,
                      max: 1,
                      step: 0.1,
                    }}
                    value={quality}
                    onChange={handleQuality}
                    sx={{
                      flex: 0.55,
                    }}
                  />
                  <Button onClick={handleMoreDetailToggle}>
                    {moreDetail ? "선명하게" : "원본"}
                  </Button>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={handleExport}>
                    내보내기
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Home;

// function Dummy({
//   width = "100%",
//   height = "100%",
// }: Partial<{
//   width: any;
//   height: any;
// }>) {
//   return <Box sx={{ background: "#ccc", width, height }} />;
// }
