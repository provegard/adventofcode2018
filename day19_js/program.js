let r0 = 1;
let r1 = 0;
let r2 = 0;
let r3 = 0;
let r4 = 0;
let r5 = 0;

function lbl_a() {
  // outer loop runs r3 times
  for (r2 = 1; r2 <= r3; r2++) {
    /*for (r1 = 1; r1 <= r3; r1++) {
      r4 = r2 * r1;
      if (r3 === r4) {
        console.log(r0);
        r0 += r2;
      }
    }*/
    if (r3 % r2 === 0) {
        console.log(r0);
        r0 += r2;
    }
  }
}

function set_r4() {
  r3 += 10550400;
  r0 = 0;
  lbl_a();
}

function lbl_b() {
  r3 = 973;
  if (r0 === 0) lbl_a();
  else set_r4();
}

function main() {
    lbl_b();
}

main();
console.log(r0);