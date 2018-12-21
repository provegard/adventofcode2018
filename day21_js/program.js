
let r0 = 0;
let r2 = 0;
let r3 = 0;
let r4 = 0;
let r5 = 0;

// 14559001 too low

function loop_c() {
    let iter = 0;
    r4 = 0;
    loop_c2: do {
        r3 = r4 | 65536;
        r4 = 16098955;
        loop_b2: do {
            r5 = r3 & 255;
            r4 += r5;
            r4 = r4 & 16777215;
            r4 = (r4 * 65899) & 16777215;
            if (256 > r3) {
                break; // to loop_c2
            } else {
                //console.log("r3 = " + r3);
                r5 = Math.floor(r3 / 256);
                r3 = r5;
            }
            iter++;
        } while (true);
        console.log([r0, "x", r2, r3, r4, r5]);
        console.log("TEST");
    } while (r4 !== r0);
    console.log("done, iter = " + iter);
}

function run(value_of_r0) {
    console.log("trying r0 = " + value_of_r0);
    r0 = value_of_r0;
    r2 = r3 = r4 = r5 = 0;
    loop_c();
}
// 15823996 correct on part 1
run(15823996);
