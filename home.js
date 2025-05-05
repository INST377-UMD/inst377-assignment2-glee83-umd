function initializeHome() {
    fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => {
        const quote = data[0].q;
        const author = data[0].a;
        document.getElementById('quote').innerHTML = `"${quote}"<br>— ${author}`;
    });

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js';
    script.onload = () => {
        const commands = {
            'hello': () => alert('Hello'),
            'change the color to *color': color => document.body.style.backgroundColor = color,
            'navigate to *page': page => {
                const p = page.toLowerCase();
                if (p.includes('home')) location.href = 'home.html';
                else if (p.includes('stock')) location.href = 'stocks.html';
                else if (p.includes('dog')) location.href = 'dogs.html';
            }
        };

        annyang.addCommands(commands);
    };
    document.head.appendChild(script);
}

window.onload = initializeHome;