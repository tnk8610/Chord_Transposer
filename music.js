// ── 音楽ロジック ────────────────────────────────────────────────

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// ルート音（A〜G + #）で始まるトークンはすべてコードとして扱う
const CHORD_RE = /^[A-G][#]?.*/;

function transposeNote(note, semitones) {
  const idx = CHROMATIC.indexOf(note);
  if (idx === -1) return note;
  return CHROMATIC[((idx + semitones) % 12 + 12) % 12];
}

function transposeChord(chord, semitones) {
  return chord.split("/").map(part => {
    const m = part.match(/^([A-G][#]?)/);
    if (!m) return part;
    return transposeNote(m[1], semitones) + part.slice(m[1].length);
  }).join("/");
}

function tokenizeLine(line) {
  const parts = line.split(/(\s+)/);
  return parts.map(part => {
    if (/^\s+$/.test(part) || part === "") {
      return { type: "space", value: part };
    } else if (CHORD_RE.test(part)) {
      return { type: "chord", value: part };
    } else {
      return { type: "text", value: part };
    }
  });
}

function transposeLine(line, semitones) {
  if (semitones === 0) return tokenizeLine(line);
  return tokenizeLine(line).map(tok => {
    if (tok.type === "chord") {
      return { type: "chord", value: transposeChord(tok.value, semitones) };
    }
    return tok;
  });
}
