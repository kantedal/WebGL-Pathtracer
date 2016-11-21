void setStackIndex(int index, int value, inout int stack[32]) {
  if (index <= 10) {
    if (index == 0) stack[0] = value;
    if (index == 1) stack[1] = value;
    if (index == 2) stack[2] = value;
    if (index == 3) stack[3] = value;
    if (index == 4) stack[4] = value;
    if (index == 5) stack[5] = value;
    if (index == 6) stack[6] = value;
    if (index == 7) stack[7] = value;
    if (index == 8) stack[8] = value;
    if (index == 9) stack[9] = value;
    if (index == 10) stack[10] = value;
  }
  else if (index <= 20) {
    if (index == 11) stack[11] = value;
    if (index == 12) stack[12] = value;
    if (index == 13) stack[13] = value;
    if (index == 14) stack[14] = value;
    if (index == 15) stack[15] = value;
    if (index == 16) stack[16] = value;
    if (index == 17) stack[17] = value;
    if (index == 18) stack[18] = value;
    if (index == 19) stack[19] = value;
    if (index == 20) stack[20] = value;
  }
  else if (index < 32) {
    if (index == 21) stack[21] = value;
    if (index == 22) stack[22] = value;
    if (index == 23) stack[23] = value;
    if (index == 24) stack[24] = value;
    if (index == 25) stack[25] = value;
    if (index == 26) stack[26] = value;
    if (index == 27) stack[27] = value;
    if (index == 28) stack[28] = value;
    if (index == 29) stack[29] = value;
    if (index == 30) stack[30] = value;
    if (index == 31) stack[31] = value;
  }
}

int getStackValue(int index, int stack[32]) {
  if (index <= 10) {
    if (index == 0) return stack[0];
    if (index == 1) return stack[1];
    if (index == 2) return stack[2];
    if (index == 3) return stack[3];
    if (index == 4) return stack[4];
    if (index == 5) return stack[5];
    if (index == 6) return stack[6];
    if (index == 7) return stack[7];
    if (index == 8) return stack[8];
    if (index == 9) return stack[9];
    if (index == 10) return stack[10];
  }
  else if (index <= 20) {
    if (index == 11) return stack[11];
    if (index == 12) return stack[12];
    if (index == 13) return stack[13];
    if (index == 14) return stack[14];
    if (index == 15) return stack[15];
    if (index == 16) return stack[16];
    if (index == 17) return stack[17];
    if (index == 18) return stack[18];
    if (index == 19) return stack[19];
    if (index == 20) return stack[20];
  }
  else if (index < 32) {
    if (index == 21) return stack[21];
    if (index == 22) return stack[22];
    if (index == 23) return stack[23];
    if (index == 24) return stack[24];
    if (index == 25) return stack[25];
    if (index == 26) return stack[26];
    if (index == 27) return stack[27];
    if (index == 28) return stack[28];
    if (index == 29) return stack[29];
    if (index == 30) return stack[30];
    if (index == 31) return stack[31];
  }
  return -1;
}

LeafNode getLeafNode(int index, LeafNode stack[32]) {
  if (index <= 10) {
    if (index == 0) return stack[0];
    if (index == 1) return stack[1];
    if (index == 2) return stack[2];
    if (index == 3) return stack[3];
    if (index == 4) return stack[4];
    if (index == 5) return stack[5];
    if (index == 6) return stack[6];
    if (index == 7) return stack[7];
    if (index == 8) return stack[8];
    if (index == 9) return stack[9];
    if (index == 10) return stack[10];
  }
  else if (index <= 20) {
    if (index == 11) return stack[11];
    if (index == 12) return stack[12];
    if (index == 13) return stack[13];
    if (index == 14) return stack[14];
    if (index == 15) return stack[15];
    if (index == 16) return stack[16];
    if (index == 17) return stack[17];
    if (index == 18) return stack[18];
    if (index == 19) return stack[19];
    if (index == 20) return stack[20];
  }
  else if (index < 32) {
    if (index == 21) return stack[21];
    if (index == 22) return stack[22];
    if (index == 23) return stack[23];
    if (index == 24) return stack[24];
    if (index == 25) return stack[25];
    if (index == 26) return stack[26];
    if (index == 27) return stack[27];
    if (index == 28) return stack[28];
    if (index == 29) return stack[29];
    if (index == 30) return stack[30];
    if (index == 31) return stack[31];
  }
}

void setLeafNode(int index, LeafNode value, inout LeafNode stack[32]) {
  if (index <= 10) {
    if (index == 0) stack[0] = value;
    else if (index == 1) stack[1] = value;
    else if (index == 2) stack[2] = value;
    else if (index == 3) stack[3] = value;
    else if (index == 4) stack[4] = value;
    else if (index == 5) stack[5] = value;
    else if (index == 6) stack[6] = value;
    else if (index == 7) stack[7] = value;
    else if (index == 8) stack[8] = value;
    else if (index == 9) stack[9] = value;
    else if (index == 10) stack[10] = value;
  }
  else if (index <= 20) {
    if (index == 11) stack[11] = value;
    else if (index == 12) stack[12] = value;
    else if (index == 13) stack[13] = value;
    else if (index == 14) stack[14] = value;
    else if (index == 15) stack[15] = value;
    else if (index == 16) stack[16] = value;
    else if (index == 17) stack[17] = value;
    else if (index == 18) stack[18] = value;
    else if (index == 19) stack[19] = value;
    else if (index == 20) stack[20] = value;
  }
  else if (index < 32) {
    if (index == 21) stack[21] = value;
    else if (index == 22) stack[22] = value;
    else if (index == 23) stack[23] = value;
    else if (index == 24) stack[24] = value;
    else if (index == 25) stack[25] = value;
    else if (index == 26) stack[26] = value;
    else if (index == 27) stack[27] = value;
    else if (index == 28) stack[28] = value;
    else if (index == 29) stack[29] = value;
    else if (index == 30) stack[30] = value;
    else if (index == 31) stack[31] = value;
  }
}
