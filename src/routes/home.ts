export function home(req: any, res: any, next: any): void {
    res.send(`
        <head>
            <title>music api</title>
            <style>
                body {
                    background: rgb(214,133,70);
                    background: linear-gradient(90deg, rgba(214,133,70,1) 2%, rgba(166,17,17,1) 100%);
                }
                h1 {
                    font-family: "Comic Sans MS", cursive, sans-serif
                }
            </style>
        </head>
        <center><h1>Epic backend for music player</h1></center>
    `);
}