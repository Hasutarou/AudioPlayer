document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const points = document.querySelectorAll('.point');
    const pointSections = document.querySelectorAll('.point-section');

    // Закрашиваем точки по скроллу
    function updatePoints() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const totalProgress = scrollTop / (documentHeight - windowHeight);
        const activeCount = Math.floor(totalProgress * points.length);

        points.forEach((point, index) => {
            if (index < activeCount) {
                point.classList.add('active');
            } else {
                point.classList.remove('active');
            }
        });
    }

    // Определяем активную секцию по положению скролла
    function updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach((section, index) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollPosition >= top && scrollPosition < bottom) {
                pointSections.forEach((s, i) => {
                    if (i === index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            }
        });
    }
    
    // Обновление позици панели
        function updatePositionPanel() {
            const settingsPanel = document.querySelector('.panel');
            if (window.scrollY < 50) {
                settingsPanel.classList.add('transform');
            } else {
                settingsPanel.classList.remove('transform');
            }
        }
    
    function update() {
        updatePoints();
        updateActiveSection();
        updatePositionPanel();
    }

    window.addEventListener('scroll', update);
    update();
});