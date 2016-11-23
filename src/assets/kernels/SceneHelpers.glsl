void setStackIndex(int index, int value, inout int stack[32]) {
  if (index < 16) {
    if (index < 8) {
      if (index < 4) {
        if (index < 2) {
          if (index == 0) stack[0] = value;
          else stack[1] = value;
        }
        else {
          if (index == 2) stack[2] = value;
          else stack[3] = value;
        }
      }
      else {
        if (index < 6) {
          if (index == 4) stack[4] = value;
          else stack[5] = value;
        }
        else {
          if (index == 6) stack[6] = value;
          else stack[7] = value;
        }
      }
    }
    else {
      if (index < 12) {
        if (index < 10) {
          if (index == 8) stack[8] = value;
          else stack[9] = value;
        }
        else {
          if (index == 10) stack[10] = value;
          else stack[11] = value;
        }
      }
      else {
        if (index < 14) {
          if (index == 12) stack[12] = value;
          else stack[13] = value;
        }
        else {
           if (index == 14) stack[14] = value;
           else stack[15] = value;
        }
      }
    }
  }
  else {
    if (index < 24) {
      if (index < 20) {
        if (index < 18) {
          if (index == 16) stack[16] = value;
          else stack[17] = value;
        }
        else {
          if (index == 18) stack[18] = value;
          else stack[19] = value;
        }
      }
      else {
        if (index < 22) {
          if (index == 20) stack[20] = value;
          else stack[21] = value;
        }
        else {
          if (index == 22) stack[22] = value;
          else stack[23] = value;
        }
      }
    }
    else {
      if (index < 28) {
        if (index < 26) {
          if (index == 24) stack[24] = value;
          else stack[25] = value;
        }
        else {
          if (index == 26) stack[26] = value;
          else stack[27] = value;
        }
      }
      else {
        if (index < 30) {
          if (index == 28) stack[28] = value;
          else stack[29] = value;
        }
        else {
          if (index == 30) stack[30] = value;
          else stack[31] = value;
        }
      }
    }
  }
}

int getStackValue(int index, int stack[32]) {
 if (index < 16) {
    if (index < 8) {
      if (index < 4) {
        if (index < 2) {
          if (index == 0) return stack[0];
          else return stack[1];
        }
        else {
          if (index == 2) return stack[2];
          else return stack[3];
        }
      }
      else {
        if (index < 6) {
          if (index == 4) return stack[4];
          else return stack[5];
        }
        else {
          if (index == 6) return stack[6];
          else return stack[7];
        }
      }
    }
    else {
      if (index < 12) {
        if (index < 10) {
          if (index == 8) return stack[8];
          else return stack[9];
        }
        else {
          if (index == 10) return stack[10];
          else return stack[11];
        }
      }
      else {
        if (index < 14) {
          if (index == 12) return stack[12];
          else return stack[13];
        }
        else {
           if (index == 14) return stack[14];
           else return stack[15];
        }
      }
    }
  }
  else {
    if (index < 24) {
      if (index < 20) {
        if (index < 18) {
          if (index == 16) return stack[16];
          else return stack[17];
        }
        else {
          if (index == 18) return stack[18];
          else return stack[19];
        }
      }
      else {
        if (index < 22) {
          if (index == 20) return stack[20];
          else return stack[21];
        }
        else {
          if (index == 22) return stack[22];
          else return stack[23];
        }
      }
    }
    else {
      if (index < 28) {
        if (index < 26) {
          if (index == 24) return stack[24];
          else return stack[25];
        }
        else {
          if (index == 26) return stack[26];
          else return stack[27];
        }
      }
      else {
        if (index < 30) {
          if (index == 28) return stack[28];
          else return stack[29];
        }
        else {
          if (index == 30) return stack[30];
          else return stack[31];
        }
      }
    }
  }
}
