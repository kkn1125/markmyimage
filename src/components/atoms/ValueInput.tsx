import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, IconButton, Stack, TextField } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";

type ValueInputProps = {
  label: string;
  type: string;
  value: number;
  min: number;
  max: number;
  step: number;
  handler: (value: SetStateAction<number>) => void;
  returnOrigin?: boolean;
};

function ValueInput({
  label,
  type,
  value,
  min,
  max,
  step,
  handler,
  returnOrigin = false,
}: ValueInputProps) {
  const [mouseDown, setMouseDown] = useState(0);

  const calculateValue = (value: number) => {
    let calcValue = value;
    if (returnOrigin) {
      if (calcValue < 0) {
        calcValue = 360 - Math.abs(calcValue);
      }
      return max > calcValue ? (calcValue < min ? max : calcValue) : 0;
    } else {
      return parseFloat(
        (calcValue > min ? (calcValue < max ? calcValue : max) : min).toFixed(1)
      );
    }
  };

  useEffect(() => {
    const calculateValue = (value: number) => {
      let calcValue = value;
      if (returnOrigin) {
        if (calcValue < 0) {
          calcValue = 360 - Math.abs(calcValue);
        }
        return max > calcValue ? (calcValue < min ? max : calcValue) : 0;
      } else {
        return parseFloat(
          (calcValue > min ? (calcValue < max ? calcValue : max) : min).toFixed(
            1
          )
        );
      }
    };

    let loop = 0;

    if (mouseDown === -1) {
      handler((value) => calculateValue(value - step));
      loop = setTimeout(() => {
        loop = setInterval(() => {
          handler((value) => calculateValue(value - step));
        }, 50);
      }, 300);
    }
    if (mouseDown === 1) {
      handler((value) => calculateValue(value + step));
      loop = setTimeout(() => {
        loop = setInterval(() => {
          handler((value) => calculateValue(value + step));
        }, 50);
      }, 300);
    }

    return () => {
      clearInterval(loop);
    };
  }, [handler, max, min, mouseDown, returnOrigin, step]);

  return (
    <Stack direction='row' alignItems='center' gap={1} sx={{ width: "100%" }}>
      <Box>
        <IconButton
          size='small'
          onContextMenu={(e) => e.preventDefault()}
          onPointerLeave={() => setMouseDown(0)}
          onPointerDown={() => setMouseDown(-1)}
          onPointerUp={() => setMouseDown(0)}>
          <RemoveIcon />
        </IconButton>
      </Box>
      <TextField
        fullWidth
        label={label}
        type={type}
        value={value}
        size='small'
        onChange={(e) => {
          const value = +e.target.value;
          if (Number.isNaN(value)) {
            return;
          }
          handler(calculateValue(value));
        }}
      />
      <Box>
        <IconButton
          size='small'
          onContextMenu={(e) => e.preventDefault()}
          onPointerLeave={() => setMouseDown(0)}
          onPointerDown={() => setMouseDown(1)}
          onPointerUp={() => setMouseDown(0)}>
          <AddIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}

export default ValueInput;
