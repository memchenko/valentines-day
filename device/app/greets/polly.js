const { exec } = require('child_process');

const text = process.argv[2];
const filename = process.argv[3];

console.log(text);
console.log(filename);

exec([
    'aws polly synthesize-speech',
    '--output-format mp3',
    '--voice-id Maxim',
    `--text ${text}`,
    `${filename}.mp3`
].join(' '));