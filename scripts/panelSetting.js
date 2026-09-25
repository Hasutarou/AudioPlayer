document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('no-transition');
    themes.checkingTheme();
})

class Themes {
    constructor() {
        this.iconTheme = document.getElementById('btn-theme-svg');
        this.isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
        this.transitionDOM = document.getElementById('btn-theme-svg');

        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 500);

        document.getElementById('btn-theme').addEventListener('click', () => {
            this.changingTheme();
        });
    }

    checkingTheme() {
        if (!this.isDarkTheme) {
            document.querySelector('body').dataset.theme = 'light';
            this.iconTheme.outerHTML = `
              <svg id="btn-theme-svg" class="panel__button-icon" viewBox="0 0 86.95 99.24">
                <line x1="44.29" y1="18.82" x2="44.29" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="44.29" y1="99.24" x2="44.29" y2="80.42" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="69.6" y1="49.62" x2="85.56" y2="49.62" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="1.39" y1="49.62" x2="17.35" y2="49.62" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="70" y1="64.62" x2="86.21" y2="73.79" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1=".74" y1="25.45" x2="16.95" y2="34.62" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="69.53" y1="33.8" x2="85.46" y2="24.13" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="1.49" y1="75.11" x2="17.42" y2="65.44" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="57.54" y1="25.75" x2="66.14" y2="11.17" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="20.81" y1="88.08" x2="29.41" y2="73.49" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="29.63" y1="26.17" x2="21.16" y2="11.83" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><line x1="65.79" y1="87.41" x2="57.32" y2="73.07" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/><g><path d="M49.15,39.43v.16c0,7.64-11.14,11.46-11.14,18.86,0,.39,.03,.77,.1,1.17,.69,4.4,2.99,7.85,5.46,10.38,3.18,3.26,6.65,4.99,7.34,5.32-2.36,.72-4.85,1.11-7.43,1.11-14.33,0-26.12-11.96-26.12-26.49,0-12.09,8.16-22.4,19.17-25.52l.15,.5c3.02,1.75,6.1,3.86,8.46,6.3,2.36,2.43,3.96,5.18,4.02,8.21Z" fill="#fff"/><path d="M36.67,24.92c3.02,1.75,6.1,3.86,8.46,6.3,2.36,2.43,3.96,5.18,4.02,8.21v.16c0,7.64-11.14,11.46-11.14,18.86,0,.39,.03,.77,.1,1.17,.69,4.4,2.99,7.85,5.46,10.38,3.18,3.26,6.65,4.99,7.34,5.32,10.76-3.28,18.69-13.46,18.69-25.38,0-14.53-11.8-26.48-26.13-26.48-2.4,0-4.73,.33-6.95,.96-11,3.12-19.17,13.43-19.17,25.52,0,14.53,11.79,26.49,26.12,26.49,2.59,0,5.08-.4,7.43-1.11" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3"/></g>
              </svg>
            `;

            this.iconTheme = document.getElementById('btn-theme-svg');
            this.iconTheme.classList.add('light-relax');
        } else {
            document.querySelector('body').dataset.theme = 'dark';
            this.iconTheme.outerHTML = `
              <svg id="btn-theme-svg" class="panel__button-icon" viewBox="0 0 83.77 92.56">
                <path d="M71.94,83.59c-7.29,5.02-16.13,7.97-25.65,7.97C21.27,91.56,1,71.29,1,46.28S21.27,1,46.28,1c1.09,0,2.18,.05,3.25,.13-11.85,8.17-19.63,21.83-19.63,37.31,0,23.91,18.54,43.48,42.03,45.15ZM53.13,28.02l-4.48,.65,3.24,3.16-.76,4.46,4-2.1,4,2.1-.76-4.46,3.24-3.16-4.48-.65-2-4.06-2,4.06Zm14.37,17.17l-7.45,1.08,5.39,5.25-1.27,7.42,6.66-3.5,6.66,3.5-1.27-7.42,5.39-5.25-7.45-1.08-3.33-6.75-3.33,6.75Z" fill="#fff" stroke="#fff" stroke-miterlimit="10" stroke-width="2"/>
              </svg>
            `;

            this.iconTheme = document.getElementById('btn-theme-svg');
            this.iconTheme.classList.remove('light-relax');
        }

        this.iconTheme = document.getElementById('btn-theme-svg');
    }

    changingTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('isDarkTheme', String(this.isDarkTheme));
        this.checkingTheme();
    }
}

const themes = new Themes();
