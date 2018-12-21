
let r0 = 0;
let r2 = 0;
let r3 = 0;
let r4 = 0;
let r5 = 0;

function loop_c() {
    let iter = 0;
    r4 = 0;
    do {
        r3 = r4 | 65536;
        r4 = 16098955;
        do {
            r5 = r3 & 255;
            r4 += r5;
            r4 = r4 & 16777215;
            r4 = (r4 * 65899) & 16777215;
            if (r3 < 256) {
                break;
            } else {
                r3 = Math.floor(r3 / 256);
            }
        } while (true);

        iter++;
    } while (r4 !== r0);
    console.log("done, iter = " + iter);
}

function run(value_of_r0) {
    console.log("trying r0 = " + value_of_r0);
    r0 = value_of_r0;
    r2 = r3 = r4 = r5 = 0;
    loop_c();
}

// 15823996 is correct on part 1
// This is the value of r4 after the first iteration.

// 10199686 correct on part 2
// There is a loop when r4==13196126, i.e. this value is always followed by the same sequence.
// Thus, it's tempting to think that the r4 immediately prior to the first 13196126 is the
// answer. However, the sequence before first 13196126 isn't the same as the "loop sequence".
// Therefore, the answer is the r4 immediately prior to the _second_ 13196126, or put differently
// the last value of the looping sequence.
