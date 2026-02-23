/**
 Guitar Scale Generator
 2023 Naoki Kishida
 */

// Module-level geometry constants (same formulas as in draw())
const FRET_LEFT = 25;
const STRING_TOP = 40;
function fretCalcPos(f: number): number { return f * (55 - f / 1.7); }
function fretCalcCenter(f: number): number { return (fretCalcPos(f) + fretCalcPos(f - 1)) / 2; }
function fretCenterX(pos: number): number {
    return fretCalcCenter(pos) + FRET_LEFT + (pos === 0 ? 14 : 0);
}

function draw(canvas: HTMLCanvasElement, name: string, notes: number[], k: number,
        stringCount: number, tune: number[], note: boolean, chord: boolean,
        highlights: Set<string>, hideNonHighlight: boolean) {
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
            if (hideNonHighlight && !highlights.has(`${i}_${pos}`)) continue;
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

    // Draw highlights
    ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    for (const h of highlights) {
        const parts = h.split("_");
        const strIdx = parseInt(parts[0]);
        const fretIdx = parseInt(parts[1]);
        if (strIdx >= stringCount) continue;
        const x = calcCenter(fretIdx) + LEFT + (fretIdx === 0 ? 14 : 0);
        const y = TOP + strIdx * 20;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2, true);
        ctx.fill();
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

const scales: [string, number[], boolean /*scale*/, boolean /*basic*/, string][] = [
    ["Major",         [2,0,1,0,1,1,0,1,0,1,0,1], true, true,  ""],
    ["Minor",         [2,0,1,1,0,1,0,1,1,0,1,0], true, true,  ""],
    ["Major Penta",   [2,0,1,0,1,0,0,1,0,1,0,0], true, true,  ""],
    ["Minor Penta",   [2,0,0,1,0,1,0,1,0,0,1,0], true, true,  ""],
    ["Major Blues",   [2,0,1,3,1,0,0,1,0,1,0,0], true, false, ""],
    ["Minor Blues",   [2,0,0,1,0,1,3,1,0,0,1,0], true, false, ""],
    ["Harmonic Minor",[2,0,1,1,0,1,0,1,1,0,0,1], true, true,  ""],
    ["Melodic Minor", [2,0,1,1,0,1,0,1,0,1,0,1], true, false, ""],
    ["Dorian",        [2,0,1,1,0,1,0,1,0,1,1,0], true, true,  ""],
    ["Phrygian",      [2,1,0,1,0,1,0,1,1,0,1,0], true, false, ""],
    ["Lydian",        [2,0,1,0,1,0,1,1,0,1,0,1], true, true,  ""],
    ["Lydian 7th",    [2,0,1,0,1,0,1,1,0,1,1,0], true, false, ""],
    ["Mixolydian",    [2,0,1,0,1,1,0,1,0,1,1,0], true, true,  ""],
    ["Locrian",       [2,1,0,1,0,1,1,0,1,0,1,0], true, false, ""],
    ["Diminish Scale",[2,0,1,1,0,1,1,0,1,1,0,1], true, false, ""],
    ["Con-Diminish",  [2,1,0,1,1,0,1,1,0,1,1,0], true, false, ""],
    ["Altered",       [2,1,0,1,1,0,1,0,1,0,1,0], true, false, ""],
    ["Whole tone",    [2,0,1,0,1,0,1,0,1,0,1,0], true, false, ""],
    ["Major Triad",   [2,0,0,0,1,0,0,1,0,0,0,0], false, true, ""],
    ["Minor Triad",   [2,0,0,1,0,0,0,1,0,0,0,0], false, true, "m"],
    ["Major 7th",     [2,0,0,0,1,0,0,1,0,0,0,1], false, true, "maj7"],
    ["Dominant 7th",  [2,0,0,0,1,0,0,1,0,0,1,0], false, true, "7"],
    ["Minor 7th",     [2,0,0,1,0,0,0,1,0,0,1,0], false, true, "m7"],
    ["Minor 7th♭5",  [2,0,0,1,0,0,1,0,0,0,1,0], false, true, "m7♭5"],
    ["Minor M7th",    [2,0,0,1,0,0,0,1,0,0,0,1], false, true, "mM7"],
    ["Diminish",      [2,0,0,1,0,0,1,0,0,1,0,0], false, false,"dim"],
    ["Augument",      [2,0,0,0,1,0,0,0,1,0,0,0], false, false,"aug"],
    ["Augument 7th",  [2,0,0,0,1,0,0,0,1,0,1,0], false, false,"aug7"],
];

const next = document.getElementById("next") as HTMLDivElement;
const contain = document.getElementById("contain") as HTMLDivElement;
const scaleHeader = document.getElementById("scale-next") as HTMLHeadElement;
const chordHeader = document.getElementById("chord-contained") as HTMLHeadElement;
function displayName(keyIdx: number, scaleIdx: number): string {
    const [name, , isScale, , suffix] = scales[scaleIdx];
    if (isScale) return keys[keyIdx] + " " + name;
    return keys[keyIdx] + suffix;
}

function findNext(keyIdx: number, scale: number) {
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
            row.innerHTML = displayName(keyIdx, idx);
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
            row.innerHTML = displayName(keyIdx, idx);
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
            row.innerHTML = displayName(keyIdx, idx);
            next.appendChild(row);
        }
    }
}

const scale = document.getElementById("scale") as HTMLSelectElement;
function scaleSelection(mode: number, adv: boolean) {
    const kidx = parseInt(key.value);
    const sel = scale.value;
    scale.innerHTML = "";
    for (const [idx, [val, , sc, basic, suffix]] of scales.entries()) {
        if (mode != 2) {
            if (mode == 0 !== sc) continue;
        }
        if (!adv && !basic) continue;
        const opt = document.createElement("option") as HTMLOptionElement;
        opt.value = idx.toString();
        opt.text = sc ? val : (keys[kidx] + suffix);
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

const fretboardsContainer = document.getElementById("fretboards") as HTMLDivElement;
const addFretboardBtn = document.getElementById("add-fretboard") as HTMLButtonElement;
let fretboards: Array<{key: number, scale: number, highlights: Set<string>, hideNonHighlight: boolean}> = [];
let dragSrcIndex = -1;

function encodeHighlights(fbs: Array<{highlights: Set<string>}>): string {
    const parts: string[] = [];
    for (let i = 0; i < fbs.length; i++) {
        if (fbs[i].highlights.size === 0) continue;
        let s = `fb${i + 1}`;
        const sorted = Array.from(fbs[i].highlights).sort((a, b) => {
            const [as2, af] = a.split("_").map(Number);
            const [bs2, bf] = b.split("_").map(Number);
            return as2 !== bs2 ? as2 - bs2 : af - bf;
        });
        for (const hkey of sorted) {
            const [strIdx, fretIdx] = hkey.split("_").map(Number);
            // string: 1-8 (strIdx+1 encoded as char '1'-'8')
            // fret:   0-24 encoded as 'a'-'y'
            s += String.fromCharCode("1".charCodeAt(0) + strIdx);
            s += String.fromCharCode("a".charCodeAt(0) + fretIdx);
        }
        parts.push(s);
    }
    return parts.join("+");
}

function decodeHighlights(encoded: string, count: number): Set<string>[] {
    const result: Set<string>[] = Array.from({length: count}, () => new Set<string>());
    if (!encoded) return result;
    const parts = encoded.split("+");
    for (const part of parts) {
        const match = part.match(/^fb([1-5])(.*)$/);
        if (!match) continue;
        const fbIdx = parseInt(match[1]) - 1;
        if (fbIdx < 0 || fbIdx >= count) continue;
        const pairs = match[2];
        for (let j = 0; j + 1 < pairs.length; j += 2) {
            const strIdx = pairs.charCodeAt(j) - "1".charCodeAt(0);
            const fretIdx = pairs.charCodeAt(j + 1) - "a".charCodeAt(0);
            if (strIdx >= 0 && strIdx < 8 && fretIdx >= 0 && fretIdx <= 24) {
                result[fbIdx].add(`${strIdx}_${fretIdx}`);
            }
        }
    }
    return result;
}

function renderFretboards() {
    const sn = parseInt(strings.value);
    const t = parseInt(tune.value);
    const n = note.checked;

    fretboardsContainer.innerHTML = "";

    for (let i = 0; i < fretboards.length; i++) {
        const entry = document.createElement("div");
        entry.className = "fretboard-entry";
        entry.draggable = true;

        const canvas = document.createElement("canvas");
        canvas.width = 1050;
        canvas.height = 250;
        canvas.style.cursor = "crosshair";
        entry.appendChild(canvas);

        const controlsDiv = document.createElement("div");
        controlsDiv.className = "fretboard-controls";

        const removeBtn = document.createElement("button");
        removeBtn.className = "fretboard-remove";
        removeBtn.textContent = "×";
        removeBtn.disabled = fretboards.length <= 1;
        removeBtn.onclick = () => {
            fretboards.splice(i, 1);
            renderFretboards();
        };
        controlsDiv.appendChild(removeBtn);

        const upBtn = document.createElement("button");
        upBtn.className = "fretboard-move";
        upBtn.textContent = "▲";
        upBtn.disabled = i === 0;
        upBtn.style.marginTop = "8px";
        upBtn.onclick = () => {
            [fretboards[i - 1], fretboards[i]] = [fretboards[i], fretboards[i - 1]];
            renderFretboards();
        };
        controlsDiv.appendChild(upBtn);

        const downBtn = document.createElement("button");
        downBtn.className = "fretboard-move";
        downBtn.textContent = "▼";
        downBtn.disabled = i === fretboards.length - 1;
        downBtn.onclick = () => {
            [fretboards[i], fretboards[i + 1]] = [fretboards[i + 1], fretboards[i]];
            renderFretboards();
        };
        controlsDiv.appendChild(downBtn);

        const hideBtn = document.createElement("button");
        hideBtn.className = "fretboard-move" + (fretboards[i].hideNonHighlight ? " active" : "");
        hideBtn.textContent = "🚫";
        hideBtn.title = "Hide non-highlighted positions";
        hideBtn.style.marginTop = "8px";
        hideBtn.onclick = () => {
            fretboards[i].hideNonHighlight = !fretboards[i].hideNonHighlight;
            renderFretboards();
        };
        controlsDiv.appendChild(hideBtn);

        const resetBtn = document.createElement("button");
        resetBtn.className = "fretboard-move";
        resetBtn.textContent = "↺";
        resetBtn.title = "Clear highlights";
        resetBtn.style.marginTop = "4px";
        resetBtn.onclick = () => {
            fretboards[i].highlights = new Set<string>();
            renderFretboards();
        };
        controlsDiv.appendChild(resetBtn);

        entry.appendChild(controlsDiv);

        entry.addEventListener("dragstart", (e) => {
            dragSrcIndex = i;
            entry.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
        });
        entry.addEventListener("dragend", () => {
            dragSrcIndex = -1;
            for (const child of Array.from(fretboardsContainer.children)) {
                child.classList.remove("dragging", "drag-over");
            }
        });
        entry.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            for (const child of Array.from(fretboardsContainer.children)) {
                child.classList.remove("drag-over");
            }
            if (dragSrcIndex !== i) {
                entry.classList.add("drag-over");
            }
        });
        entry.addEventListener("drop", (e) => {
            e.preventDefault();
            if (dragSrcIndex >= 0 && dragSrcIndex !== i) {
                const [moved] = fretboards.splice(dragSrcIndex, 1);
                fretboards.splice(i, 0, moved);
                renderFretboards();
            }
        });

        // Click to toggle highlight
        canvas.addEventListener("click", (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const cx = (e.clientX - rect.left) * scaleX;
            const cy = (e.clientY - rect.top) * scaleY;

            const stringIdx = Math.round((cy - STRING_TOP) / 20);
            if (stringIdx < 0 || stringIdx >= sn) return;

            let nearestFret = -1;
            let minDist = Infinity;
            for (let pos = 0; pos <= 24; pos++) {
                const fx = fretCenterX(pos);
                const dist = Math.abs(cx - fx);
                if (dist < minDist) {
                    minDist = dist;
                    nearestFret = pos;
                }
            }
            if (nearestFret < 0 || minDist > 25) return;

            const hkey = `${stringIdx}_${nearestFret}`;
            const fb = fretboards[i];
            if (fb.highlights.has(hkey)) {
                fb.highlights.delete(hkey);
            } else {
                fb.highlights.add(hkey);
            }

            draw(canvas, displayName(fb.key, fb.scale), scales[fb.scale][1],
                fb.key, sn, tunes[t][1], n, !scales[fb.scale][2], fb.highlights, fb.hideNonHighlight);
            updateUrl();
        });

        fretboardsContainer.appendChild(entry);

        const fb = fretboards[i];
        draw(canvas, displayName(fb.key, fb.scale), scales[fb.scale][1],
            fb.key, sn, tunes[t][1], n, !scales[fb.scale][2], fb.highlights, fb.hideNonHighlight);
    }

    addFretboardBtn.disabled = fretboards.length >= 5;
    updateUrl();
}

addFretboardBtn.onclick = () => {
    if (fretboards.length < 5) {
        const copiedHighlights = new Set<string>(fretboards[0].highlights);
        fretboards.push({ key: parseInt(key.value), scale: parseInt(scale.value), highlights: copiedHighlights, hideNonHighlight: fretboards[0].hideNonHighlight });
        fretboards[0].highlights = new Set<string>();
        fretboards[0].hideNonHighlight = false;
        renderFretboards();
    }
};

function repaint() {
    const k = parseInt(key.value);
    const s = parseInt(scale.value);
    fretboards[0] = { key: k, scale: s, highlights: fretboards[0]?.highlights ?? new Set<string>(), hideNonHighlight: fretboards[0]?.hideNonHighlight ?? false };
    findNext(k, s);
    renderFretboards();
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

const keyUrlNames = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"];

function scaleSlug(name: string): string {
    return name.replace(/\s+/g, "_").replace(/♭/g, "b").replace(/♯/g, "s")
               .replace(/\//g, "").replace(/[^a-zA-Z0-9_-]/g, "");
}

function chordSuffix(scaleIdx: number): string {
    const [, , , , suffix] = scales[scaleIdx];
    return suffix.replace(/♭/g, "b").replace(/♯/g, "s");
}

function fretboardToSlug(fb: {key: number, scale: number}): string {
    const [name, , isScale] = scales[fb.scale];
    const keySlug = keyUrlNames[fb.key];
    if (isScale) return keySlug + scaleSlug(name);
    return keySlug + chordSuffix(fb.scale);
}

function parseFretboardSlug(slug: string): {key: number, scale: number} | null {
    // キースラッグは1〜2文字 (Cs, Ds, Fs, Gs, As が2文字)
    let kidx = keyUrlNames.indexOf(slug.substring(0, 2));
    let scaleStr = slug.substring(2);
    if (kidx < 0) {
        kidx = keyUrlNames.indexOf(slug.substring(0, 1));
        if (kidx < 0) return null;
        scaleStr = slug.substring(1);
    }
    const sidx = scales.findIndex(([name, , isScale, , suffix]) =>
        isScale ? scaleSlug(name) === scaleStr
                : suffix.replace(/♭/g, "b").replace(/♯/g, "s") === scaleStr);
    if (sidx < 0) return null;
    return { key: kidx, scale: sidx };
}

function updateUrl() {
    if (fretboards.length === 0) return;
    const params = new URLSearchParams();
    params.set("fretboards", fretboards.map(fretboardToSlug).join(" "));
    params.set("strings", strings.value);
    params.set("tune", tune.value);
    if (note.checked) params.set("note", "1");
    const hlEncoded = encodeHighlights(fretboards);
    if (hlEncoded) params.set("highlights", hlEncoded);
    const hideEncoded = fretboards.map((fb, i) => fb.hideNonHighlight ? (i + 1).toString() : "").join("");
    if (hideEncoded) params.set("hide", hideEncoded);
    history.replaceState(null, "", "?" + params.toString());
    const titlePart = fretboards.map(fb => displayName(fb.key, fb.scale)).join("+");
    const t = parseInt(tune.value);
    const tuneLabel = t !== 0 ? " [" + tunes[t][0] + "]" : "";
    document.title = "Guitar Scale: " + titlePart + tuneLabel;
    (document.getElementById("header") as HTMLHeadingElement).textContent =
        "Guitar Scale Generator" + tuneLabel;
}

key.onchange = changeMode;
scale.onchange = repaint;
strings.onchange = repaint;
tune.onchange = repaint;
note.onchange = repaint;
advanced.onchange = changeMode;
types.forEach(elm => elm.onchange = changeMode);

// URLパラメータ解析
const urlParams = new URLSearchParams(window.location.search);
const fretboardsParam = urlParams.get("fretboards");
const stringsParam = urlParams.get("strings");
const tuneParam = urlParams.get("tune");
const noteParam = urlParams.get("note");
const highlightsParam = urlParams.get("highlights");
const hideParam = urlParams.get("hide");

// strings / tune / note を適用
if (stringsParam) {
    const v = parseInt(stringsParam);
    if (v >= 4 && v <= 8) strings.value = v.toString();
}
if (tuneParam) {
    const v = parseInt(tuneParam);
    if (v >= 0 && v < tunes.length) tune.value = v.toString();
}
if (noteParam) note.checked = noteParam === "1";

// fretboards を解析
let urlFretboards: Array<{key: number, scale: number}> | null = null;
if (fretboardsParam) {
    const parsed = fretboardsParam.split(" ")
        .map(parseFretboardSlug)
        .filter((fb): fb is {key: number, scale: number} => fb !== null);
    if (parsed.length > 0) urlFretboards = parsed;
}

// 1番目のフレットボードのスケール種別からtype/advancedを自動設定
if (urlFretboards && urlFretboards.length > 0) {
    const [, , isScale, isBasic] = scales[urlFretboards[0].scale];
    if (!isBasic) advanced.checked = true;
    types[isScale ? 0 : 1].checked = true;
    key.value = urlFretboards[0].key.toString();
}

changeMode(); // スケールドロップダウンを構築してrepaint()呼び出し

// URLフレットボードで上書き
if (urlFretboards && urlFretboards.length > 0) {
    const hlSets = decodeHighlights(highlightsParam ?? "", urlFretboards.length);
    fretboards = urlFretboards.map((fb, idx) => ({ ...fb, highlights: hlSets[idx], hideNonHighlight: (hideParam ?? "").includes((idx + 1).toString()) }));
    scale.value = fretboards[0].scale.toString();
    repaint();
}
