import FilterCenterFocusIcon from "@mui/icons-material/FilterCenterFocus";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ValueInput from "../components/atoms/ValueInput";

const compositeOperationList = [
  "color",
  "color-burn",
  "color-dodge",
  "copy",
  "darken",
  "destination-atop",
  "destination-in",
  "destination-out",
  "destination-over",
  "difference",
  "exclusion",
  "hard-light",
  "hue",
  "lighten",
  "lighter",
  "luminosity",
  "multiply",
  "overlay",
  "saturation",
  "screen",
  "soft-light",
  "source-atop",
  "source-in",
  "source-out",
  "source-over",
  "xor",
];

function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [defaultPadding, setDefaultPadding] = useState(0);
  const [sourceImage, setSourceImage] = useState<File>();
  const [sourceUrl, setSourceUrl] = useState("");
  const [words, setWords] = useState<string>("YOUR MARK");
  const [markedImageUrl, setMarkedImageUrl] = useState<string>("");
  const [placement, setPlacement] = useState("center");
  const [readyToDraw, setReadyToDraw] = useState(false);
  const [convertImage, setConvertImage] = useState<HTMLImageElement>();
  const [rotate, setRotate] = useState(0);
  const [toggleMultilines, setToggleMultilines] = useState(false);
  const [wordGap, setWordGap] = useState(5);
  const [wordOffset, setWordOffset] = useState(0);
  const [quality, setQuality] = useState(1);
  const [moreDetail, setMoreDetail] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [useLine, setUseLine] = useState(true);
  const [colorValue, setColorValue] = useState("#ffffff");
  const [opacity, setOpacity] = useState(255 /* 126 */);
  const [imageRotate, setImageRotate] = useState(0);
  const [compositeOperation, setCompositeOperation] =
    useState<GlobalCompositeOperation>("source-over");

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
      setDefaultPadding(0);
      setSourceImage(undefined);
      setSourceUrl("");
      setWords("YOUR MARK");
      setMarkedImageUrl("");
      setPlacement("center");
      setReadyToDraw(false);
      setConvertImage(undefined);
      setRotate(0);
      setToggleMultilines(false);
      setWordGap(5);
      setWordOffset(0);
      setQuality(1);
      setMoreDetail(false);
      setFontSize(16);
      setUseLine(true);
      setColorValue("#ffffff");
      setOpacity(255);
      setImageRotate(0);
      setCompositeOperation("source-over");
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

      canvas.width =
        imageRotate === 0 || imageRotate === 180
          ? convertImage.width
          : convertImage.height;
      canvas.height =
        imageRotate === 0 || imageRotate === 180
          ? convertImage.height
          : convertImage.width;

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

      const imageRotateDeg = (imageRotate * Math.PI) / 180;

      ctx.save();
      if (imageRotate > 0) {
        ctx.rotate(imageRotateDeg);
      }
      if (imageRotate === 0) {
        ctx.translate(0, 0);
      } else if (imageRotate === 90) {
        ctx.translate(0, -convertImage.height);
      } else if (imageRotate === 180) {
        ctx.translate(-convertImage.width, -convertImage.height);
      } else if (imageRotate === 270) {
        ctx.translate(-convertImage.width, 0);
      }
      ctx.drawImage(convertImage, 0, 0);
      ctx.restore();

      const imgHeight = canvas.height;
      const imgWidth = canvas.width;

      const max = Math.max(imgWidth, imgHeight);
      const min = Math.min(imgWidth, imgHeight);
      const avg = (max + min) / 2;

      ctx.font = `bold ${fontSize * (avg / 320)}px sans-serif`;

      ctx.fillStyle = colorValue + opacity.toString(16).padStart(2, "0");
      ctx.globalCompositeOperation = compositeOperation;

      ctx.save();

      if (toggleMultilines) {
        const splitSign = useLine ? "─" : "　";
        const { width, hangingBaseline } = ctx.measureText(words);
        const defaultLineOffset = hangingBaseline;
        const offset = hangingBaseline * 2;
        const deg = (rotate * Math.PI) / 180;
        const angleHeight = Math.sqrt(imgWidth ** 2 + imgHeight ** 2);
        const totalLen = Math.ceil(angleHeight / offset);

        ctx.translate(
          imgWidth / 2,
          (totalLen * offset) / 2 - ((totalLen - 1) * hangingBaseline) / 2
        );
        ctx.rotate(deg);

        const totalLines = Math.ceil(imgHeight / offset);

        for (let i = -totalLines; i <= totalLines; i += 1) {
          ctx.textAlign = "center";
          const empty = splitSign.repeat(wordGap);
          const { width: emptyWidth } = ctx.measureText(empty);
          const text = new Array(Math.ceil(angleHeight / width))
            .fill(words)
            .join(empty);

          ctx.fillText(
            /* 갭차이 */
            text,
            width * (i % 2) - ((width - emptyWidth) / 2) * (i % 2),
            defaultLineOffset +
              i * offset +
              (i + 1) * wordOffset * (defaultLineOffset / 2)
          );
        }
      } else {
        const { alphabeticBaseline, hangingBaseline } = ctx.measureText(words);
        const padding = defaultPadding * hangingBaseline * 0.5;
        switch (placement) {
          case "top-left": {
            ctx.textAlign = "left";
            ctx.fillText(words, padding + 0, hangingBaseline + padding);
            break;
          }
          case "top": {
            ctx.textAlign = "center";
            ctx.fillText(words, imgWidth / 2, hangingBaseline + padding);
            break;
          }
          case "top-right": {
            ctx.textAlign = "right";
            ctx.fillText(words, -padding + imgWidth, hangingBaseline + padding);
            break;
          }
          case "bottom-left": {
            ctx.textAlign = "left";
            ctx.fillText(
              words,
              padding + 0,
              imgHeight - alphabeticBaseline - padding
            );
            break;
          }
          case "bottom": {
            ctx.textAlign = "center";
            ctx.fillText(
              words,
              imgWidth / 2,
              imgHeight - alphabeticBaseline - padding
            );
            break;
          }
          case "bottom-right": {
            ctx.textAlign = "right";
            ctx.fillText(
              words,
              -padding + imgWidth,
              imgHeight - alphabeticBaseline - padding
            );
            break;
          }
          case "left": {
            ctx.textAlign = "left";
            ctx.fillText(words, padding + 0, imgHeight / 2);
            break;
          }
          case "right": {
            ctx.textAlign = "right";
            ctx.fillText(words, -padding + imgWidth, imgHeight / 2);
            break;
          }
          case "center": {
            ctx.textAlign = "center";
            ctx.fillText(words, imgWidth / 2, imgHeight / 2);
            break;
          }
        }
      }

      ctx.restore();

      // function checkImageByMarkMyImage() {
      //   if (!convertImage) return false;
      //   if (!canvasRef) return false;

      //   const ctx = canvasRef.getContext("2d");
      //   if (ctx && ctx instanceof CanvasRenderingContext2D) {
      //     const images = ctx.getImageData(
      //       0,
      //       0,
      //       convertImage.width,
      //       convertImage.height
      //     );

      //     const toCode = (word: string) =>
      //       word.charCodeAt(0).toString(16).padStart(2, "0");
      //     const signature =
      //       "#" + toCode("d") + toCode("e") + toCode("v") + "ff";
      //     const leftTop = checkPixelColor(images, 0, signature);
      //     const rightTop = checkPixelColor(images, images.width, signature);
      //     const leftBottom = checkPixelColor(
      //       images,
      //       images.width * (images.height - 1),
      //       signature
      //     );
      //     const rightBottom = checkPixelColor(
      //       images,
      //       images.width * images.height,
      //       signature
      //     );
      //     return leftTop && rightTop && leftBottom && rightBottom;
      //   }
      // }

      // const result = checkImageByMarkMyImage();
      // if (result) {
      //   alert("Mark My Image를 통해 워터마크 적용한 이미지로 판별됩니다.");
      // }

      const size = Math.floor(8 * (avg / 320));
      ctx.font = `normal ${size}px san-serif`;
      const ownerBy = "published by markmyimage";
      const { width: baseWidth, hangingBaseline: baseline } =
        ctx.measureText(ownerBy);
      ctx.globalCompositeOperation = "exclusion";
      ctx.fillStyle = "#ffffff77";
      ctx.fillText(ownerBy, imgWidth - baseWidth - size, imgHeight - baseline);
    }, 0);
  }, [
    colorValue,
    compositeOperation,
    convertImage,
    defaultPadding,
    fontSize,
    imageRotate,
    moreDetail,
    opacity,
    placement,
    quality,
    readyToDraw,
    rotate,
    toggleMultilines,
    useLine,
    wordGap,
    wordOffset,
    words,
  ]);

  useEffect(() => {
    if (!markedImageUrl) return;
    if (!sourceImage) return;
    const type = sourceImage.type.split("/")[1];

    const link = document.createElement("a");
    link.download =
      sourceImage.name.split(".")[0] + "-convert_by_markmyimage" + `.${type}`;
    link.href = markedImageUrl;
    link.click();
    link.remove();
    setMarkedImageUrl("");
  }, [markedImageUrl, sourceImage]);

  // function checkPixelColor(images: ImageData, start: number, color: string) {
  //   return (
  //     color ===
  //     "#" +
  //       (images.data[start].toString(16).padStart(2, "0") +
  //         images.data[start + 1].toString(16).padStart(2, "0") +
  //         images.data[start + 2].toString(16).padStart(2, "0") +
  //         images.data[start + 3].toString(16).padStart(2, "0"))
  //   );
  // }

  /* 버전 또는 워터마크 적용 여부 체크 */
  // function setPixelColor(
  //   images: ImageData,
  //   start: number,
  //   r: number,
  //   g: number,
  //   b: number
  // ) {
  //   images.data[start] = r;
  //   images.data[start + 1] = g;
  //   images.data[start + 2] = b;
  //   images.data[start + 3] = 255;
  // }
  // function setImageByMarkMyImage() {
  //   const canvasRef = canvas.current;
  //   if (!convertImage) return;
  //   if (!canvasRef) return;

  //   const ctx = canvasRef.getContext("2d");
  //   if (ctx && ctx instanceof CanvasRenderingContext2D) {
  //     const images = ctx.getImageData(
  //       0,
  //       0,
  //       convertImage.width,
  //       convertImage.height
  //     );

  //     const toCharCode = (word: string) => word.charCodeAt(0);

  //     // left top
  //     setPixelColor(
  //       images,
  //       0,
  //       toCharCode("d"),
  //       toCharCode("e"),
  //       toCharCode("v")
  //     );
  //     // right top
  //     setPixelColor(
  //       images,
  //       images.width * 4,
  //       toCharCode("d"),
  //       toCharCode("e"),
  //       toCharCode("v")
  //     );
  //     // left bottom
  //     setPixelColor(
  //       images,
  //       images.width * (images.height - 1),
  //       toCharCode("d"),
  //       toCharCode("e"),
  //       toCharCode("v")
  //     );
  //     // right bottom
  //     setPixelColor(
  //       images,
  //       images.width * images.height,
  //       toCharCode("d"),
  //       toCharCode("e"),
  //       toCharCode("v")
  //     );
  //     ctx.putImageData(images, 0, 0);
  //   }
  // }

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

  function handleExport() {
    const canvasRef = canvas.current;
    if (!canvasRef) return;
    if (!sourceImage) return;

    let pngUrl = canvasRef.toDataURL(sourceImage.type, quality);
    if (sourceImage.type.endsWith("gif")) {
      pngUrl = pngUrl.replace(/^data:image\/(.+);/, `data:image/gif;`);
    }
    // console.log(pngUrl);
    setMarkedImageUrl(pngUrl);
  }

  function handleMoreDetailToggle() {
    setMoreDetail(!moreDetail);
  }

  function handleChangeColor(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setColorValue(value);
  }

  function handleChangeOpacity(e: ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    setOpacity(value);
  }

  function handleUseLine() {
    setUseLine(!useLine);
  }

  function handleImageLeftRotate() {
    setImageRotate(imageRotate - 90 < 0 ? 270 : imageRotate - 90);
  }

  function handleImageUnsetRotate() {
    setImageRotate(0);
  }

  function handleImageRightRotate() {
    setImageRotate(imageRotate + 90 > 270 ? 0 : imageRotate + 90);
  }

  function handleChangeComposite(e: SelectChangeEvent) {
    setCompositeOperation(e.target.value as GlobalCompositeOperation);
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
                backgroundColor: "#222",
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
          sx={{ position: "relative" }}>
          <Stack gap={3}>
            <Typography
              fontWeight={700}
              sx={{ position: "absolute", bottom: "100%", left: 0 }}>
              Original
            </Typography>
            <Stack direction='row'>
              <Stack
                component='label'
                justifyContent='flex-start'
                alignItems='center'
                htmlFor='imginput'
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  backgroundColor: sourceUrl ? "transparent" : "#222",
                  width: "auto",
                  minWidth: 150,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  height: "min-content",
                  ...(!sourceUrl && {
                    border: "3px dashed #444444",
                    "&::before": {
                      m: "auto",
                      content: '"🖼️ upload"',
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
            {sourceImage && (
              <Stack gap={1} flex={1}>
                <Stack direction='row' alignItems='flex-start' gap={1}>
                  <Chip color='primary' size='small' label='image size' />
                  <Stack>
                    <Typography>
                      {(sourceImage.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                    <Typography>
                      {(sourceImage.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction='row' alignItems='flex-start' gap={1}>
                  <Chip color='primary' size='small' label='image name' />
                  <Typography>{sourceImage.name}</Typography>
                </Stack>
                <Stack
                  direction='row'
                  alignItems='flex-start'
                  gap={1}
                  flexWrap='wrap'>
                  <Chip color='primary' size='small' label='image type' />
                  <Typography>{sourceImage.type}</Typography>
                  {sourceImage.type.endsWith("gif") && (
                    <Alert color='warning' variant='outlined'>
                      GIF 파일은 첫 프레임만 적용되므로 재생되지 않습니다.
                    </Alert>
                  )}
                </Stack>
                {convertImage && (
                  <Stack direction='row' alignItems='flex-start' gap={1}>
                    <Chip color='primary' size='small' label='image size' />
                    {convertImage.width} x {convertImage.height}
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>
          <input
            ref={uploadInputRef}
            type='file'
            hidden
            id='imginput'
            accept='image/*'
            onChange={handleUploadImage}
          />
          <Stack gap={3}>
            {sourceImage && (
              <Stack gap={2}>
                <Stack alignItems='center'>
                  <TextField
                    fullWidth
                    label='워터마크 워딩'
                    placeholder='워터마크에 사용할 텍스트를 입력하세요.'
                    size='small'
                    onChange={handleChangeWord}
                    value={words}
                  />
                </Stack>
                <Stack alignItems='center' gap={2}>
                  <Stack direction='row'>
                    <ValueInput
                      label='폰트 크기'
                      type='text'
                      min={8}
                      max={150}
                      step={1}
                      value={fontSize}
                      handler={setFontSize}
                    />
                  </Stack>

                  <Select
                    size='small'
                    fullWidth
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={compositeOperation || ""}
                    label='Age'
                    onChange={handleChangeComposite}>
                    <MenuItem value={""}></MenuItem>
                    {compositeOperationList.map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                  <Box
                    component='input'
                    type='color'
                    value={colorValue}
                    onChange={handleChangeColor}
                    sx={{
                      border: "1px solid #ccc",
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
                <Stack alignItems='center' gap={2}>
                  {/* rotate options */}
                  <Stack gap={1}>
                    <Stack direction='row' gap={1}>
                      <IconButton onClick={handleImageLeftRotate}>
                        <RotateLeftIcon />
                      </IconButton>
                      <IconButton onClick={handleImageUnsetRotate}>
                        <ImageIcon />
                      </IconButton>
                      <IconButton onClick={handleImageRightRotate}>
                        <RotateRightIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                  {/* placement control options */}
                  <Stack gap={1}>
                    <Stack direction='row' gap={1}>
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
                    <Stack direction='row' gap={1}>
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
                    <Stack direction='row' gap={1}>
                      <IconButton
                        onClick={() => handlePlacement("bottom-left")}>
                        <KeyboardArrowUpIcon
                          sx={{ transform: "rotate(-135deg)" }}
                        />
                      </IconButton>
                      <IconButton onClick={() => handlePlacement("bottom")}>
                        <KeyboardArrowUpIcon
                          sx={{ transform: "rotate(180deg)" }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => handlePlacement("bottom-right")}>
                        <KeyboardArrowUpIcon
                          sx={{ transform: "rotate(135deg)" }}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack alignItems='center' gap={2}>
                  <Button variant='contained' onClick={handleToggleMultilines}>
                    멀티라인
                  </Button>
                  {toggleMultilines && (
                    <Button variant='contained' onClick={handleUseLine}>
                      {useLine ? "라인 채우기" : "공백 채우기"}
                    </Button>
                  )}
                  {!toggleMultilines && (
                    <ValueInput
                      label='워딩 패드'
                      type='text'
                      value={defaultPadding}
                      handler={setDefaultPadding}
                      min={0}
                      max={25}
                      step={0.5}
                    />
                  )}
                  {toggleMultilines && (
                    <ValueInput
                      label='워딩 간격'
                      type='text'
                      value={wordGap}
                      handler={setWordGap}
                      min={0}
                      max={25}
                      step={1}
                    />
                  )}
                  {toggleMultilines && (
                    <ValueInput
                      label='라인 오프셋'
                      type='text'
                      value={wordOffset}
                      handler={setWordOffset}
                      min={0}
                      max={25}
                      step={0.1}
                    />
                  )}
                  {toggleMultilines && (
                    <ValueInput
                      label='각도'
                      type='text'
                      value={rotate}
                      handler={setRotate}
                      min={0}
                      max={360}
                      step={1}
                      returnOrigin
                    />
                  )}
                </Stack>
                <Stack gap={2}>
                  <ValueInput
                    label='이미지 퀄리티'
                    type='text'
                    value={quality}
                    handler={setQuality}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  <Button variant='outlined' onClick={handleMoreDetailToggle}>
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
