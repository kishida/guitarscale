/**
 Guitar Scale Generator
 2023 Naoki Kishida
 */

function draw(name: string, notes: number[], k: number,
        stringCount: number, tune: number[], note: boolean, chord: boolean) {
    function calcPos(f: number): number {
        return f * (55 - f / 1.7);
    }
    function calcCenter(f:number): number {
        return (calcPos(f) + calcPos(f - 1)) / 2;
    }

    const LEFT = 25;
    const TOP = 40;

    const noteName: string[][] = [
        ["T", "2♭","2","3♭","3","4","4♯","5","6♭","6","7♭","7"],
        ["T", "2♭","2","3♭","3","4","5♭","5","6♭","6","7♭","7"]
    ];

    const canvas = document.getElementById("canv") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const bottom = TOP + (stringCount - 1) * 20;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < stringCount; i++) {
        ctx.moveTo(LEFT - 4, TOP + i * 20);
        ctx.lineTo(LEFT + calcPos(24), TOP + i * 20);
    }
    for (let i = 0; i <= 24; i++) {
        ctx.moveTo(LEFT + calcPos(i), TOP + 0 * 20);
        ctx.lineTo(LEFT + calcPos(i), bottom);
    }
    ctx.moveTo(LEFT - 4, TOP);
    ctx.lineTo(LEFT - 4, bottom);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "15pt Arial";
    ctx.fillText(name, LEFT, 15);

    const marks: number[] = [3, 5, 7, 9, 12, 15, 17, 19, 21];
    ctx.font = "13pt Arial";
    for (let p of marks) {
        ctx.fillText(p.toString(), calcCenter(p) + LEFT - 5, bottom + 30);
    }

    const offset = 4 + 24 - k; // E
    for (let i = 0; i < stringCount; i++) {
        const str = i + (stringCount < 6 ? 1 : 0);
        for (let pos = 0; pos <= 24; pos++) {
            const noteNum = (tune[str] + pos + offset) % 12;
            const flag = notes[noteNum];
            if (flag == 0) continue;
            const x = calcCenter(pos) + LEFT + (pos == 0 ? 14 : 0);
            if (note) {
                ctx.fillText(noteName[chord ? 1 : 0][noteNum], x - 3, TOP+ 5 + i * 20);
            } else {
                ctx.beginPath();
                ctx.arc(x, TOP + i * 20, 7, 0, Math.PI * 2, true);
                switch (flag) {
                    case 1:
                        ctx.fillStyle = "black";
                        ctx.fill();
                        break;
                    case 2: // root
                        ctx.fillStyle = "white";
                        ctx.fill();
                        ctx.stroke();
                        break;
                    case 3: // blue note
                        ctx.fillStyle = "blue";
                        ctx.fill();
                        break;
                }
            }
        }
    }
}


const keys: string[] = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
const key = document.getElementById("key") as HTMLSelectElement;
for (const [idx, val] of keys.entries()) {
    const opt = document.createElement("option") as HTMLOptionElement;
    opt.value = idx.toString();
    opt.text = val;
    key.appendChild(opt);
}

const scales: [string, number[], boolean /*scale*/, boolean /*basic*/][] = [
    ["Major",         [2,0,1,0,1,1,0,1,0,1,0,1], true, true],
    ["Minor",         [2,0,1,1,0,1,0,1,1,0,1,0], true, true],
    ["Major Penta",   [2,0,1,0,1,0,0,1,0,1,0,0], true, true],
    ["Minor Penta",   [2,0,0,1,0,1,0,1,0,0,1,0], true, true],
    ["Major Blues",   [2,0,1,3,1,0,0,1,0,1,0,0], true, false],
    ["Minor Blues",   [2,0,0,1,0,1,3,1,0,0,1,0], true, false],
    ["Harmonic Minor",[2,0,1,1,0,1,0,1,1,0,0,1], true, true],
    ["Melodic Minor", [2,0,1,1,0,1,0,1,0,1,0,1], true, false],
    ["Dorian",        [2,0,1,1,0,1,0,1,0,1,1,0], true, true],
    ["Phrygian",      [2,1,0,1,0,1,0,1,1,0,1,0], true, false],
    ["Lydian",        [2,0,1,0,1,0,1,1,0,1,0,1], true, true],
    ["Lydian 7th",    [2,0,1,0,1,0,1,1,0,1,1,0], true, false],
    ["Mixolydian",    [2,0,1,0,1,1,0,1,0,1,1,0], true, true],
    ["Locrian",       [2,1,0,1,0,1,1,0,1,0,1,0], true, false],
    ["Diminish Scale",[2,0,1,1,0,1,1,0,1,1,0,1], true, false],
    ["Con-Diminish",  [2,1,0,1,1,0,1,1,0,1,1,0], true, false],
    ["Altered",       [2,1,0,1,1,0,1,0,1,0,1,0], true, false],
    ["Whole tone",    [2,0,1,0,1,0,1,0,1,0,1,0], true, false],
    ["Major Triad",   [2,0,0,0,1,0,0,1,0,0,0,0], false, true],
    ["Minor Triad",   [2,0,0,1,0,0,0,1,0,0,0,0], false, true],
    ["Major 7th",     [2,0,0,0,1,0,0,1,0,0,0,1], false, true],
    ["Dominant 7th",  [2,0,0,0,1,0,0,1,0,0,1,0], false, true],
    ["Minor 7th",     [2,0,0,1,0,0,0,1,0,0,1,0], false, true],
    ["Minor 7th♭5",  [2,0,0,1,0,0,1,0,0,0,1,0], false, true],
    ["Minor M7th",    [2,0,0,1,0,0,0,1,0,0,0,1], false, true],
    ["Diminish",      [2,0,0,1,0,0,1,0,0,1,0,0], false, false],
    ["Augument",      [2,0,0,0,1,0,0,0,1,0,0,0], false, false],
    ["Augument 7th",  [2,0,0,0,1,0,0,0,1,0,1,0], false, false],
];

const next = document.getElementById("next") as HTMLDivElement;
const contain = document.getElementById("contain") as HTMLDivElement;
const scaleHeader = document.getElementById("scale-next") as HTMLHeadElement;
const chordHeader = document.getElementById("chord-contained") as HTMLHeadElement;
function findNext(key: string, scale: number) {
    next.innerHTML = "";
    contain.innerHTML = "";

    const scaleNote = scales[scale][1];
    
    if (scales[scale][2]) {
        //scale
        scaleHeader.textContent = "Scale next to";
        chordHeader.textContent = "Chord contained";
        OUTER: for (const [idx, [name, nextScale, isScale]] of scales.entries()) {
            if (!isScale || idx == scale) continue;
            let count = 0;
            for (const [j, n] of scaleNote.entries()) {
                if ((n !== 0) != (nextScale[j] !== 0)) {
                    count++;
                    if (count > 2) {
                        continue OUTER;
                    }
                }
            }
            const row = document.createElement("div") as HTMLDivElement;
            row.innerHTML = key + " " + name;
            next.appendChild(row);
        }

        OUTER: for (const [idx, [name, nextScale, isScale]] of scales.entries()) {
            if (isScale || idx == scale) continue;
            for (const [j, n] of scaleNote.entries()) {
                if (n === 0 && nextScale[j] !== 0) {
                    continue OUTER;
                }
            }
            const row = document.createElement("div") as HTMLDivElement;
            row.innerHTML = key + " " + name;
            contain.appendChild(row);
        }
    } else {
        // chord
        scaleHeader.textContent = "Scale contains";
        chordHeader.textContent = "";
        OUTER: for (const [idx, [name, nextScale, isScale]] of scales.entries()) {
            if (!isScale) continue;
            for (const [j, n] of scaleNote.entries()) {
                if (n !== 0 && nextScale[j] === 0) {
                    continue OUTER;
                }
            }
            const row = document.createElement("div") as HTMLDivElement;
            row.innerHTML = key + " " + name;
            next.appendChild(row);
        }
    }
}

const scale = document.getElementById("scale") as HTMLSelectElement;
function scaleSelection(mode: number, adv: boolean) {
    const sel = scale.value;
    scale.innerHTML = "";
    for (const [idx, [val, ,sc, basic]] of scales.entries()) {
        if (mode != 2) {
            if (mode == 0 !== sc) continue;
        }
        if (!adv && !basic) continue;
        const opt = document.createElement("option") as HTMLOptionElement;
        opt.value = idx.toString();
        opt.text = val;
        if (idx.toString() === sel) opt.selected = true;
        scale.appendChild(opt);
    }
}

const strings = document.getElementById("strings") as HTMLSelectElement;
for (let i = 4; i <= 8; i++) {
    const opt = document.createElement("option") as HTMLOptionElement;
    opt.value = i.toString();
    opt.text = i + " strings";
    strings.appendChild(opt);
}
strings.selectedIndex = 2;

const tunes: [string, number[]][] = [
    ["Regular", [24, 19, 15, 10, 5, 0, -5, -10]],
    ["Drop D",  [24, 19, 15, 10, 5, -2, -7, -12]],
    ["DADGAD",  [22, 17, 15, 10, 5, -2, -7, -9]],
    ["Bass",    [20, 15, 10, 5, 0, -5, -10, -15]]
];
const tune = document.getElementById("tune") as HTMLSelectElement;
for (const [idx, [val]] of tunes.entries()) {
    const opt = document.createElement("option") as HTMLOptionElement;
    opt.value = idx.toString();
    opt.text = val;
    tune.appendChild(opt);    
}

const note = document.getElementById("note") as HTMLInputElement;
const keyboard = document.getElementById("keyb") as HTMLCanvasElement;

function drawKey(notes: number[], k: number) {
    const ctx = keyboard.getContext("2d");
    const width = keyboard.width;
    const height = keyboard.height;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    
    const keys = 14;
    const keyWidth = width / keys;
    const offset = 3;

    const keyMap = [0, 1, 2, 3, 4, -1, 5, 6, 7, 8, 9, 10, 11, -1];
    // draw white keys
    ctx.fillStyle = "white";
    for (let i = 0; i < keys; i++) {
      ctx.fillRect(i * keyWidth + 1, 0, keyWidth - 2, height - 2);
    }
    // draw black keys
    ctx.fillStyle = "black";
    const gap = 5;
    for (let i = 0; i < keys; i++) {
        if (((i + offset) % 7) == 2 || ((i + offset) % 7) == 6) continue;
      ctx.fillRect(i * keyWidth + keyWidth / 2 + gap, 0, keyWidth - 2 - gap * 2, height *2 / 3);
    }
    
    for (let i = 0; i < keys * 2; ++i) {
        const m = keyMap[(i + offset * 2) % 14];
        if (m < 0) continue;
        const n = notes[(m + 12 - k) % 12];
        if (n === 0) continue;
        const root = n === 2;
        const blue = n === 3;
        const white = i % 2 === 0;
        ctx.beginPath();
        ctx.arc((i + 1) * keyWidth / 2, height / 2 + (white ? height / 3 : 0), 7, 0, Math.PI * 2, true);
        ctx.lineWidth = 2;
        if (blue) {
            ctx.fillStyle = "blue";
            ctx.strokeStyle = "none";
        } else if (root) {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
        } else {
            ctx.fillStyle = "black";
            ctx.strokeStyle = "white";
        }
        ctx.fill();
        if (root == white) {
            ctx.stroke();
        }
    }
}

function repaint() {
    const k = parseInt(key.value);
    const s = parseInt(scale.value);
    const sn= parseInt(strings.value);
    const t = parseInt(tune.value);
    const n = note.checked;
    findNext(keys[k], s);
    draw(keys[k] + " " + scales[s][0], scales[s][1], k, sn, tunes[t][1], n, !scales[s][2]);
    drawKey(scales[s][1], k);
}

const advanced = document.getElementById("advanced") as HTMLInputElement;
const types = [
    document.getElementById("t0") as HTMLInputElement,
    document.getElementById("t1") as HTMLInputElement,
    document.getElementById("t2") as HTMLInputElement,
]

function changeMode() {
    let idx = 0;
    for (; idx < types.length; idx++) {
        if (types[idx].checked) break;
    }
    if (idx >= types.length) idx = 0;
    scaleSelection(idx, advanced.checked);
    repaint();
}

key.onchange = repaint;
scale.onchange = repaint;
strings.onchange = repaint;
tune.onchange = repaint;
note.onchange = repaint;
advanced.onchange = changeMode;
types.forEach(elm => elm.onchange = changeMode);

changeMode();