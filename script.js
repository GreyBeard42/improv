const form = [
    [
        "Bb6", "Gm7", "Cm7", "F7",
        "Bb6", "Gm7", "Cm7", "F7",
        "Fm7","Bb7","Ebmaj7","Ebm6",
        "Dm7","Gm7 ","Cm7 ","F7",

        "Bb6", "Gm7", "Cm7", "F7",
        "Bb6", "Gm7", "Cm7", "F7",
        "Fm7","Bb7","Ebmaj7","Ebm6",
        "Dm7","Gm7 ","Cm7 ","F7",

        "!D7", "!D7", "!G7", "!G7",
        "!C7", "!C7", "!F7", "!F7",

        "Bb6", "Gm7", "Cm7", "F7",
        "Bb6", "Gm7", "Cm7", "F7",
        "Fm7","Bb7","Ebmaj7","Ebm6",
        "Dm7","Gm7 ","Cm7 ","F7",
    ],
    [
        "C7","F7","C7","C7",
        "F7","F7","C7","C7",
        "Dm7","G7alt","C7","G7#5"
    ]
]

const chordNotes = [
    {
        "Bb6": ["Bb3", "D4", "F4", "G4"],
        "G7":  ["G3", "B3", "D4", "F4"],
        "Gm7":  ["G3", "B3", "D4", "F4"],
        "Cm7": ["C4", "Eb4", "G4", "Bb4"],
        "F7":  ["F3", "A3", "C4", "Eb4"],
        "Fm7":  ["C4", "E4", "F4", "Ab4"],
        "Bb7":  ["B3", "D4", "F4", "Ab4"],
        "Ebmaj7":  ["B3", "D4", "Eb4", "G4"],
        "Ebm6":  ["Bb3", "C4", "Eb4", "Gb4"],
        "Dm7":  ["A3", "C4", "D4", "F4"],
        "Gm7 ":  ["G3", "Bb3", "D4", "E4"],
        "Cm7 ": ["G3", "Bb3", "C4", "Eb4"],
        "!D7":  ["D3", "F#4", "A4", "C5","E5"],
        "!G7":  ["G3", "F4", "G4", "E5"],
        "!C7":  ["C3", "E4", "G4", "Bb4","D5"],
        "!F7":  ["F3", "Eb4", "A4", "D5"]
    },
    {
        "C7": ["C3","E4","Bb4","D5"],
        "F7": ["F3","Eb4","Bb4","D5"],
        "Dm7": ["D3","F4","A4","C5","E5"],
        "G7alt": ["G3","F4","Ab4","C5","Eb5"],
        "G7#5": ["G3","F4","B4",]
    }
]

const fscales = [
    [
        "Bb","Bb","Eb","Bb",
        "Bb","Bb","Eb","Bb",
        "D7","G7","C7","F7",
        "Bb","Bb","Eb","Bb",
    ],
    [
        "C","C","C","C","C","C"
    ]
]

const scales = [
    {
        "Bb": ["Bb3","C4","D4","Eb4","F4","G4","A4","Bb4","C5","D5"],
        "Eb": ["Bb3","C4","D4","Eb4","F4","G4","Ab4","Bb4","C5","D5"],
        "D7": ["B3","C#4","D4","E4","F#4","G4","A4","B4","C#5","D5"],
        "G7": ["B3","C4","D4","E4","F#4","G4","A4","B4","C5","D5"],
        "C7": ["B3","C4","D4","E4","F4","G4","A4","B4","C5","D5"],
        "F7": ["Bb3","C4","D4","E4","F4","G4","A4","Bb4","C5","D5"],
    },
    {
        "C": ["C4","D4","Eb4","E4","F4","Fb4","G4","Bb4","C5","Eb4"]
    }
]

let curform = 0
if(document.getElementById("form")) document.getElementById("form").addEventListener("change",()=>{
    curform = document.getElementById("form").value
})

document.getElementById("play").onclick = async () => {
    await Tone.start()

    const ctx = Tone.getContext().rawContext;

    window.organ = await Soundfont.instrument(
        ctx,
        "drawbar_organ"
    )

    window.vibe = await Soundfont.instrument(
        ctx,
        "vibraphone"
    )

    console.log("Ready!");

    const bpm = 120;
    const secondsPerBar = 60 / bpm * 2;

    let nextBarTime = ctx.currentTime;
    let barIndex = 0;

    function scheduler() {
        while (nextBarTime < ctx.currentTime + 0.1) {
            const chord = form[curform][barIndex];
            console.log(barIndex + 1, chord);
            chordNotes[curform][chord].forEach(note => {
                organ.play(note, nextBarTime, {
                    duration: secondsPerBar,
                    gain: 0.5
                });
            });

            // lead
            let scale = scales[curform][fscales[curform][Math.floor(barIndex/4)]]
            if(Math.random() < 0.7 && (barIndex < 32 || barIndex > 48) && curform!=1) {
                vibe.play(chordNotes[curform][chord][Math.round(Math.random()*(chordNotes[curform][chord].length-1))], nextBarTime, {
                    duration: secondsPerBar/2,
                    gain: Math.random()+1.5
                });
            } else {
                vibe.play(scale[Math.round(Math.random()*(scale.length-1))], nextBarTime, {
                    duration: secondsPerBar/2,
                    gain: Math.random()+1.5
                });
            }
            if(Math.random() < 0.6 || curform==1) {
                if(Math.random() < 0.7) {
                    if(Math.random() < 0.2) {
                        vibe.play(chordNotes[curform][chord][Math.round(Math.random()*(chordNotes[curform][chord].length-1))], nextBarTime+secondsPerBar/2, {
                            duration: secondsPerBar/4,
                            gain: Math.random()+1.5
                        });
                        vibe.play(chordNotes[curform][chord][Math.round(Math.random()*(chordNotes[curform][chord].length-1))], nextBarTime+secondsPerBar*0.75, {
                            duration: secondsPerBar/4,
                            gain: Math.random()+1.5
                        });
                    } else if(Math.random() < 0.1) {
                        vibe.play(chordNotes[curform][chord][Math.round(Math.random()*(chordNotes[curform][chord].length-1))], nextBarTime+secondsPerBar/2, {
                            duration: secondsPerBar/6,
                            gain: Math.random()+1.5
                        });
                        vibe.play(chordNotes[curform][chord][Math.round(Math.random()*(chordNotes[curform][chord].length-1))], nextBarTime+secondsPerBar/2+secondsPerBar/6, {
                            duration: secondsPerBar/6,
                            gain: Math.random()+1.5
                        });
                        vibe.play(chordNotes[curform][chord][Math.round(Math.random()*(chordNotes[curform][chord].length-1))], nextBarTime+secondsPerBar/2+secondsPerBar/3, {
                            duration: secondsPerBar/6,
                            gain: Math.random()+1.5
                        });
                    } else {
                        vibe.play(chordNotes[curform][chord][Math.round(Math.random()*(chordNotes[curform][chord].length-1))], nextBarTime+secondsPerBar/2, {
                            duration: secondsPerBar/2,
                            gain: Math.random()+1.5
                        });
                    }
                } else {
                    vibe.play(scale[Math.round(Math.random()*(scale.length-1))], nextBarTime+secondsPerBar/2, {
                        duration: secondsPerBar/2,
                        gain: 2
                    });
                }
            }
            
            nextBarTime += secondsPerBar;
            barIndex = (barIndex + 1) % form[curform].length;
            document.getElementById("current").innerText = chord
        }
        requestAnimationFrame(scheduler);
    }

    scheduler();
};