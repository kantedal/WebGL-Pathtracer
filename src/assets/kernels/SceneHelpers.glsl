//int getStackValue(int index, int stack[32]) {
//  if (index <= 10) {
//    if (index == 0) return stack[0];
//    if (index == 1) return stack[1];
//    if (index == 2) return stack[2];
//    if (index == 3) return stack[3];
//    if (index == 4) return stack[4];
//    if (index == 5) return stack[5];
//    if (index == 6) return stack[6];
//    if (index == 7) return stack[7];
//    if (index == 8) return stack[8];
//    if (index == 9) return stack[9];
//    if (index == 10) return stack[10];
//  }
//  else if (index <= 20) {
//    if (index == 11) return stack[11];
//    if (index == 12) return stack[12];
//    if (index == 13) return stack[13];
//    if (index == 14) return stack[14];
//    if (index == 15) return stack[15];
//    if (index == 16) return stack[16];
//    if (index == 17) return stack[17];
//    if (index == 18) return stack[18];
//    if (index == 19) return stack[19];
//    if (index == 20) return stack[20];
//  }
//  else if (index < 32) {
//    if (index == 21) return stack[21];
//    if (index == 22) return stack[22];
//    if (index == 23) return stack[23];
//    if (index == 24) return stack[24];
//    if (index == 25) return stack[25];
//    if (index == 26) return stack[26];
//    if (index == 27) return stack[27];
//    if (index == 28) return stack[28];
//    if (index == 29) return stack[29];
//    if (index == 30) return stack[30];
//    if (index == 31) return stack[31];
//  }
//  return -1;
//}

int getStackValue(int index, int stack[16]) {
  if (index < 8) {
    if (index == 0) return stack[0];
    if (index == 1) return stack[1];
    if (index == 2) return stack[2];
    if (index == 3) return stack[3];
    if (index == 4) return stack[4];
    if (index == 5) return stack[5];
    if (index == 6) return stack[6];
    if (index == 7) return stack[7];
  }
  else if (index < 16) {
    if (index == 8) return stack[8];
    if (index == 9) return stack[9];
    if (index == 10) return stack[10];
    if (index == 11) return stack[11];
    if (index == 12) return stack[12];
    if (index == 13) return stack[13];
    if (index == 14) return stack[14];
    if (index == 15) return stack[15];
  }
}
