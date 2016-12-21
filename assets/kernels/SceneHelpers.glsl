void setStackIndex(float index, float value, inout float stack[32]) {
  if (index < 16.0) {
    if (index < 8.0) {
      if (index < 4.0) {
        if (index < 2.0) {
          if (index == 0.0) stack[0] = value;
          else stack[1] = value;
        }
        else {
          if (index == 2.0) stack[2] = value;
          else stack[3] = value;
        }
      }
      else {
        if (index < 6.0) {
          if (index == 4.0) stack[4] = value;
          else stack[5] = value;
        }
        else {
          if (index == 6.0) stack[6] = value;
          else stack[7] = value;
        }
      }
    }
    else {
      if (index < 12.0) {
        if (index < 10.0) {
          if (index == 8.0) stack[8] = value;
          else stack[9] = value;
        }
        else {
          if (index == 10.0) stack[10] = value;
          else stack[11] = value;
        }
      }
      else {
        if (index < 14.0) {
          if (index == 12.0) stack[12] = value;
          else stack[13] = value;
        }
        else {
           if (index == 14.0) stack[14] = value;
           else stack[15] = value;
        }
      }
    }
  }
  else {
    if (index < 24.0) {
      if (index < 20.0) {
        if (index < 18.0) {
          if (index == 16.0) stack[16] = value;
          else stack[17] = value;
        }
        else {
          if (index == 18.0) stack[18] = value;
          else stack[19] = value;
        }
      }
      else {
        if (index < 22.0) {
          if (index == 20.0) stack[20] = value;
          else stack[21] = value;
        }
        else {
          if (index == 22.0) stack[22] = value;
          else stack[23] = value;
        }
      }
    }
    else {
      if (index < 28.0) {
        if (index < 26.0) {
          if (index == 24.0) stack[24] = value;
          else stack[25] = value;
        }
        else {
          if (index == 26.0) stack[26] = value;
          else stack[27] = value;
        }
      }
      else {
        if (index < 30.0) {
          if (index == 28.0) stack[28] = value;
          else stack[29] = value;
        }
        else {
          if (index == 30.0) stack[30] = value;
          else stack[31] = value;
        }
      }
    }
  }
}

float getStackValue(float index, float stack[32]) {
  //return mix(mix(mix(mix(mix(stack[0],stack[1], step(0.9, index)), mix(stack[2],stack[3], step(2.9, index)), step(1.9, index)), mix(mix(stack[4],stack[5], step(4.9, index)), mix(stack[6],stack[7], step(6.9, index)), step(5.9, index)), step(3.9, index)), mix(mix(mix(stack[8],stack[9], step(8.9, index)), mix(stack[10],stack[11], step(10.9, index)), step(9.9, index)), mix(mix(stack[12],stack[13], step(12.9, index)), mix(stack[14],stack[15], step(14.9, index)), step(13.9, index)), step(11.9, index)), step(7.9, index)), mix(mix(mix(mix(stack[16],stack[17], step(16.9, index)), mix(stack[18],stack[19], step(18.9, index)), step(17.9, index)), mix(mix(stack[20],stack[21], step(20.9, index)), mix(stack[22],stack[23], step(22.9, index)), step(21.9, index)), step(19.9, index)), mix(mix(mix(stack[24],stack[25], step(24.9, index)), mix(stack[26],stack[27], step(26.9, index)), step(25.9, index)), mix(mix(stack[28],stack[29], step(28.9, index)), mix(stack[30],stack[31], step(30.9, index)), step(29.9, index)), step(27.9, index)), step(23.9, index)), step(15.9, index));
  if (index < 16.0) {
    if (index < 8.0) {
      if (index < 4.0) {
        if (index < 2.0) {
          if (index == 0.0) return stack[0];
          else return stack[1];
        }
        else {
          if (index == 2.0) return stack[2];
          else return stack[3];
        }
      }
      else {
        if (index < 6.0) {
          if (index == 4.0) return stack[4];
          else return stack[5];
        }
        else {
          if (index == 6.0) return stack[6];
          else return stack[7];
        }
      }
    }
    else {
      if (index < 12.0) {
        if (index < 10.0) {
          if (index == 8.0) return stack[8];
          else return stack[9];
        }
        else {
          if (index == 10.0) return stack[10];
          else return stack[11];
        }
      }
      else {
        if (index < 14.0) {
          if (index == 12.0) return stack[12];
          else return stack[13];
        }
        else {
           if (index == 14.0) return stack[14];
           else return stack[15];
        }
      }
    }
  }
  else {
    if (index < 24.0) {
      if (index < 20.0) {
        if (index < 18.0) {
          if (index == 16.0) return stack[16];
          else return stack[17];
        }
        else {
          if (index == 18.0) return stack[18];
          else return stack[19];
        }
      }
      else {
        if (index < 22.0) {
          if (index == 20.0) return stack[20];
          else return stack[21];
        }
        else {
          if (index == 22.0) return stack[22];
          else return stack[23];
        }
      }
    }
    else {
      if (index < 28.0) {
        if (index < 26.0) {
          if (index == 24.0) return stack[24];
          else return stack[25];
        }
        else {
          if (index == 26.0) return stack[26];
          else return stack[27];
        }
      }
      else {
        if (index < 30.0) {
          if (index == 28.0) return stack[28];
          else return stack[29];
        }
        else {
          if (index == 30.0) return stack[30];
          else return stack[31];
        }
      }
    }
  }
}
