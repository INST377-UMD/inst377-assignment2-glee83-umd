function initializeDogs() {
    const slider = document.getElementById('slider');
    const sliderScript = document.createElement('script');
    sliderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/simple-slider/1.0.0/simpleslider.min.js';
    sliderScript.onload = () => {
        fetch('https://dog.ceo/api/breeds/image/random/10')
        .then(res => res.json())
        .then(data => {
            data.message.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.width = 612;
                img.height = 612;
                slider.appendChild(img);
            });
            simpleslider.getSlider({
                container: slider,
                transitionDuration: 1,
                delay: 3
            });
        });
    };

    document.body.appendChild(sliderScript);

    fetch('https://dogapi.dog/api/v2/breeds')
    .then(res => res.json())
    .then(data => {
        const breedContainer = document.getElementById('breed-buttons');
        const breedInfo = document.getElementById('breed-info');
        data.data.forEach(breed => {
            const { name, description, life } = breed.attributes;
            const breedbutton = document.createElement('button');
            breedbutton.textContent = name;
            breedbutton.setAttribute('class', 'dog-button');
            breedbutton.onclick = () => {
                breedInfo.innerHTML = `
                <h4>${name}</h4>
                <p>${description || 'No description available.'}</p>
                <p>Life Span: ${life.min}–${life.max} years</p>
                `;
            };
            breedContainer.appendChild(breedbutton);
        });
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
            },
            'load dog breed *breed': breed => {
                document.querySelectorAll('#breed-buttons button').forEach(button => {
                    if (button.innerText.toLowerCase() === breed.toLowerCase()) {
                        button.click();
                    }
                });
            }
        };
        annyang.addCommands(commands);
    };
    document.head.appendChild(script);
}

window.onload = initializeDogs;